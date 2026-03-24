<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="mx-auto h-16 w-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
          <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
          重置密码
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          输入您的邮箱地址，我们将发送重置密码的链接
        </p>
      </div>

      <el-card class="shadow-lg">
        <el-form ref="forgotFormRef" :model="forgotForm" :rules="forgotRules" label-position="top">
          <el-form-item label="邮箱地址" prop="email">
            <el-input
              v-model="forgotForm.email"
              placeholder="请输入注册时使用的邮箱"
              size="large"
              clearable
            >
              <template #prefix>
                <el-icon><Message /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              size="large"
              :loading="loading"
              :disabled="countdown > 0"
              class="w-full"
              @click="handleSendCode"
            >
              {{ countdown > 0 ? `${countdown}秒后重新发送` : '发送重置链接' }}
            </el-button>
          </el-form-item>

          <div class="text-center">
            <span class="text-gray-600 dark:text-gray-400">想起密码了?</span>
            <router-link to="/login" class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 ml-1">
              返回登录
            </router-link>
          </div>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { Message } from '@element-plus/icons-vue';
import { authApi } from '@/api';

const router = useRouter();

const forgotFormRef = ref<FormInstance>();
const loading = ref(false);
const countdown = ref(0);

const forgotForm = reactive({
  email: '',
});

const validateEmail = (rule: any, value: any, callback: any) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!value) {
    callback(new Error('请输入邮箱地址'));
  } else if (!emailRegex.test(value)) {
    callback(new Error('请输入有效的邮箱地址'));
  } else {
    callback();
  }
};

const forgotRules: FormRules = {
  email: [
    { required: true, validator: validateEmail, trigger: 'blur' },
  ],
};

const handleSendCode = async () => {
  if (!forgotFormRef.value) return;

  try {
    await forgotFormRef.value.validate();
    loading.value = true;

    await authApi.forgotPassword(forgotForm.email);

    ElMessage.success('重置链接已发送到您的邮箱，请查收');
    startCountdown();
  } catch (error: any) {
    if (error !== false) {
      ElMessage.error(error.message || '发送失败，请稍后重试');
    }
  } finally {
    loading.value = false;
  }
};

const startCountdown = () => {
  countdown.value = 60;
  const timer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(timer);
    }
  }, 1000);
}

</script>