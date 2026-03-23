import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authApi } from '@/api';
import { eventBus, EventTypes } from '@/utils/eventBus';
import type { User } from '@/api';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string>(localStorage.getItem('token') || '');
  const userInfo = ref<User | null>(
    localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')!) : null
  );
  const loading = ref(false);

  const isAuthenticated = computed(() => !!token.value);
  const isAdmin = computed(() => userInfo.value?.role === 'admin');

  const setToken = (newToken: string) => {
    token.value = newToken;
    localStorage.setItem('token', newToken);
  };

  const setUserInfo = (info: User) => {
    userInfo.value = info;
    localStorage.setItem('userInfo', JSON.stringify(info));
  };

  const clearAuth = () => {
    token.value = '';
    userInfo.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    eventBus.emit(EventTypes.AUTH_LOGOUT);
  };

  const login = async (username: string, password: string) => {
    try {
      loading.value = true;
      const data = await authApi.login({ username, password });
      setToken(data.token);
      setUserInfo(data.userInfo);
      eventBus.emit(EventTypes.AUTH_LOGIN, { token: data.token, userInfo: data.userInfo });
      return data;
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      clearAuth();
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      loading.value = true;
      const data = await authApi.register({ username, email, password });
      setToken(data.token);
      setUserInfo(data.userInfo);
      eventBus.emit(EventTypes.AUTH_LOGIN, { token: data.token, userInfo: data.userInfo });
      return data;
    } finally {
      loading.value = false;
    }
  };

  const refreshToken = async () => {
    try {
      const data = await authApi.refreshToken();
      setToken(data.token);
      eventBus.emit(EventTypes.AUTH_TOKEN_REFRESH, { token: data.token });
      return data.token;
    } catch (error) {
      clearAuth();
      throw error;
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    const updatedUser = await authApi.updateProfile(data);
    setUserInfo(updatedUser);
    return updatedUser;
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    await authApi.changePassword({ oldPassword, newPassword });
  };

  return {
    token,
    userInfo,
    loading,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    register,
    refreshToken,
    updateProfile,
    changePassword,
    clearAuth,
  };
});
