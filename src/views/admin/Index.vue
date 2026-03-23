<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
    <div class="flex">
      <aside 
        class="fixed left-0 top-0 h-full bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 z-50 overflow-hidden"
        :class="[
          sidebarOpen ? 'w-64' : 'w-0 -translate-x-full lg:translate-x-0',
          isCollapsed ? 'lg:w-16' : 'lg:w-64'
        ]"
      >
        <div class="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between min-h-[72px]">
          <div 
            class="flex items-center transition-all duration-300 overflow-hidden"
            :class="isCollapsed ? 'w-16 justify-center' : 'w-auto'"
          >
            <div 
              class="flex-shrink-0 flex items-center justify-center transition-all duration-300"
              :class="isCollapsed ? 'w-16' : 'w-auto'"
            >
              <img
                v-if="adminConfig.logoUrl"
                :src="adminConfig.logoUrl"
                :alt="adminConfig.title"
                class="h-8 w-8 object-contain"
              >
              <div
                v-else
                class="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
              >
                {{ adminConfig.logo }}
              </div>
            </div>
            <h1 
              class="text-xl font-bold text-gray-900 dark:text-gray-100 transition-all duration-300 whitespace-nowrap overflow-hidden"
              :class="isCollapsed ? 'opacity-0 w-0 ml-0' : 'opacity-100 w-auto ml-3'"
            >
              {{ adminConfig.title }}
            </h1>
          </div>
          <button
            @click="toggleCollapse"
            class="hidden lg:flex items-center justify-center w-6 h-6 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
          >
            <svg 
              class="h-4 w-4 transition-transform duration-300 text-gray-600 dark:text-gray-400"
              :class="isCollapsed ? 'rotate-180' : ''"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
        
        <nav class="p-4">
          <router-link
            v-for="item in menuItems"
            :key="item.path"
            :to="item.path"
            @click="closeSidebar"
            class="flex items-center px-4 py-3 rounded-lg mb-2 transition-all duration-300 overflow-hidden"
            :class="[
              isActive(item.path) ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
              isCollapsed ? 'justify-center' : 'space-x-3'
            ]"
          >
            <component :is="item.icon" class="h-5 w-5 flex-shrink-0" />
            <span 
              class="transition-all duration-300 whitespace-nowrap"
              :class="isCollapsed ? 'lg:hidden opacity-0 w-0 ml-0' : 'opacity-100 w-auto ml-3'"
            >
              {{ item.name }}
            </span>
          </router-link>
        </nav>
      </aside>

      <main 
        class="flex-1 transition-all duration-300"
        :class="[
          sidebarOpen ? 'ml-64' : 'ml-0',
          isCollapsed ? 'lg:ml-16' : 'lg:ml-64'
        ]"
      >
        <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <button
                @click="toggleSidebar"
                class="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <svg class="h-6 w-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h2 class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">{{ pageTitle }}</h2>
            </div>
            <div class="flex items-center space-x-2 sm:space-x-4">
              <el-dropdown trigger="click">
                <div class="flex items-center space-x-2 cursor-pointer">
                  <img
                    :src="userInfo?.avatar || defaultAvatar"
                    :alt="userInfo?.username"
                    class="h-8 w-8 rounded-full object-cover"
                  >
                  <span class="hidden sm:block text-gray-700 dark:text-gray-300">{{ userInfo?.username }}</span>
                </div>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="goToProfile">
                      <el-icon><User /></el-icon>
                      个人中心
                    </el-dropdown-item>
                    <el-dropdown-item @click="goToHome">
                      <el-icon><House /></el-icon>
                      博客首页
                    </el-dropdown-item>
                    <el-dropdown-item divided @click="handleLogout">
                      <el-icon><SwitchButton /></el-icon>
                      退出登录
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </header>

        <div class="p-4 sm:p-6">
          <router-view />
        </div>
      </main>
    </div>

    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
      @click="closeSidebar"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { ElMessage } from 'element-plus';
import { User, SwitchButton, DataLine, Document, ChatDotRound, Setting, Picture } from '@element-plus/icons-vue';
import { adminConfig } from '@/config/admin';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const sidebarOpen = ref(false);
const isCollapsed = ref(false);

const userInfo = computed(() => authStore.userInfo);
const defaultAvatar = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"%3E%3Cpath stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /%3E%3C/svg%3E';

const menuItems = [
  { name: '仪表盘', path: '/admin/dashboard', icon: DataLine },
  { name: '文章管理', path: '/admin/articles', icon: Document },
  { name: '评论审核', path: '/admin/comments', icon: ChatDotRound },
  { name: '轮播图管理', path: '/admin/banners', icon: Picture },
  { name: '系统设置', path: '/admin/settings', icon: Setting },
];

const pageTitle = computed(() => {
  const item = menuItems.find(item => item.path === route.path);
  return item?.name || adminConfig.title;
});

const isActive = (path: string) => {
  return route.path === path;
};

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

const closeSidebar = () => {
  sidebarOpen.value = false;
};

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
};

const goToHome = () => {
  router.push('/');
};

const goToProfile = () => {
  router.push('/profile');
};

const handleLogout = async () => {
  try {
    await authStore.logout();
    ElMessage.success('退出登录成功');
    router.push('/login');
  } catch (error) {
    ElMessage.error('退出登录失败');
  }
};
</script>
