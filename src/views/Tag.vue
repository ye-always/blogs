<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <Navbar />
    
    <main class="flex-1 pt-20">
      <div class="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">标签: #{{ tagName }}</h1>
        </div>

        <div v-if="loading" class="space-y-6">
          <div v-for="i in 3" :key="i" class="card p-6">
            <div class="animate-pulse space-y-4">
              <div class="h-4 bg-gray-200 rounded w-1/4"></div>
              <div class="h-6 bg-gray-200 rounded w-3/4"></div>
              <div class="h-4 bg-gray-200 rounded w-full"></div>
              <div class="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>

        <div v-else-if="articles.length > 0" class="space-y-6">
          <ArticleCard
            v-for="article in articles"
            :key="article.id"
            :article="article"
          />
        </div>

        <div v-else class="card p-12 text-center">
          <svg class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-2">暂无文章</h3>
          <p class="text-gray-600">该标签下还没有文章</p>
        </div>

        <div v-if="total > 0" class="mt-8 flex justify-center">
          <el-pagination
            v-model:current-page="currentPage"
            :page-size="pageSize"
            :total="total"
            layout="prev, pager, next"
            @current-change="handlePageChange"
          />
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { articleApi, tagApi } from '@/api';
import type { Article, Tag } from '@/api';
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';
import ArticleCard from '@/components/ArticleCard.vue';

const route = useRoute();

const tagName = computed(() => route.params.name as string);
const loading = ref(false);
const articles = ref<Article[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const tagId = ref<number>();

const loadTagId = async () => {
  try {
    const tags = await tagApi.getTagList();
    console.log('所有标签:', tags);
    console.log('当前标签slug:', tagName.value);
    
    const tag = tags.find(t => t.slug === tagName.value);
    console.log('通过slug找到的标签:', tag);
    
    if (tag) {
      tagId.value = tag.id;
    } else {
      const fallbackTag = tags.find(t => t.name.toLowerCase().replace(/\s+/g, '-') === tagName.value);
      console.log('通过name转换找到的标签:', fallbackTag);
      if (fallbackTag) {
        tagId.value = fallbackTag.id;
      } else {
        console.warn('未找到匹配的标签');
      }
    }
  } catch (error) {
    console.error('Failed to load tag:', error);
  }
};

const loadArticles = async () => {
  if (!tagId.value) {
    console.warn('tagId为空，无法加载文章');
    return;
  }
  
  try {
    loading.value = true;
    const data = await articleApi.getArticleList({
      page: currentPage.value,
      pageSize: pageSize.value,
      tagId: tagId.value,
    });
    console.log('文章列表数据:', data);
    articles.value = data.list || [];
    total.value = data.total || 0;
  } catch (error) {
    console.error('Failed to load articles:', error);
  } finally {
    loading.value = false;
  }
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  loadArticles();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

onMounted(async () => {
  await loadTagId();
  loadArticles();
});
</script>
