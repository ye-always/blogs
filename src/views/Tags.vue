<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-300">
    <Navbar />
    
    <main class="flex-1 pt-20">
      <div class="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">文章标签</h1>
          <p class="text-gray-600 dark:text-gray-400">浏览所有文章标签</p>
        </div>

        <div v-if="loading" class="flex flex-wrap gap-3">
          <div v-for="i in 12" :key="i" class="h-10 bg-gray-200 dark:bg-gray-700 rounded-full w-24 animate-pulse"></div>
        </div>

        <div v-else-if="tags.length > 0" class="flex flex-wrap gap-3">
          <router-link
            v-for="tag in tags"
            :key="tag.id"
            :to="`/tag/${tag.name}`"
            class="inline-flex items-center px-4 py-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-indigo-500 dark:hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300 group"
          >
            <svg class="h-4 w-4 mr-2 text-indigo-500 dark:text-indigo-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <span class="font-medium">{{ tag.name }}</span>
            <span v-if="tag.articleCount !== undefined" class="ml-2 text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {{ tag.articleCount }} 篇
            </span>
          </router-link>
        </div>

        <div v-else class="card p-12 text-center">
          <svg class="mx-auto h-16 w-16 text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">暂无标签</h3>
          <p class="text-gray-600 dark:text-gray-400">还没有创建任何标签</p>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { tagApi } from '@/api';
import type { Tag } from '@/api';
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';

const tags = ref<Tag[]>([]);
const loading = ref(false);

const loadTags = async () => {
  try {
    loading.value = true;
    tags.value = await tagApi.getTagList();
  } catch (error) {
    console.error('Failed to load tags:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadTags();
});
</script>
