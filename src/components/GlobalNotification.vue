<template>
  <teleport to="body">
    <transition
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition ease-in duration-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="visible"
        class="fixed top-4 right-4 z-50 max-w-sm w-full"
      >
        <div
          :class="[
            'rounded-lg shadow-lg p-4 flex items-start space-x-3',
            typeClasses[notification.type]
          ]"
        >
          <div class="flex-shrink-0">
            <svg
              v-if="notification.type === 'success'"
              class="h-6 w-6 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg
              v-else-if="notification.type === 'error'"
              class="h-6 w-6 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg
              v-else-if="notification.type === 'warning'"
              class="h-6 w-6 text-yellow-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <svg
              v-else
              class="h-6 w-6 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-900">
              {{ notification.message }}
            </p>
          </div>
          <button
            @click="hide"
            class="flex-shrink-0 text-gray-400 hover:text-gray-500 transition-colors"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { eventBus } from '@/utils/eventBus';
import { EventTypes, type NotificationPayload } from '@/utils/eventTypes';

const visible = ref(false);
const notification = reactive<NotificationPayload>({
  type: 'info',
  message: '',
  duration: 3000,
});

let timer: number | null = null;

const typeClasses = {
  success: 'bg-green-50 border border-green-200',
  error: 'bg-red-50 border border-red-200',
  warning: 'bg-yellow-50 border border-yellow-200',
  info: 'bg-blue-50 border border-blue-200',
};

const show = (payload: NotificationPayload) => {
  Object.assign(notification, payload);
  visible.value = true;

  if (timer) {
    clearTimeout(timer);
  }

  if (notification.duration && notification.duration > 0) {
    timer = window.setTimeout(() => {
      hide();
    }, notification.duration);
  }
};

const hide = () => {
  visible.value = false;
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
};

onMounted(() => {
  eventBus.on(EventTypes.NOTIFICATION_SHOW, show);
  eventBus.on(EventTypes.NOTIFICATION_HIDE, hide);
});

onUnmounted(() => {
  eventBus.off(EventTypes.NOTIFICATION_SHOW, show);
  eventBus.off(EventTypes.NOTIFICATION_HIDE, hide);
  if (timer) {
    clearTimeout(timer);
  }
});
</script>
