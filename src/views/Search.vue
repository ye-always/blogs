<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-300">
    <Navbar />
    
    <main class="flex-1 pt-20">
      <div class="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">搜索结果</h1>
          <p v-if="searchQuery" class="text-gray-600 dark:text-gray-400">关键词: "{{ searchQuery }}"</p>
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
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">未找到相关文章</h3>
          <p class="text-gray-600 dark:text-gray-400">试试其他关键词</p>
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
import { articleApi } from '@/api';
import type { Article } from '@/api';
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';
import ArticleCard from '@/components/ArticleCard.vue';

const route = useRoute();

const searchQuery = computed(() => (route.query.q as string) || '');
const loading = ref(false);
const articles = ref<Article[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

const loadArticles = async () => {
  if (!searchQuery.value) {
    articles.value = [];
    total.value = 0;
    return;
  }

  try {
    loading.value = true;
    console.log('搜索关键词:', searchQuery.value);
    const data = await articleApi.getArticleList({
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchQuery.value,
    });
    console.log('API返回数据:', data);
    console.log('文章列表:', data.list);
    console.log('总数:', data.total);
    articles.value = data.list || [];
    total.value = data.total || 0;
  } catch (error) {
    console.error('Failed to load articles:', error);
    articles.value = [];
    total.value = 0;
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
  loadArticles();
});
</script>
