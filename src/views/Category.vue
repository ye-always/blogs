<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-300">
    <Navbar />
    
    <main class="flex-1 pt-20">
      <div class="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">分类: {{ category?.name }}</h1>
          <p v-if="category?.description" class="text-gray-600 dark:text-gray-400">{{ category.description }}</p>
        </div>

        <div v-if="loading" class="space-y-6">
          <div v-for="i in 3" :key="i" class="card p-6">
            <div class="animate-pulse space-y-4">
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          </div>
        </div>

        <div v-else-if="articles.length > 0" class="space-y-6">
          <ArticleCard
            v-for="article in articles"
            :key="article.id"
            :article="article"
          />
        </div>

        <div v-else class="card p-12 text-center">
          <svg class="mx-auto h-16 w-16 text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">暂无文章</h3>
          <p class="text-gray-600 dark:text-gray-400">该分类下还没有文章</p>
        </div>

        <div v-if="total > 0" class="mt-8 flex justify-center">
          <el-pagination
            v-model:current-page="currentPage"
            :page-size="pageSize"
            :total="total"
            layout="prev, pager, next"
            @current-change="handlePageChange"
          />
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { articleApi, categoryApi } from '@/api';
import type { Article, Category } from '@/api';
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';
import ArticleCard from '@/components/ArticleCard.vue';

const route = useRoute();

const categoryId = computed(() => Number(route.params.id));
const category = ref<Category | null>(null);
const loading = ref(false);
const articles = ref<Article[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

const loadCategory = async () => {
  try {
    category.value = await categoryApi.getCategoryDetail(categoryId.value);
  } catch (error) {
    console.error('Failed to load category:', error);
  }
};

const loadArticles = async () => {
  try {
    loading.value = true;
    const data = await articleApi.getArticleList({
      page: currentPage.value,
      pageSize: pageSize.value,
      categoryId: categoryId.value,
    });
    articles.value = data.list;
    total.value = data.total;
  } catch (error) {
    console.error('Failed to load articles:', error);
  } finally {
    loading.value = false;
  }
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  loadArticles();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

onMounted(() => {
  loadCategory();
  loadArticles();
});
</script>
