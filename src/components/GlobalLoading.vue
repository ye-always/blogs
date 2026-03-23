<template>
  <div v-if="loading" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div class="bg-white rounded-xl p-8 shadow-2xl">
      <div class="flex flex-col items-center space-y-4">
        <div class="relative">
          <div class="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        </div>
        <p v-if="message" class="text-gray-600 font-medium">{{ message }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { eventBus } from '@/utils/eventBus';
import { EventTypes } from '@/utils/eventTypes';

const loading = ref(false);
const message = ref('');

const handleLoadingStart = (payload?: { key?: string; message?: string }) => {
  if (!payload?.key) {
    loading.value = true;
    message.value = payload?.message || '加载中...';
  }
};

const handleLoadingEnd = (payload?: { key?: string }) => {
  if (!payload?.key) {
    loading.value = false;
    message.value = '';
  }
};

onMounted(() => {
  eventBus.on(EventTypes.LOADING_START, handleLoadingStart);
  eventBus.on(EventTypes.LOADING_END, handleLoadingEnd);
});

onUnmounted(() => {
  eventBus.off(EventTypes.LOADING_START, handleLoadingStart);
  eventBus.off(EventTypes.LOADING_END, handleLoadingEnd);
});
</script>
