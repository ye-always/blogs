<template>
  <el-dialog
    v-model="visible"
    :title="isEdit ? '编辑文章' : '新建文章'"
    width="80%"
    :before-close="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="form.title" placeholder="请输入文章标题" />
      </el-form-item>
      
      <el-form-item label="文章分类" prop="categoryId">
        <el-select v-model="form.categoryId" placeholder="请选择分类" style="width: 100%">
          <el-option
            v-for="category in categories"
            :key="category.id"
            :label="category.name"
            :value="category.id"
          />
        </el-select>
      </el-form-item>
      
      <el-form-item label="文章标签" prop="tagIds">
        <el-select
          v-model="form.tagIds"
          multiple
          placeholder="请选择标签"
          style="width: 100%"
        >
          <el-option
            v-for="tag in tags"
            :key="tag.id"
            :label="tag.name"
            :value="tag.id"
          />
        </el-select>
      </el-form-item>
      
      <el-form-item label="封面图片" prop="coverImage">
        <el-upload
          class="cover-uploader"
          :action="uploadUrl"
          :headers="uploadHeaders"
          :show-file-list="false"
          :on-success="handleCoverSuccess"
          :before-upload="beforeCoverUpload"
        >
          <img v-if="form.coverImage" :src="form.coverImage" class="cover-image" />
          <el-icon v-else class="cover-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      
      <el-form-item label="文章摘要" prop="excerpt">
        <el-input
          v-model="form.excerpt"
          type="textarea"
          :rows="3"
          placeholder="请输入文章摘要"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
      
      <el-form-item label="文章内容" prop="content">
        <MdEditor
          :key="mdEditorKey"
          v-model="form.content"
          :toolbars="toolbars"
          :preview="true"
          :html="true"
          language="zh-CN"
          @onUploadImg="handleEditorUploadImg"
          placeholder="请输入文章内容（支持Markdown）"
          class="custom-md-editor"
        />
      </el-form-item>
      
      <el-form-item label="发布状态" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio label="draft">草稿</el-radio>
          <el-radio label="published">发布</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="flex justify-end space-x-3">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" :loading="loading" @click="handleSubmit">
          {{ isEdit ? '保存' : '发布' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue';
import { articleApi, tagApi } from '@/api';
import { useAuthStore } from '@/stores/auth';
import type { Article, Category, Tag } from '@/api';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { MdEditor, ToolbarNames } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import httpClient from '@/utils/httpClient';

const toolbars: ToolbarNames[] = [
  'bold',
  'underline',
  'italic',
  'strikeThrough',
  '-',
  'title',
  'sub',
  'sup',
  'quote',
  'unorderedList',
  'orderedList',
  'task',
  '-',
  'codeRow',
  'code',
  'link',
  'image',
  'table',
  '-',
  'revoke',
  'next',
  'save',
  '=',
  'pageFullscreen',
  'fullscreen',
  'preview',
  'htmlPreview',
  'catalog'
];

interface Props {
  modelValue: boolean;
  article: Article | null;
  categories: Category[];
}

const props = withDefaults(defineProps<Props>(), {
  article: null,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'success'): void;
}>();

const authStore = useAuthStore();

const visible = ref(false);
const loading = ref(false);
const formRef = ref<FormInstance>();
const tags = ref<Tag[]>([]);

const uploadUrl = computed(() => {
  return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}/upload/image`;
});

const uploadHeaders = computed(() => {
  return {
    'Authorization': `Bearer ${authStore.token}`
  };
});

const form = reactive({
  title: '',
  categoryId: '',
  tagIds: [] as string[],
  coverImage: '',
  excerpt: '',
  content: '',
  status: 'draft',
});

const mdEditorKey = ref(0);

const rules: FormRules = {
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    { min: 1, max: 100, message: '标题长度在1到100个字符', trigger: 'blur' },
  ],
  categoryId: [
    { required: true, message: '请选择文章分类', trigger: 'change' },
  ],
  excerpt: [
    { required: true, message: '请输入文章摘要', trigger: 'blur' },
    { max: 200, message: '摘要不能超过200个字符', trigger: 'blur' },
  ],
  content: [
    { required: true, message: '请输入文章内容', trigger: 'blur' },
  ],
};

const isEdit = computed(() => !!props.article);

watch(() => props.modelValue, (val) => {
  visible.value = val;
  if (val) {
    loadTags();
    if (props.article) {
      Object.assign(form, {
        title: props.article.title,
        categoryId: props.article.category.id,
        tagIds: props.article.tags.map(t => t.id),
        coverImage: props.article.coverImage || '',
        excerpt: props.article.excerpt,
        content: props.article.content,
        status: props.article.status,
      });
    } else {
      resetForm();
    }
  }
});

watch(visible, (val) => {
  emit('update:modelValue', val);
  if (!val) {
    resetForm();
  }
});

const resetForm = () => {
  form.title = '';
  form.categoryId = '';
  form.tagIds = [];
  form.coverImage = '';
  form.excerpt = '';
  form.content = '';
  form.status = 'draft';
  formRef.value?.clearValidate();
  mdEditorKey.value++;
};

const loadTags = async () => {
  try {
    tags.value = await tagApi.getTagList();
  } catch (error) {
    console.error('Failed to load tags:', error);
  }
};

const handleClose = () => {
  visible.value = false;
};

const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    loading.value = true;

    if (isEdit.value) {
      await articleApi.updateArticle(props.article!.id, form);
      ElMessage.success('更新成功');
    } else {
      await articleApi.createArticle(form);
      ElMessage.success('创建成功');
    }

    emit('success');
    handleClose();
  } catch (error: any) {
    if (error !== false) {
      ElMessage.error(error.message || '操作失败');
    }
  } finally {
    loading.value = false;
  }
};

const beforeCoverUpload = (file: File) => {
  const isImage = file.type.startsWith('image/');
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isImage) {
    ElMessage.error('只能上传图片文件!');
    return false;
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!');
    return false;
  }
  return true;
};

const handleCoverSuccess = (response: any) => {
  console.log('封面上传成功响应:', response);
  if (response.code === 200) {
    const imageUrl = response.data.url;
    const fullUrl = imageUrl.startsWith('http') ? imageUrl : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}${imageUrl}`;
    form.coverImage = fullUrl;
    ElMessage.success('上传成功');
  } else {
    ElMessage.error(response.message || '上传失败');
  }
};

const handleEditorUploadImg = async (files: File[], callback: (urls: string[]) => void) => {
  console.log('开始上传图片，文件数量:', files.length);
  
  const uploadPromises = files.map(async (file, index) => {
    console.log(`正在上传第 ${index + 1} 个文件:`, file.name, '大小:', file.size);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await httpClient.post('/upload/image', formData, {
        skipErrorHandler: true
      });
      
      console.log('上传响应数据:', response);
      
      if (response.url) {
        const imageUrl = response.url;
        const fullUrl = imageUrl.startsWith('http') ? imageUrl : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}${imageUrl}`;
        console.log('文件上传成功:', fullUrl);
        return fullUrl;
      } else {
        console.error('上传失败: 响应中没有URL');
        ElMessage.error('上传失败: 服务器未返回图片URL');
        return '';
      }
    } catch (error: any) {
      console.error('上传异常:', error);
      if (error.response) {
        console.error('错误响应:', error.response.data);
        ElMessage.error(`上传失败: ${error.response.data?.message || error.response.statusText || '服务器错误'}`);
      } else if (error.request) {
        console.error('无响应:', error.request);
        ElMessage.error('网络错误，请检查连接');
      } else {
        console.error('请求错误:', error.message);
        ElMessage.error('图片上传失败，请检查网络连接');
      }
      return '';
    }
  });

  try {
    const urls = await Promise.all(uploadPromises);
    console.log('所有文件上传完成:', urls);
    const validUrls = urls.filter(url => url !== '');
    callback(validUrls);
  } catch (error) {
    console.error('批量上传失败:', error);
    ElMessage.error('图片上传失败');
  }
};
</script>

<style scoped>
.cover-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s;
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cover-uploader:hover {
  border-color: #409eff;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-uploader-icon {
  font-size: 28px;
  color: #8c939d;
}

:deep(.md-editor) {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

:deep(.md-editor:hover) {
  border-color: #c0c4cc;
}

:deep(.md-editor-preview-wrapper) {
  padding: 16px;
}

.custom-md-editor {
  width: 100%;
}

:deep(.md-editor-toolbar) {
  border-bottom: 1px solid #dcdfe6;
}

:deep(.md-editor-content) {
  min-height: 400px;
}
</style>
