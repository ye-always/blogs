<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="mx-auto h-16 w-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
          <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
          欢迎回来
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          登录到您的账户
        </p>
      </div>

      <el-card class="shadow-lg">
        <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" label-position="top">
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="请输入用户名"
              size="large"
              clearable
            >
              <template #prefix>
                <el-icon><User /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              size="large"
              show-password
              @keyup.enter="handleLogin"
            >
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item>
            <div class="flex items-center justify-between w-full">
              <el-checkbox v-model="loginForm.remember">记住我</el-checkbox>
              <el-link type="primary" :underline="false">忘记密码?</el-link>
            </div>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              size="large"
              :loading="loading"
              class="w-full"
              @click="handleLogin"
            >
              登录
            </el-button>
          </el-form-item>

          <div class="text-center">
            <span class="text-gray-600 dark:text-gray-400">还没有账户?</span>
            <router-link to="/register" class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 ml-1">
              立即注册
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
import { useAuthStore } from '@/stores/auth';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { User, Lock } from '@element-plus/icons-vue';

const router = useRouter();
const authStore = useAuthStore();

const loginFormRef = ref<FormInstance>();
const loading = ref(false);

const loginForm = reactive({
  username: '',
  password: '',
  remember: false,
});

const loginRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在3到20个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6个字符', trigger: 'blur' },
  ],
};

const handleLogin = async () => {
  if (!loginFormRef.value) return;

  try {
    await loginFormRef.value.validate();
    loading.value = true;

    await authStore.login(loginForm.username, loginForm.password);

    ElMessage.success('登录成功');
    router.push('/admin/dashboard');
  } catch (error: any) {
    if (error !== false) {
      ElMessage.error(error.message || '登录失败');
    }
  } finally {
    loading.value = false;
  }
};
</script>
