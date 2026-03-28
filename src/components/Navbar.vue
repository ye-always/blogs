<template>
  <nav :class="['fixed top-0 left-0 right-0 z-50 transition-all duration-300', scrolled ? 'bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-md' : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700']">
    <div class="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center space-x-8">
          <router-link to="/" class="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {{ siteName }}
          </router-link>
          <div class="hidden md:flex items-center space-x-6">
            <router-link
              v-for="item in menuItems"
              :key="item.path"
              :to="item.path"
              class="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 font-medium"
              active-class="text-indigo-600 dark:text-indigo-400"
            >
              {{ item.name }}
            </router-link>
          </div>
        </div>

        <div class="flex items-center space-x-4">
          <div class="relative hidden sm:block">
            <div class="flex items-center">
              <input
                v-model="searchQuery"
                ref="searchInput"
                type="text"
                placeholder="搜索文章..."
                :class="['transition-all duration-300', isSearchExpanded ? 'w-64' : 'w-48']"
                class="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                @keyup.enter="handleSearch"
                @focus="showSearchSuggestions = true"
                @blur="handleSearchBlur"
              >
              <svg class="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <button
                v-if="searchQuery"
                @click="clearSearch"
                class="absolute right-3 top-2.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div
              v-show="showSearchSuggestions && (searchHistory.length > 0 || searchQuery)"
              class="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
            >
              <div v-if="searchHistory.length > 0 && !searchQuery" class="p-3">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">搜索历史</span>
                  <button @click="clearSearchHistory" class="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">清空</button>
                </div>
                <div class="space-y-1">
                  <button
                    v-for="(item, index) in searchHistory.slice(0, 5)"
                    :key="index"
                    @click="searchFromHistory(item)"
                    class="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center justify-between"
                  >
                    <span>{{ item }}</span>
                    <svg class="h-4 w-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>
              </div>
              <div v-if="searchQuery" class="p-3">
                <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">搜索建议</div>
                <button
                  @click="handleSearch"
                  class="w-full text-left px-3 py-2 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                >
                  搜索 "{{ searchQuery }}"
                </button>
              </div>
            </div>
          </div>

          <button
            @click="toggleTheme"
            :class="['p-2 rounded-full transition-all duration-300', isDark ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-yellow-400']"
            title="切换主题 (Ctrl+T)"
          >
            <transition name="theme-icon" mode="out-in">
              <svg v-if="isDark" key="sun" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <svg v-else key="moon" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </transition>
          </button>

          <template v-if="isAuthenticated">
            <el-dropdown trigger="click">
              <div class="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full px-2 py-1 transition-colors">
                <img
                  :src="userInfo?.avatar || defaultAvatar"
                  :alt="userInfo?.username"
                  class="h-6 w-6 rounded-full object-cover"
                >
                <span class="hidden sm:block text-gray-700 dark:text-gray-300 font-medium">{{ userInfo?.username }}</span>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="goToProfile">
                    <el-icon><User /></el-icon>
                    个人中心
                  </el-dropdown-item>
                  <el-dropdown-item v-if="isAdmin" @click="goToAdmin">
                    <el-icon><Setting /></el-icon>
                    管理后台
                  </el-dropdown-item>
                  <el-dropdown-item divided @click="handleLogout">
                    <el-icon><SwitchButton /></el-icon>
                    退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <template v-else>
            <router-link to="/login" class="btn-primary">
              登录
            </router-link>
          </template>

          <button
            @click="toggleMobileMenu"
            class="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <svg class="h-6 w-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div v-show="isMobileMenuOpen" class="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div class="px-4 py-3 space-y-2">
        <div class="relative mb-4">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索文章..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            @keyup.enter="handleSearch"
          >
          <svg class="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="block px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          active-class="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
          @click="isMobileMenuOpen = false"
        >
          {{ item.name }}
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useThemeStore } from '@/stores/theme';
import { settingsApi } from '@/api';
import { ElMessage } from 'element-plus';
import { User, Setting, SwitchButton } from '@element-plus/icons-vue';

const router = useRouter();
const authStore = useAuthStore();
const themeStore = useThemeStore();

const searchQuery = ref('');
const isMobileMenuOpen = ref(false);
const siteName = ref('Blog');
const defaultAvatar = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"%3E%3Cpath stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /%3E%3C/svg%3E';
const searchInput = ref<HTMLInputElement | null>(null);
const showSearchSuggestions = ref(false);
const searchHistory = ref<string[]>([]);
const scrolled = ref(false);
const isSearchExpanded = ref(false);

const menuItems = [
  { name: '首页', path: '/' },
  { name: '分类', path: '/category' },
  { name: '标签', path: '/tag' },
  { name: '关于', path: '/about' },
];

const isAuthenticated = computed(() => authStore.isAuthenticated);
const isAdmin = computed(() => authStore.isAdmin);
const userInfo = computed(() => authStore.userInfo);
const isDark = computed(() => themeStore.theme === 'dark' || (themeStore.theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches));

const loadSiteSettings = async () => {
  try {
    const settings = await settingsApi.getPublicSettings();
    siteName.value = settings.siteName || 'Blog';
  } catch (error) {
    console.error('Failed to load site settings:', error);
  }
};

const loadSearchHistory = () => {
  const history = localStorage.getItem('searchHistory');
  if (history) {
    try {
      searchHistory.value = JSON.parse(history);
    } catch (error) {
      console.error('Failed to parse search history:', error);
    }
  }
};

const saveSearchHistory = (query: string) => {
  if (!query.trim()) return;
  
  const history = searchHistory.value.filter(item => item !== query);
  history.unshift(query);
  
  if (history.length > 10) {
    history.pop();
  }
  
  searchHistory.value = history;
  localStorage.setItem('searchHistory', JSON.stringify(history));
};

onMounted(() => {
  loadSiteSettings();
  loadSearchHistory();
  themeStore.initTheme();
  
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('keydown', handleKeydown);
});

const handleScroll = () => {
  scrolled.value = window.scrollY > 10;
};

const handleKeydown = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    searchInput.value?.focus();
    isSearchExpanded.value = true;
  }
  
  if ((e.ctrlKey || e.metaKey) && e.key === 't') {
    e.preventDefault();
    toggleTheme();
  }
  
  if (e.key === 'Escape') {
    showSearchSuggestions.value = false;
    isSearchExpanded.value = false;
  }
};

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    saveSearchHistory(searchQuery.value);
    router.push({ name: 'Search', query: { q: searchQuery.value } });
    isMobileMenuOpen.value = false;
    showSearchSuggestions.value = false;
  }
};

const clearSearch = () => {
  searchQuery.value = '';
  searchInput.value?.focus();
};

const searchFromHistory = (item: string) => {
  searchQuery.value = item;
  handleSearch();
};

const clearSearchHistory = () => {
  searchHistory.value = [];
  localStorage.removeItem('searchHistory');
  ElMessage.success('搜索历史已清空');
};

const handleSearchBlur = () => {
  setTimeout(() => {
    showSearchSuggestions.value = false;
  }, 200);
};

const toggleTheme = () => {
  const newTheme = themeStore.theme === 'light' ? 'dark' : 'light';
  themeStore.setTheme(newTheme);
};

const goToProfile = () => {
  router.push('/profile');
};

const goToAdmin = () => {
  router.push('/admin/dashboard');
};

const handleLogout = async () => {
  try {
    await authStore.logout();
    ElMessage.success('退出登录成功');
    router.push('/');
  } catch (error) {
    ElMessage.error('退出登录失败');
  }
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};
</script>

<style scoped>
.theme-icon-enter-active,
.theme-icon-leave-active {
  transition: all 0.3s ease;
}

.theme-icon-enter-from {
  opacity: 0;
  transform: rotate(-90deg) scale(0.5);
}

.theme-icon-leave-to {
  opacity: 0;
  transform: rotate(90deg) scale(0.5);
}

.btn-primary {
  @apply px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-medium hover:shadow-lg transition-all duration-200;
}
</style>
