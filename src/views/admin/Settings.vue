<template>
  <div class="space-y-6">
    <el-card>
      <template #header>
        <div class="flex items-center justify-between">
          <span class="text-lg font-bold">系统设置</span>
        </div>
      </template>

      <el-tabs v-model="activeTab" class="responsive-tabs">
        <el-tab-pane label="基本设置" name="basic">
          <el-form ref="basicFormRef" :model="basicForm" :label-width="formLabelWidth">
            <el-form-item label="网站名称">
              <el-input v-model="basicForm.siteName" placeholder="请输入网站名称" />
            </el-form-item>
            <el-form-item label="网站描述">
              <el-input
                v-model="basicForm.siteDescription"
                type="textarea"
                :rows="3"
                placeholder="请输入网站描述"
              />
            </el-form-item>
            <el-form-item label="网站关键词">
              <el-input v-model="basicForm.siteKeywords" placeholder="请输入网站关键词，用逗号分隔" />
            </el-form-item>
            <el-form-item label="联系邮箱">
              <el-input v-model="basicForm.contactEmail" placeholder="请输入联系邮箱" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="saving" @click="handleSaveBasic">
                保存设置
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="分类管理" name="categories">
          <div class="mb-4">
            <el-button type="primary" @click="showCategoryDialog = true">
              <el-icon class="mr-1"><Plus /></el-icon>
              新建分类
            </el-button>
          </div>
          <el-table :data="categories" v-loading="categoriesLoading" stripe class="responsive-table">
            <el-table-column prop="name" label="分类名称" min-width="120" />
            <el-table-column prop="slug" label="标识符" min-width="120" />
            <el-table-column prop="articleCount" label="文章数" width="100" align="center" />
            <el-table-column label="操作" width="150" fixed="right">
              <template #default="{ row }">
                <el-button type="primary" size="small" link @click="handleEditCategory(row)">
                  编辑
                </el-button>
                <el-button type="danger" size="small" link @click="handleDeleteCategory(row)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="标签管理" name="tags">
          <div class="mb-4">
            <el-button type="primary" @click="showTagDialog = true">
              <el-icon class="mr-1"><Plus /></el-icon>
              新建标签
            </el-button>
          </div>
          <el-table :data="tags" v-loading="tagsLoading" stripe class="responsive-table">
            <el-table-column prop="name" label="标签名称" min-width="120" />
            <el-table-column prop="slug" label="标识符" min-width="120" />
            <el-table-column label="操作" width="150" fixed="right">
              <template #default="{ row }">
                <el-button type="primary" size="small" link @click="handleEditTag(row)">
                  编辑
                </el-button>
                <el-button type="danger" size="small" link @click="handleDeleteTag(row)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="安全设置" name="security">
          <el-form ref="securityFormRef" :model="securityForm" :label-width="formLabelWidth">
            <el-form-item label="允许注册">
              <el-switch v-model="securityForm.allowRegister" />
            </el-form-item>
            <el-form-item label="评论审核">
              <el-switch v-model="securityForm.commentModeration" />
            </el-form-item>
            <el-form-item label="每日评论限制">
              <el-input-number v-model="securityForm.dailyCommentLimit" :min="0" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="saving" @click="handleSaveSecurity">
                保存设置
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <CategoryDialog
      v-model="showCategoryDialog"
      :category="currentCategory"
      @success="loadCategories"
    />

    <TagDialog
      v-model="showTagDialog"
      :tag="currentTag"
      @success="loadTags"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { categoryApi, tagApi, settingsApi } from '@/api';
import type { Category, Tag } from '@/api';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import CategoryDialog from '@/components/CategoryDialog.vue';
import TagDialog from '@/components/TagDialog.vue';

const activeTab = ref('basic');
const saving = ref(false);

const formLabelWidth = computed(() => {
  return window.innerWidth < 768 ? '80px' : '120px';
});

const basicForm = reactive({
  siteName: '',
  siteDescription: '',
  siteKeywords: '',
  contactEmail: '',
});

const securityForm = reactive({
  allowRegister: true,
  commentModeration: true,
  dailyCommentLimit: 10,
});

const categories = ref<Category[]>([]);
const categoriesLoading = ref(false);
const showCategoryDialog = ref(false);
const currentCategory = ref<Category | null>(null);

const tags = ref<Tag[]>([]);
const tagsLoading = ref(false);
const showTagDialog = ref(false);
const currentTag = ref<Tag | null>(null);

const loadCategories = async () => {
  try {
    categoriesLoading.value = true;
    categories.value = await categoryApi.getCategoryList();
  } catch (error) {
    console.error('Failed to load categories:', error);
  } finally {
    categoriesLoading.value = false;
  }
};

const loadTags = async () => {
  try {
    tagsLoading.value = true;
    tags.value = await tagApi.getTagList();
  } catch (error) {
    console.error('Failed to load tags:', error);
  } finally {
    tagsLoading.value = false;
    currentTag.value = null;
  }
};

const handleSaveBasic = async () => {
  try {
    saving.value = true;
    await settingsApi.updateBasicSettings({
      siteName: basicForm.siteName,
      siteDescription: basicForm.siteDescription,
      siteKeywords: basicForm.siteKeywords,
      contactEmail: basicForm.contactEmail,
    });
    ElMessage.success('保存成功');
  } catch (error) {
    ElMessage.error('保存失败');
  } finally {
    saving.value = false;
  }
};

const handleSaveSecurity = async () => {
  try {
    saving.value = true;
    await settingsApi.updateSecuritySettings({
      allowRegister: securityForm.allowRegister,
      commentModeration: securityForm.commentModeration,
      dailyCommentLimit: securityForm.dailyCommentLimit,
    });
    ElMessage.success('保存成功');
  } catch (error) {
    ElMessage.error('保存失败');
  } finally {
    saving.value = false;
  }
};

const handleEditCategory = (category: Category) => {
  currentCategory.value = category;
  showCategoryDialog.value = true;
};

const handleDeleteCategory = async (category: Category) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除分类"${category.name}"吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );

    await categoryApi.deleteCategory(category.id);
    ElMessage.success('删除成功');
    loadCategories();
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败');
    }
  }
};

const handleEditTag = (tag: Tag) => {
  currentTag.value = tag;
  showTagDialog.value = true;
};

const handleDeleteTag = async (tag: Tag) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除标签"${tag.name}"吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );

    await tagApi.deleteTag(tag.id);
    ElMessage.success('删除成功');
    loadTags();
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败');
    }
  }
};

const loadSettings = async () => {
  try {
    const settings = await settingsApi.getSettings();
    basicForm.siteName = settings.siteName || '';
    basicForm.siteDescription = settings.siteDescription || '';
    basicForm.siteKeywords = settings.siteKeywords || '';
    basicForm.contactEmail = settings.contactEmail || '';
    securityForm.allowRegister = settings.allowRegister ?? true;
    securityForm.commentModeration = settings.commentModeration ?? true;
    securityForm.dailyCommentLimit = settings.dailyCommentLimit ?? 10;
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
};

onMounted(() => {
  loadSettings();
  loadCategories();
  loadTags();
});
</script>
