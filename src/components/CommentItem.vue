<template>
  <div class="flex space-x-4">
    <img
      :src="comment.author.avatar || defaultAvatar"
      :alt="comment.author.username"
      class="h-10 w-10 rounded-full object-cover flex-shrink-0"
    >
    <div class="flex-1">
      <div class="flex items-center space-x-2 mb-2">
        <span class="font-medium text-gray-900 dark:text-gray-100">{{ comment.author.username }}</span>
        <span class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(comment.createdAt) }}</span>
      </div>
      <p class="text-gray-700 dark:text-gray-300 mb-3">{{ comment.content }}</p>
      <div class="flex items-center space-x-4 text-sm">
        <button
          @click="handleLike"
          :class="[
            'flex items-center space-x-1 transition-colors',
            comment.isLiked ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400'
          ]"
        >
          <svg class="h-4 w-4" :class="{ 'fill-current': comment.isLiked }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span>{{ comment.likes }}</span>
        </button>
        <button
          @click="$emit('reply', comment)"
          class="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          回复
        </button>
        <button
          v-if="canDelete"
          @click="handleDelete"
          class="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        >
          删除
        </button>
      </div>

      <div v-if="comment.replies && comment.replies.length > 0" class="mt-4 space-y-4">
        <CommentItem
          v-for="reply in comment.replies"
          :key="reply.id"
          :comment="reply"
          :article-id="articleId"
          @reply="$emit('reply', $event)"
          @delete="$emit('delete', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { commentApi } from '@/api';
import type { Comment } from '@/api';
import dayjs from 'dayjs';
import { ElMessage } from 'element-plus';

const props = defineProps<{
  comment: Comment;
  articleId: string;
}>();

const emit = defineEmits<{
  (e: 'reply', comment: Comment): void;
  (e: 'delete', commentId: number): void;
}>();

const authStore = useAuthStore();

const canDelete = computed(() => {
  return authStore.isAdmin;
});

const defaultAvatar = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"%3E%3Cpath stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /%3E%3C/svg%3E';

const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm');
};

const handleLike = async () => {
  try {
    if (props.comment.isLiked) {
      const result = await commentApi.unlikeComment(props.comment.id);
      if (result.success === false) {
        ElMessage.error(result.message || '操作失败');
        return;
      }
      props.comment.likes = result.likes;
      props.comment.isLiked = false;
    } else {
      const result = await commentApi.likeComment(props.comment.id);
      if (result.success === false) {
        ElMessage.error(result.message || '操作失败');
        return;
      }
      props.comment.likes = result.likes;
      props.comment.isLiked = true;
    }
  } catch (error: any) {
    console.error('点赞失败:', error);
    ElMessage.error('操作失败');
  }
};

const handleDelete = () => {
  emit('delete', props.comment.id);
};
</script>
