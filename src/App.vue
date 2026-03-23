<template>
  <div id="app" :class="{ 'dark': isDark }">
    <router-view />
    <GlobalLoading />
    <GlobalNotification />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useThemeStore } from '@/stores/theme';
import GlobalLoading from '@/components/GlobalLoading.vue';
import GlobalNotification from '@/components/GlobalNotification.vue';

const themeStore = useThemeStore();
const isDark = computed(() => {
  if (themeStore.theme === 'auto') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return themeStore.theme === 'dark';
});
</script>

<style>
#app {
  min-height: 100vh;
}
</style>
