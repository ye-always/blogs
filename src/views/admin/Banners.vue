<template>
  <div class="card p-6">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <h2 class="text-xl font-semibold text-gray-900">轮播图管理</h2>
      <el-button type="primary" @click="handleCreate">
        <el-icon class="mr-1"><Plus /></el-icon>
        新建轮播图
      </el-button>
    </div>

    <div v-if="loading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="animate-pulse">
        <div class="h-32 bg-gray-200 rounded-lg"></div>
      </div>
    </div>

    <div v-else-if="banners.length > 0" class="space-y-4">
      <div
        v-for="banner in banners"
        :key="banner.id"
        class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
      >
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-shrink-0 w-full sm:w-48 h-32 bg-gray-100 rounded-lg overflow-hidden">
            <img
              v-if="banner.image"
              :src="banner.image"
              :alt="banner.title"
              class="w-full h-full object-cover"
              @error="handleImageError"
            >
            <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
              <svg class="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-2">
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ banner.title }}</h3>
                <p v-if="banner.description" class="text-sm text-gray-600 mb-2 line-clamp-2">
                  {{ banner.description }}
                </p>
                <div class="flex items-center gap-4 text-sm text-gray-500">
                  <span>排序: {{ banner.order }}</span>
                  <el-tag :type="banner.status === 'active' ? 'success' : 'info'" size="small">
                    {{ banner.status === 'active' ? '启用' : '禁用' }}
                  </el-tag>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <el-button
                  size="small"
                  @click="handleEdit(banner)"
                >
                  编辑
                </el-button>
                <el-button
                size="small"
                type="danger"
                @click="handleDelete(banner)"
              >
                删除
              </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-12 text-gray-500">
      <svg class="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <p>暂无轮播图</p>
    </div>

    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑轮播图' : '新建轮播图'"
      width="600px"
      @close="resetForm"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入描述"
          />
        </el-form-item>
        <el-form-item label="图片" prop="image">
          <el-upload
            class="banner-uploader"
            :action="uploadUrl"
            :headers="uploadHeaders"
            :show-file-list="false"
            :on-success="handleImageSuccess"
            :before-upload="beforeImageUpload"
          >
            <img v-if="form.image" :src="form.image" class="banner-image">
            <el-icon v-else class="banner-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="链接" prop="link">
          <el-input v-model="form.link" placeholder="请输入链接（可选）" />
        </el-form-item>
        <el-form-item label="排序" prop="order">
          <el-input-number v-model="form.order" :min="0" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="active">启用</el-radio>
            <el-radio label="inactive">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { ElMessage, ElMessageBox, type FormInstance, type FormRules, type UploadProps } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { bannerApi } from '@/api';
import { useAuthStore } from '@/stores/auth';

interface Banner {
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
  order: number;
  status: string;
}

const loading = ref(false);
const banners = ref<Banner[]>([]);
const dialogVisible = ref(false);
const isEdit = ref(false);
const submitting = ref(false);
const formRef = ref<FormInstance>();

const authStore = useAuthStore();

const uploadUrl = computed(() => {
  return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}/upload/banner`;
});

const uploadHeaders = computed(() => {
  return {
    'Authorization': `Bearer ${authStore.token}`
  };
});

const form = reactive({
  id: 0,
  title: '',
  description: '',
  image: '',
  link: '',
  order: 0,
  status: 'active',
});

const rules: FormRules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  image: [{ required: true, message: '请上传图片', trigger: 'change' }],
  order: [{ required: true, message: '请输入排序', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
};

const loadBanners = async () => {
  try {
    loading.value = true;
    const data = await bannerApi.getBannerList();
    banners.value = data;
  } catch (error) {
    ElMessage.error('加载轮播图失败');
    console.error('Failed to load banners:', error);
  } finally {
    loading.value = false;
  }
};

const handleCreate = () => {
  isEdit.value = false;
  dialogVisible.value = true;
};

const handleEdit = (banner: Banner) => {
  isEdit.value = true;
  Object.assign(form, banner);
  dialogVisible.value = true;
};

const handleDelete = async (banner: Banner) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除轮播图"${banner.title}"吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );

    await bannerApi.deleteBanner(banner.id);
    ElMessage.success('删除成功');
    loadBanners();
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败');
    }
  }
};

const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    submitting.value = true;

    if (isEdit.value) {
      await bannerApi.updateBanner(form.id, form);
      ElMessage.success('更新成功');
    } else {
      await bannerApi.createBanner(form);
      ElMessage.success('创建成功');
    }

    dialogVisible.value = false;
    loadBanners();
  } catch (error: any) {
    if (error !== false) {
      ElMessage.error(error.message || '操作失败');
    }
  } finally {
    submitting.value = false;
  }
};

const resetForm = () => {
  formRef.value?.resetFields();
  Object.assign(form, {
    id: 0,
    title: '',
    description: '',
    image: '',
    link: '',
    order: 0,
    status: 'active',
  });
};

const handleImageSuccess: UploadProps['onSuccess'] = (response) => {
  console.log('轮播图上传成功响应:', response);
  if (response.code === 200) {
    const imageUrl = response.data.url;
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
    const apiBaseUrl = baseUrl.replace(/\/api$/, '');
    const fullUrl = imageUrl.startsWith('http') ? imageUrl : `${apiBaseUrl}${imageUrl}`;
    form.image = fullUrl;
    ElMessage.success('图片上传成功');
  } else {
    ElMessage.error(response.message || '图片上传失败');
  }
};

const beforeImageUpload: UploadProps['beforeUpload'] = (rawFile) => {
  const isImage = rawFile.type.startsWith('image/');
  const isLt5M = rawFile.size / 1024 / 1024 < 5;

  if (!isImage) {
    ElMessage.error('只能上传图片文件！');
    return false;
  }
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过 5MB！');
    return false;
  }
  return true;
};

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"%3E%3Cpath stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /%3E%3C/svg%3E';
};

onMounted(() => {
  loadBanners();
});
</script>

<style scoped>
.banner-uploader {
  width: 100%;
}

.banner-uploader :deep(.el-upload) {
  width: 100%;
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.banner-uploader :deep(.el-upload:hover) {
  border-color: var(--el-color-primary);
}

.banner-uploader :deep(.el-upload-dragger) {
  width: 100%;
  height: 200px;
}

.banner-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
}

.banner-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100%;
  height: 200px;
  text-align: center;
  line-height: 200px;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
