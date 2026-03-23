<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-300">
    <Navbar />
    
    <main class="flex-1 pt-20">
      <div class="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div v-if="loading" class="space-y-6">
          <div class="card p-6">
            <div class="animate-pulse space-y-4">
              <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              <div class="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div class="space-y-2">
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="article" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2">
            <article class="card p-8">
              <div class="mb-6">
                <router-link
                  :to="`/category/${article.category.id}`"
                  class="inline-block px-3 py-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors mb-4"
                >
                  {{ article.category.name }}
                </router-link>
                <h1 class="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">{{ article.title }}</h1>
                <div class="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  <div class="flex items-center space-x-2">
                    <img
                      :src="article.author.avatar || defaultAvatar"
                      :alt="article.author.username"
                      class="h-8 w-8 rounded-full object-cover"
                    >
                    <span>{{ article.author.username }}</span>
                  </div>
                  <span>·</span>
                  <span>{{ formatDate(article.createdAt) }}</span>
                  <span>·</span>
                  <span>{{ article.views }} 阅读</span>
                </div>
              </div>

              <div
                v-if="article.coverImage"
                class="mb-8 rounded-lg overflow-hidden"
              >
                <img
                  :src="article.coverImage"
                  :alt="article.title"
                  class="w-full h-auto"
                >
              </div>

              <div
                class="prose prose-lg max-w-none prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-code:text-indigo-600 dark:prose-code:text-indigo-400 prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800"
                v-html="renderedContent"
              />

              <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-4">
                    <button
                      @click="handleLike"
                      :class="[
                        'flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors',
                        article.isLiked ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      ]"
                    >
                      <svg class="h-5 w-5" :class="{ 'fill-current': article.isLiked }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span>{{ article.likeCount }}</span>
                    </button>
                    <button
                      @click="handleFavorite"
                      :class="[
                        'flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors',
                        article.isFavorited ? 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      ]"
                    >
                      <svg class="h-5 w-5" :class="{ 'fill-current': article.isFavorited }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                      <span>{{ article.collectCount }}</span>
                    </button>
                  </div>

                  <div class="flex items-center space-x-2">
                    <button
                      @click="shareArticle"
                      class="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      <span>分享</span>
                    </button>
                  </div>
                </div>
              </div>

              <div v-if="article.tags.length > 0" class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div class="flex flex-wrap gap-2">
                  <router-link
                    v-for="tag in article.tags"
                    :key="tag.id"
                    :to="`/tag/${tag.slug}`"
                    class="px-3 py-1 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    #{{ tag.name }}
                  </router-link>
                </div>
              </div>
            </article>

            <div class="mt-8">
              <div class="card p-6">
                <div class="flex items-center justify-between mb-6">
                  <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">评论 ({{ commentCount }})</h2>
                  <button
                    @click="showCommentDialog = true"
                    class="btn-primary"
                  >
                    发表评论
                  </button>
                </div>

                <div v-if="commentsLoading" class="space-y-4">
                  <div v-for="i in 3" :key="i" class="animate-pulse space-y-3">
                    <div class="flex items-center space-x-3">
                      <div class="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                      <div class="flex-1">
                        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                        <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/6 mt-1"></div>
                      </div>
                    </div>
                    <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  </div>
                </div>

                <div v-else-if="comments.length > 0" class="space-y-6">
                  <CommentItem
                    v-for="comment in comments"
                    :key="comment.id"
                    :comment="comment"
                    :article-id="article.id"
                    @reply="handleReply"
                    @delete="handleDeleteComment"
                  />
                </div>

                <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
                  暂无评论，快来发表第一条评论吧！
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-6">
            <div class="card p-6">
              <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">相关文章</h3>
              <div v-if="relatedArticlesLoading" class="space-y-4">
                <div v-for="i in 3" :key="i" class="animate-pulse">
                  <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
              <div v-else class="space-y-4">
                <router-link
                  v-for="related in relatedArticles"
                  :key="related.id"
                  :to="`/article/${related.id}`"
                  class="block group"
                >
                  <h4 class="text-gray-900 dark:text-gray-100 font-medium group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                    {{ related.title }}
                  </h4>
                  <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ formatDate(related.createdAt) }}</p>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <Footer />

    <CommentDialog
      v-model="showCommentDialog"
      :article-id="Number(articleId)"
      :parent-id="replyParentId"
      :reply-to="replyToName"
      @success="handleCommentSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { articleApi, commentApi } from '@/api';
import type { Article, Comment } from '@/api';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import dayjs from 'dayjs';
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';
import CommentDialog from '@/components/CommentDialog.vue';
import CommentItem from '@/components/CommentItem.vue';
import { ElMessage } from 'element-plus';

const route = useRoute();
const authStore = useAuthStore();

const articleId = computed(() => Number(route.params.id));
const article = ref<Article | null>(null);
const loading = ref(false);

const comments = ref<Comment[]>([]);
const commentsLoading = ref(false);
const commentCount = ref(0);

const relatedArticles = ref<Article[]>([]);
const relatedArticlesLoading = ref(false);

const showCommentDialog = ref(false);
const replyParentId = ref<number>();
const replyToName = ref<string>();

const isAuthenticated = computed(() => authStore.isAuthenticated);
const defaultAvatar = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"%3E%3Cpath stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /%3E%3C/svg%3E';

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (__) {}
    }
    return '';
  },
});

const renderedContent = computed(() => {
  if (!article.value) return '';
  return md.render(article.value.content);
});

const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm');
};

const loadArticle = async () => {
  try {
    loading.value = true;
    article.value = await articleApi.getArticleDetail(articleId.value);
  } catch (error) {
    console.error('Failed to load article:', error);
    ElMessage.error('加载文章失败');
  } finally {
    loading.value = false;
  }
};

const loadComments = async () => {
  try {
    commentsLoading.value = true;
    const data = await commentApi.getCommentList(articleId.value, { page: 1, pageSize: 100 });
    comments.value = data.list || [];
    commentCount.value = data.total || 0;
  } catch (error) {
    console.error('Failed to load comments:', error);
  } finally {
    commentsLoading.value = false;
  }
};

const loadRelatedArticles = async () => {
  try {
    relatedArticlesLoading.value = true;
    const data = await articleApi.getArticleList({
      page: 1,
      pageSize: 5,
      categoryId: article.value?.category.id,
    });
    relatedArticles.value = data.list.filter(a => a.id !== articleId.value);
  } catch (error) {
    console.error('Failed to load related articles:', error);
  } finally {
    relatedArticlesLoading.value = false;
  }
};

const handleLike = async () => {
  try {
    if (article.value?.isLiked) {
      await articleApi.unlikeArticle(articleId.value);
      article.value.likes--;
      article.value.isLiked = false;
    } else {
      await articleApi.likeArticle(articleId.value);
      article.value!.likes++;
      article.value!.isLiked = true;
    }
  } catch (error) {
    ElMessage.error('操作失败');
  }
};

const handleFavorite = async () => {
  try {
    if (article.value?.isFavorited) {
      await articleApi.unfavoriteArticle(articleId.value);
      article.value.favorites--;
      article.value.isFavorited = false;
    } else {
      await articleApi.favoriteArticle(articleId.value);
      article.value!.favorites++;
      article.value!.isFavorited = true;
    }
  } catch (error) {
    ElMessage.error('操作失败');
  }
};

const shareArticle = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    ElMessage.success('链接已复制到剪贴板');
  } catch (error) {
    ElMessage.error('复制失败');
  }
};

const handleReply = (comment: Comment) => {
  replyParentId.value = comment.id;
  replyToName.value = comment.author.username;
  showCommentDialog.value = true;
};

const handleDeleteComment = async (commentId: number) => {
  if (!authStore.isAdmin) {
    ElMessage.error('只有管理员才能删除评论');
    return;
  }
  
  try {
    const result = await commentApi.deleteComment(commentId);
    if (result.success === false) {
      ElMessage.error(result.message || '删除失败');
      return;
    }
    ElMessage.success(result.message || '删除成功');
    loadComments();
  } catch (error) {
    console.error('删除评论失败:', error);
    ElMessage.error('删除失败');
  }
};

const handleCommentSuccess = () => {
  loadComments();
};

onMounted(() => {
  loadArticle();
  loadComments();
});
</script>
