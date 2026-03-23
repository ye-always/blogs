<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-300">
    <Navbar />
    
    <main class="flex-1">
      <BannerCarousel :banners="banners" />
      
      <div class="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">最新文章</h1>
          <p class="text-gray-600 dark:text-gray-400">发现最新的技术文章和见解</p>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2">
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
              <p class="text-gray-600 dark:text-gray-400">还没有发布任何文章</p>
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

          <div class="space-y-6">
            <div class="card p-6">
              <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">分类</h3>
              <div v-if="categoriesLoading" class="space-y-2">
                <div v-for="i in 5" :key="i" class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
              <div v-else class="space-y-2">
                <router-link
                  v-for="category in categories"
                  :key="category.id"
                  :to="`/category/${category.id}`"
                  class="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <span class="text-gray-700 dark:text-gray-300">{{ category.name }}</span>
                  <span class="text-sm text-gray-500 dark:text-gray-400">{{ category.articleCount }}</span>
                </router-link>
              </div>
            </div>

            <div class="card p-6">
              <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">热门标签</h3>
              <div v-if="tagsLoading" class="flex flex-wrap gap-2">
                <div v-for="i in 8" :key="i" class="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
              <div v-else class="flex flex-wrap gap-2">
                <router-link
                  v-for="tag in tags"
                  :key="tag.id"
                  :to="`/tag/${tag.slug}`"
                  class="px-3 py-1 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  #{{ tag.name }}
                </router-link>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { articleApi, categoryApi, tagApi, bannerApi } from '@/api';
import type { Article, Category, Tag } from '@/api';
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';
import ArticleCard from '@/components/ArticleCard.vue';
import BannerCarousel from '@/components/BannerCarousel.vue';
import type { Banner } from '@/components/BannerCarousel.vue';

const loading = ref(false);
const articles = ref<Article[]>([]);
const currentPage = ref(1);
const pageSize = ref(4);
const total = ref(0);

const categoriesLoading = ref(false);
const categories = ref<Category[]>([]);

const tagsLoading = ref(false);
const tags = ref<Tag[]>([]);

const banners = ref<Banner[]>([]);

const loadArticles = async () => {
  try {
    loading.value = true;
    const data = await articleApi.getArticleList({
      page: currentPage.value,
      pageSize: pageSize.value,
    });
    articles.value = data.list || [];
    total.value = data.total || 0;
  } catch (error) {
    console.error('Failed to load articles:', error);
  } finally {
    loading.value = false;
  }
};

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
  }
};

const loadBanners = async () => {
  try {
    const data = await bannerApi.getBannerList();
    banners.value = data;
  } catch (error) {
    console.error('Failed to load banners:', error);
  }
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  loadArticles();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

onMounted(() => {
  loadArticles();
  loadCategories();
  loadTags();
  loadBanners();
});
</script>
