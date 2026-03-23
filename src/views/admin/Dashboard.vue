<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <div class="card p-4 sm:p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">总文章数</p>
            <p class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">{{ stats.totalArticles }}</p>
          </div>
          <div class="h-10 w-10 sm:h-12 sm:w-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
            <svg class="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card p-4 sm:p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">总浏览量</p>
            <p class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">{{ formatNumber(stats.totalViews) }}</p>
          </div>
          <div class="h-10 w-10 sm:h-12 sm:w-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
            <svg class="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card p-4 sm:p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">总评论数</p>
            <p class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">{{ stats.totalComments }}</p>
          </div>
          <div class="h-10 w-10 sm:h-12 sm:w-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
            <svg class="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card p-4 sm:p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">总收藏数</p>
            <p class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">{{ stats.totalCollects }}</p>
          </div>
          <div class="h-10 w-10 sm:h-12 sm:w-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
            <svg class="h-5 w-5 sm:h-6 sm:w-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="card p-4 sm:p-6">
        <h3 class="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">最新文章</h3>
        <div v-if="recentArticlesLoading" class="space-y-4">
          <div v-for="i in 5" :key="i" class="animate-pulse">
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
        <div v-else-if="recentArticles.length > 0" class="space-y-4">
          <router-link
            v-for="article in recentArticles"
            :key="article.id"
            :to="`/article/${article.id}`"
            class="block group"
          >
            <h4 class="text-gray-900 dark:text-gray-100 font-medium group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
              {{ article.title }}
            </h4>
            <div class="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
              <span>{{ formatDate(article.createdAt) }}</span>
              <span>{{ article.views }} 阅读</span>
            </div>
          </router-link>
        </div>
        <div v-else class="text-center py-4 text-gray-500 dark:text-gray-400">
          暂无文章
        </div>
      </div>

      <div class="card p-4 sm:p-6">
        <h3 class="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">待审核评论</h3>
        <div v-if="pendingCommentsLoading" class="space-y-4">
          <div v-for="i in 5" :key="i" class="animate-pulse">
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
        <div v-else-if="pendingComments.length > 0" class="space-y-4">
          <div
            v-for="comment in pendingComments"
            :key="comment.id"
            class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="font-medium text-gray-900 dark:text-gray-100">{{ comment.author.username }}</span>
              <span class="text-xs text-gray-500 dark:text-gray-400">{{ formatDate(comment.createdAt) }}</span>
            </div>
            <p class="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{{ comment.content }}</p>
            <div class="flex items-center space-x-2 mt-2">
              <el-button
                size="small"
                type="success"
                @click="handleApprove(comment.id)"
              >
                通过
              </el-button>
              <el-button
                size="small"
                type="danger"
                @click="handleReject(comment.id)"
              >
                拒绝
              </el-button>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-4 text-gray-500 dark:text-gray-400">
          暂无待审核评论
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { articleApi, adminApi, commentApi } from '@/api';
import type { Article, Comment } from '@/api';
import dayjs from 'dayjs';
import { ElMessage } from 'element-plus';

const stats = ref({
  totalArticles: 0,
  totalViews: 0,
  totalComments: 0,
  totalCollects: 0,
});

const recentArticles = ref<Article[]>([]);
const recentArticlesLoading = ref(false);

const pendingComments = ref<Comment[]>([]);
const pendingCommentsLoading = ref(false);

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

const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD');
};

const loadStats = async () => {
  try {
    const data = await adminApi.getDashboard();
    stats.value = data;
  } catch (error) {
    console.error('Failed to load stats:', error);
  }
};

const loadRecentArticles = async () => {
  try {
    recentArticlesLoading.value = true;
    const data = await articleApi.getArticleList({ page: 1, pageSize: 5 });
    recentArticles.value = data.list;
  } catch (error) {
    console.error('Failed to load recent articles:', error);
  } finally {
    recentArticlesLoading.value = false;
  }
};

const loadPendingComments = async () => {
  try {
    pendingCommentsLoading.value = true;
    const data = await adminApi.getPendingComments({ page: 1, pageSize: 5 });
    pendingComments.value = data.list;
  } catch (error) {
    console.error('Failed to load pending comments:', error);
  } finally {
    pendingCommentsLoading.value = false;
  }
};

const handleApprove = async (commentId: number) => {
  try {
    await commentApi.approveComment(commentId);
    ElMessage.success('审核通过');
    loadPendingComments();
    loadStats();
  } catch (error) {
    ElMessage.error('操作失败');
  }
};

const handleReject = async (commentId: number) => {
  try {
    await commentApi.rejectComment(commentId);
    ElMessage.success('已拒绝');
    loadPendingComments();
    loadStats();
  } catch (error) {
    ElMessage.error('操作失败');
  }
};

onMounted(() => {
  loadStats();
  loadRecentArticles();
  loadPendingComments();
});
</script>
