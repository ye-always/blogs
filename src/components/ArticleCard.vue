<template>
  <div class="card overflow-hidden group">
    <div v-if="article.coverImage" class="relative h-48 overflow-hidden">
      <img
        :src="article.coverImage"
        :alt="article.title"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      >
      <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
    </div>

    <div class="p-6">
      <div class="flex items-center space-x-2 mb-3">
        <router-link
          :to="`/category/${article.category.id}`"
          class="px-3 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
        >
          {{ article.category.name }}
        </router-link>
        <span class="text-gray-400 dark:text-gray-600">·</span>
        <span class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(article.createdAt) }}</span>
      </div>

      <router-link :to="`/article/${article.id}`" class="block">
        <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {{ article.title }}
        </h3>
        <p class="text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
          {{ article.excerpt }}
        </p>
      </router-link>

      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <img
            :src="article.author.avatar || defaultAvatar"
            :alt="article.author.username"
            class="h-5 w-5 rounded-full object-cover"
          >
          <span class="text-sm text-gray-600 dark:text-gray-400">{{ article.author.username }}</span>
        </div>

        <div class="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <div class="flex items-center space-x-1">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>{{ formatNumber(article.views) }}</span>
            </div>
            <div class="flex items-center space-x-1">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{{ formatNumber(article.likes) }}</span>
            </div>
            <div class="flex items-center space-x-1">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>{{ formatNumber(article.comments) }}</span>
            </div>
          </div>
      </div>

      <div v-if="article.tags.length > 0" class="flex flex-wrap gap-2 mt-4">
        <router-link
          v-for="tag in article.tags"
          :key="tag.id"
          :to="`/tag/${tag.slug}`"
          class="px-2 py-1 text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          #{{ tag.name }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Article } from '@/api';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

const props = defineProps<{
  article: Article;
}>();

const defaultAvatar = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"%3E%3Cpath stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /%3E%3C/svg%3E';

const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD');
};

const formatNumber = (num: number | undefined) => {
  if (num === undefined || num === null) return '0';
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
};
</script>
