<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="mx-auto h-16 w-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
          <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
          404 - 页面未找到
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          抱歉，您访问的页面不存在
        </p>
      </div>
      <div class="flex justify-center space-x-4">
        <router-link
          to="/"
          class="btn-primary"
        >
          返回首页
        </router-link>
        <button
          @click="goBack"
          class="btn-secondary"
        >
          返回上页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
  router.back();
};
</script>
