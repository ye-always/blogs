<template>
  <div class="relative w-full overflow-hidden">
    <el-carousel
      v-if="banners.length > 0"
      :interval="5000"
      arrow="hover"
      indicator-position="outside"
      height="500px"
      class="banner-carousel"
    >
      <el-carousel-item v-for="item in banners" :key="item.id">
        <div class="relative w-full h-full">
          <img
            :src="item.image"
            :alt="item.title"
            class="w-full h-full object-cover"
            @error="handleImageError"
          >
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div class="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-12">
            <div class="max-w-container mx-auto">
              <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
                {{ item.title }}
              </h2>
              <p v-if="item.description" class="text-white/80 text-sm sm:text-base md:text-lg">
                {{ item.description }}
              </p>
              <router-link
                v-if="item.link"
                :to="item.link"
                class="inline-block mt-4 px-6 py-2 bg-white text-gray-900 rounded-full hover:bg-gray-100 transition-colors font-medium"
              >
                了解更多
              </router-link>
            </div>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
    <div v-else class="h-64 sm:h-80 md:h-96 lg:h-[500px] bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
      <div class="text-center text-white">
        <svg class="mx-auto h-16 w-16 mb-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p class="text-lg">暂无轮播图</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

export interface Banner {
  id: number;
  title: string;
  description?: string;
  image: string;
  link?: string;
  order: number;
  status: 'active' | 'inactive';
}

const props = defineProps<{
  banners: Banner[];
}>();

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"%3E%3Cpath stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /%3E%3C/svg%3E';
};
</script>

<style scoped>
.banner-carousel :deep(.el-carousel__item) {
  overflow: hidden;
}

.banner-carousel :deep(.el-carousel__indicator) {
  padding: 12px 4px;
}

.banner-carousel :deep(.el-carousel__button) {
  background-color: rgba(255, 255, 255, 0.5);
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.banner-carousel :deep(.el-carousel__indicator.is-active .el-carousel__button) {
  background-color: white;
  width: 24px;
  border-radius: 4px;
}
</style>
