<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-300">
    <Navbar />
    
    <main class="flex-1 pt-20">
      <div class="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2">
            <div class="card p-8">
              <div class="flex items-center space-x-4 mb-8">
                <div class="relative">
                  <img
                    :src="userInfo?.avatar || defaultAvatar"
                    :alt="userInfo?.username"
                    class="h-24 w-24 rounded-full object-cover"
                  >
                  <button
                    @click="showAvatarUpload = true"
                    class="absolute bottom-0 right-0 p-1 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </div>
                <div>
                  <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ userInfo?.username }}</h1>
                  <p class="text-gray-600 dark:text-gray-400">{{ userInfo?.email }}</p>
                  <el-tag v-if="isAdmin" type="success" size="small" class="mt-1">管理员</el-tag>
                </div>
              </div>

              <el-tabs v-model="activeTab">
                <el-tab-pane label="基本信息" name="basic">
                  <el-form ref="profileFormRef" :model="profileForm" :rules="profileRules" label-width="100px">
                    <el-form-item label="用户名" prop="username">
                      <el-input v-model="profileForm.username" disabled />
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                      <el-input v-model="profileForm.email" disabled />
                    </el-form-item>
                    <el-form-item label="个人简介" prop="introduction">
                      <el-input
                        v-model="profileForm.introduction"
                        type="textarea"
                        :rows="4"
                        placeholder="介绍一下自己..."
                        maxlength="200"
                        show-word-limit
                      />
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" :loading="profileLoading" @click="handleUpdateProfile">
                        保存修改
                      </el-button>
                    </el-form-item>
                  </el-form>
                </el-tab-pane>

                <el-tab-pane label="修改密码" name="password">
                  <el-form ref="passwordFormRef" :model="passwordForm" :rules="passwordRules" label-width="100px">
                    <el-form-item label="当前密码" prop="oldPassword">
                      <el-input v-model="passwordForm.oldPassword" type="password" show-password />
                    </el-form-item>
                    <el-form-item label="新密码" prop="newPassword">
                      <el-input v-model="passwordForm.newPassword" type="password" show-password />
                    </el-form-item>
                    <el-form-item label="确认密码" prop="confirmPassword">
                      <el-input v-model="passwordForm.confirmPassword" type="password" show-password />
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" :loading="passwordLoading" @click="handleChangePassword">
                        修改密码
                      </el-button>
                    </el-form-item>
                  </el-form>
                </el-tab-pane>

                <el-tab-pane label="我的收藏" name="favorites">
                  <div v-if="favoritesLoading" class="space-y-4">
                    <div v-for="i in 3" :key="i" class="animate-pulse">
                      <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div v-else-if="favorites.length > 0" class="space-y-4">
                    <router-link
                      v-for="article in favorites"
                      :key="article.id"
                      :to="`/article/${article.id}`"
                      class="block p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-md transition-all"
                    >
                      <h3 class="font-medium text-gray-900 mb-1">{{ article.title }}</h3>
                      <p class="text-sm text-gray-500">{{ formatDate(article.createdAt) }}</p>
                    </router-link>
                  </div>
                  <div v-else class="text-center py-8 text-gray-500">
                    暂无收藏文章
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>

          <div class="space-y-6">
            <div class="card p-6">
              <h3 class="text-lg font-bold text-gray-900 mb-4">账户信息</h3>
              <div class="space-y-3 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">注册时间</span>
                  <span class="text-gray-900">{{ formatDate(userInfo?.createdAt) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">账户类型</span>
                  <span class="text-gray-900">{{ isAdmin ? '管理员' : '普通用户' }}</span>
                </div>
              </div>
            </div>

            <div class="card p-6">
              <h3 class="text-lg font-bold text-gray-900 mb-4">快捷操作</h3>
              <div class="space-y-2">
                <router-link
                  v-if="isAdmin"
                  to="/admin"
                  class="flex items-center space-x-2 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <svg class="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span class="text-gray-700">管理后台</span>
                </router-link>
                <button
                  @click="handleLogout"
                  class="w-full flex items-center space-x-2 px-4 py-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>退出登录</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <Footer />

    <el-dialog v-model="showAvatarUpload" title="上传头像" width="400px">
      <div class="flex justify-center py-4">
        <el-upload
          class="avatar-uploader"
          :action="uploadUrl"
          :headers="uploadHeaders"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="avatarUrl" :src="avatarUrl" class="avatar">
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </div>
      <template #footer>
        <el-button @click="showAvatarUpload = false">取消</el-button>
        <el-button type="primary" @click="handleSaveAvatar">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { ElMessage, type FormInstance, type FormRules, type UploadProps } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';

const router = useRouter();
const authStore = useAuthStore();

const activeTab = ref('basic');
const profileFormRef = ref<FormInstance>();
const passwordFormRef = ref<FormInstance>();
const profileLoading = ref(false);
const passwordLoading = ref(false);
const favoritesLoading = ref(false);
const showAvatarUpload = ref(false);
const avatarUrl = ref('');

const uploadUrl = computed(() => {
  return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}/upload/avatar`;
});

const uploadHeaders = computed(() => {
  return {
    'Authorization': `Bearer ${authStore.token}`
  };
});

const userInfo = computed(() => authStore.userInfo);
const isAdmin = computed(() => authStore.isAdmin);

const profileForm = reactive({
  username: '',
  email: '',
  introduction: '',
});

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
});

const favorites = ref<any[]>([]);

const profileRules: FormRules = {
  introduction: [
    { max: 200, message: '个人简介不能超过200个字符', trigger: 'blur' },
  ],
};

const validateConfirmPassword = (rule: any, value: any, callback: any) => {
  if (value !== passwordForm.newPassword) {
    callback(new Error('两次输入的密码不一致'));
  } else {
    callback();
  }
};

const passwordRules: FormRules = {
  oldPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' },
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6个字符', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' },
  ],
};

const defaultAvatar = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"%3E%3Cpath stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /%3E%3C/svg%3E';

const formatDate = (date?: string) => {
  if (!date) return '-';
  const d = new Date(date);
  return d.toLocaleDateString('zh-CN');
};

const initProfileForm = () => {
  if (userInfo.value) {
    profileForm.username = userInfo.value.username;
    profileForm.email = userInfo.value.email;
    profileForm.introduction = userInfo.value.introduction || '';
  }
};

const handleUpdateProfile = async () => {
  if (!profileFormRef.value) return;

  try {
    await profileFormRef.value.validate();
    profileLoading.value = true;

    await authStore.updateProfile({
      introduction: profileForm.introduction,
    });

    ElMessage.success('保存成功');
  } catch (error: any) {
    if (error !== false) {
      ElMessage.error(error.message || '保存失败');
    }
  } finally {
    profileLoading.value = false;
  }
};

const handleChangePassword = async () => {
  if (!passwordFormRef.value) return;

  try {
    await passwordFormRef.value.validate();
    passwordLoading.value = true;

    await authStore.changePassword(passwordForm.oldPassword, passwordForm.newPassword);

    ElMessage.success('密码修改成功');
    passwordForm.oldPassword = '';
    passwordForm.newPassword = '';
    passwordForm.confirmPassword = '';
    passwordFormRef.value.resetFields();
  } catch (error: any) {
    if (error !== false) {
      ElMessage.error(error.message || '密码修改失败');
    }
  } finally {
    passwordLoading.value = false;
  }
};

const handleLogout = async () => {
  try {
    await authStore.logout();
    ElMessage.success('退出登录成功');
    router.push('/');
  } catch (error) {
    ElMessage.error('退出登录失败');
  }
};

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  const isImage = rawFile.type.startsWith('image/');
  const isLt2M = rawFile.size / 1024 / 1024 < 2;

  if (!isImage) {
    ElMessage.error('头像必须是图片格式!');
    return false;
  }
  if (!isLt2M) {
    ElMessage.error('头像大小不能超过 2MB!');
    return false;
  }
  return true;
};

const handleAvatarSuccess: UploadProps['onSuccess'] = (response) => {
  console.log('头像上传成功响应:', response);
  if (response.code === 200) {
    const imageUrl = response.data.url;
    const fullUrl = imageUrl.startsWith('http') ? imageUrl : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}${imageUrl}`;
    avatarUrl.value = fullUrl;
    ElMessage.success('上传成功');
  } else {
    ElMessage.error(response.message || '上传失败');
  }
};

const handleSaveAvatar = async () => {
  try {
    await authStore.updateProfile({ avatar: avatarUrl.value });
    ElMessage.success('头像更新成功');
    showAvatarUpload.value = false;
  } catch (error) {
    ElMessage.error('头像更新失败');
  }
};

onMounted(() => {
  initProfileForm();
});
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.avatar-uploader :deep(.el-upload) {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader :deep(.el-upload:hover) {
  border-color: var(--el-color-primary);
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
  line-height: 178px;
}
</style>
