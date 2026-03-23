<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-300">
    <Navbar />
    
    <main class="flex-1 pt-20">
      <div class="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">文章分类</h1>
          <p class="text-gray-600 dark:text-gray-400">浏览所有文章分类</p>
        </div>

        <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="i in 6" :key="i" class="card p-6">
            <div class="animate-pulse space-y-4">
              <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          </div>
        </div>

        <div v-else-if="categories.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <router-link
            v-for="category in categories"
            :key="category.id"
            :to="`/category/${category.id}`"
            class="card p-6 hover:shadow-lg transition-shadow duration-300 group"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {{ category.name }}
                </h2>
                <p v-if="category.description" class="text-gray-600 dark:text-gray-400 mt-2 text-sm">
                  {{ category.description }}
                </p>
              </div>
              <div class="flex-shrink-0">
                <svg class="h-8 w-8 text-indigo-500 dark:text-indigo-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
            <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {{ category.articleCount }} 篇文章
            </div>
          </router-link>
        </div>

        <div v-else class="card p-12 text-center">
          <svg class="mx-auto h-16 w-16 text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">暂无分类</h3>
          <p class="text-gray-600 dark:text-gray-400">还没有创建任何分类</p>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { categoryApi } from '@/api';
import type { Category } from '@/api';
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';

const categories = ref<Category[]>([]);
const loading = ref(false);

const loadCategories = async () => {
  try {
    loading.value = true;
    categories.value = await categoryApi.getCategoryList();
  } catch (error) {
    console.error('Failed to load categories:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadCategories();
});
</script>
