<template>
  <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto transition-colors duration-300">
    <div class="max-w-container mx-auto px-4 sm:px-6 lg:px-6 py-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">关于博客</h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm">
            分享技术见解，记录学习心得，与大家一起成长。
          </p>
        </div>
        <div>
          <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">快速链接</h3>
          <div class="flex items-center gap-[20px]">
            <router-link to="/" class="block text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm">
              首页
            </router-link>
            <router-link to="/category" class="block text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm">
              分类
            </router-link>
            <router-link to="/tag" class="block text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm">
              标签
            </router-link>
            <router-link to="/about" class="block text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm">
              关于
            </router-link>
          </div>
        </div>
        <div>
          <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">联系方式</h3>
          <div class="space-y-2">
            <p class="text-gray-600 dark:text-gray-400 text-sm">
              <svg class="inline h-4 w-4 mr-1 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              2674199819@qq.com
            </p>
            <p class="text-gray-600 dark:text-gray-400 text-sm">
              <svg class="inline h-4 w-4 mr-1 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              中国
            </p>
          </div>
        </div>
      </div>
      <div class="border-t border-gray-200 dark:border-gray-700 mt-4 pt-6 text-center text-gray-600 dark:text-gray-400 text-sm">
        <p>&copy; {{ new Date().getFullYear() }} Blog. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
</script>
