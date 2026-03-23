<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索文章..."
          class="w-full sm:w-64"
          clearable
          @clear="loadArticles"
          @keyup.enter="loadArticles"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select
          v-model="selectedCategory"
          placeholder="选择分类"
          clearable
          class="w-full sm:w-48"
          @change="loadArticles"
        >
          <el-option
            v-for="category in categories"
            :key="category.id"
            :label="category.name"
            :value="category.id"
          />
        </el-select>
      </div>
      <el-button type="primary" @click="handleCreate" class="w-full sm:w-auto">
        <el-icon class="mr-1"><Plus /></el-icon>
        新建文章
      </el-button>
    </div>

    <el-card>
      <el-table :data="articles" v-loading="loading" stripe class="responsive-table">
        <el-table-column prop="title" label="标题" min-width="200" />
        <el-table-column prop="category.name" label="分类" width="120" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="views" label="浏览" width="80" align="center" />
        <el-table-column prop="likes" label="点赞" width="80" align="center" />
        <el-table-column prop="comments" label="评论" width="80" align="center" />
        <el-table-column label="发布时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button
              type="primary"
              size="small"
              link
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              size="small"
              link
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="mt-4 flex justify-center">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          layout="prev, pager, next"
          @current-change="loadArticles"
        />
      </div>
    </el-card>

    <ArticleFormDialog
      v-model="showFormDialog"
      :article="currentArticle"
      :categories="categories"
      @success="handleFormSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { articleApi, categoryApi } from '@/api';
import type { Article, Category } from '@/api';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search, Plus } from '@element-plus/icons-vue';
import ArticleFormDialog from '@/components/ArticleFormDialog.vue';

const loading = ref(false);
const articles = ref<Article[]>([]);
const categories = ref<Category[]>([]);
const searchKeyword = ref('');
const selectedCategory = ref('');
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

const showFormDialog = ref(false);
const currentArticle = ref<Article | null>(null);

const loadArticles = async () => {
  try {
    loading.value = true;
    const data = await articleApi.getArticleList({
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchKeyword.value || undefined,
      categoryId: selectedCategory.value || undefined,
    });
    articles.value = data.list;
    total.value = data.total;
  } catch (error) {
    console.error('Failed to load articles:', error);
  } finally {
    loading.value = false;
  }
};

const loadCategories = async () => {
  try {
    categories.value = await categoryApi.getCategoryList();
  } catch (error) {
    console.error('Failed to load categories:', error);
  }
};

const getStatusType = (status: string) => {
  const types: Record<string, any> = {
    published: 'success',
    draft: 'info',
    archived: 'warning',
  };
  return types[status] || 'info';
};

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    published: '已发布',
    draft: '草稿',
    archived: '已归档',
  };
  return texts[status] || status;
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('zh-CN');
};

const handleCreate = () => {
  currentArticle.value = null;
  showFormDialog.value = true;
};

const handleEdit = (article: Article) => {
  currentArticle.value = article;
  showFormDialog.value = true;
};

const handleDelete = async (article: Article) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除文章"${article.title}"吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );

    await articleApi.deleteArticle(article.id);
    ElMessage.success('删除成功');
    loadArticles();
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败');
    }
  }
};

const handleFormSuccess = () => {
  loadArticles();
};

onMounted(() => {
  loadArticles();
  loadCategories();
});
</script>
