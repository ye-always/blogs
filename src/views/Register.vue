<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="mx-auto h-16 w-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
          <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
          创建账户
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          加入我们的社区，开始您的博客之旅
        </p>
      </div>

      <el-card class="shadow-lg">
        <el-form ref="registerFormRef" :model="registerForm" :rules="registerRules" label-position="top">
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="registerForm.username"
              placeholder="请输入用户名（3-20个字符）"
              size="large"
              clearable
            >
              <template #prefix>
                <el-icon><User /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input
              v-model="registerForm.email"
              placeholder="请输入邮箱地址"
              size="large"
              clearable
            >
              <template #prefix>
                <el-icon><Message /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input
              v-model="registerForm.password"
              type="password"
              placeholder="请输入密码（至少6个字符）"
              size="large"
              show-password
              @input="checkPasswordStrength"
            >
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
            <div v-if="passwordStrength" class="mt-2">
              <div class="flex items-center space-x-2">
                <div class="flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    class="h-full transition-all duration-300"
                    :class="passwordStrengthColor"
                    :style="{ width: passwordStrength.percentage + '%' }"
                  ></div>
                </div>
                <span class="text-xs" :class="passwordStrengthTextColor">{{ passwordStrength.text }}</span>
              </div>
            </div>
          </el-form-item>

          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input
              v-model="registerForm.confirmPassword"
              type="password"
              placeholder="请再次输入密码"
              size="large"
              show-password
              @keyup.enter="handleRegister"
            >
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item>
            <el-checkbox v-model="registerForm.agree">
              我已阅读并同意
              <el-link type="primary" :underline="false">服务条款</el-link>
              和
              <el-link type="primary" :underline="false">隐私政策</el-link>
            </el-checkbox>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              size="large"
              :loading="loading"
              class="w-full"
              @click="handleRegister"
            >
              注册
            </el-button>
          </el-form-item>

          <div class="text-center">
            <span class="text-gray-600 dark:text-gray-400">已有账户?</span>
            <router-link to="/login" class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 ml-1">
              立即登录
            </router-link>
          </div>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { User, Lock, Message } from '@element-plus/icons-vue';

const router = useRouter();
const authStore = useAuthStore();

const registerFormRef = ref<FormInstance>();
const loading = ref(false);
const passwordStrength = ref<{ text: string; percentage: number; color: string } | null>(null);

const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agree: false,
});

const validateConfirmPassword = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'));
  } else if (value !== registerForm.password) {
    callback(new Error('两次输入的密码不一致'));
  } else {
    callback();
  }
};

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

const validateAgree = (rule: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error('请同意服务条款和隐私政策'));
  } else {
    callback();
  }
};

const registerRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在3到20个字符', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线', trigger: 'blur' },
  ],
  email: [
    { required: true, validator: validateEmail, trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6个字符', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, validator: validateConfirmPassword, trigger: 'blur' },
  ],
  agree: [
    { required: true, validator: validateAgree, trigger: 'change' },
  ],
};

const checkPasswordStrength = () => {
  const password = registerForm.password;
  if (!password) {
    passwordStrength.value = null;
    return;
  }

  let strength = 0;
  if (password.length >= 6) strength++;
  if (password.length >= 10) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;

  const strengthMap = {
    0: { text: '非常弱', percentage: 20, color: 'bg-red-500' },
    1: { text: '弱', percentage: 40, color: 'bg-orange-500' },
    2: { text: '一般', percentage: 60, color: 'bg-yellow-500' },
    3: { text: '中等', percentage: 80, color: 'bg-blue-500' },
    4: { text: '强', percentage: 100, color: 'bg-green-500' },
    5: { text: '非常强', percentage: 100, color: 'bg-green-600' },
  };

  passwordStrength.value = strengthMap[strength as keyof typeof strengthMap];
};

const passwordStrengthColor = computed(() => passwordStrength.value?.color || '');
const passwordStrengthTextColor = computed(() => {
  const colorMap: Record<string, string> = {
    'bg-red-500': 'text-red-500',
    'bg-orange-500': 'text-orange-500',
    'bg-yellow-500': 'text-yellow-500',
    'bg-blue-500': 'text-blue-500',
    'bg-green-500': 'text-green-500',
    'bg-green-600': 'text-green-600',
  };
  return passwordStrength.value ? colorMap[passwordStrength.value.color] : '';
});

const handleRegister = async () => {
  if (!registerFormRef.value) return;

  try {
    await registerFormRef.value.validate();
    loading.value = true;

    await authStore.register(registerForm.username, registerForm.email, registerForm.password);

    ElMessage.success('注册成功');
    router.push('/');
  } catch (error: any) {
    if (error !== false) {
      ElMessage.error(error.message || '注册失败');
    }
  } finally {
    loading.value = false;
  }
};
</script>