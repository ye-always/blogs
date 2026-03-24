<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索用户名或邮箱"
        clearable
        class="w-full sm:w-64"
        @clear="loadUsers"
        @keyup.enter="loadUsers"
      >
        <template #append>
          <el-button @click="loadUsers">搜索</el-button>
        </template>
      </el-input>
    </div>

    <el-card>
      <el-table
        :data="users"
        v-loading="loading"
        stripe
        class="responsive-table"
      >
        <el-table-column label="用户信息" min-width="200">
          <template #default="{ row }">
            <div class="flex items-center space-x-3">
              <img
                :src="row.avatar || defaultAvatar"
                :alt="row.username"
                class="h-10 w-10 rounded-full object-cover"
              >
              <div>
                <p class="font-medium text-gray-900">{{ row.username }}</p>
                <p class="text-sm text-gray-500">{{ row.email || '未设置邮箱' }}</p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="角色" width="120">
          <template #default="{ row }">
            <el-select
              v-model="row.role"
              size="small"
              @change="handleRoleChange(row)"
            >
              <el-option label="普通用户" value="USER" />
              <el-option label="管理员" value="ADMIN" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="简介" min-width="200">
          <template #default="{ row }">
            <p class="text-gray-600 line-clamp-2">{{ row.introduction || '暂无简介' }}</p>
          </template>
        </el-table-column>
        <el-table-column label="注册时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button
              type="danger"
              size="small"
              link
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="mt-4 flex justify-center">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          layout="prev, pager, next"
          @current-change="loadUsers"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { adminApi } from '@/api';
import type { User } from '@/api';
import { ElMessage, ElMessageBox } from 'element-plus';

const loading = ref(false);
const users = ref<User[]>([]);
const searchKeyword = ref('');
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

const defaultAvatar = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"%3E%3Cpath stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /%3E%3C/svg%3E';

const loadUsers = async () => {
  try {
    loading.value = true;
    const data = await adminApi.getUsers({
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchKeyword.value,
    });
    users.value = data.users || [];
    total.value = data.total || 0;
  } catch (error) {
    console.error('Failed to load users:', error);
    ElMessage.error('加载用户列表失败');
  } finally {
    loading.value = false;
  }
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('zh-CN');
};

const handleRoleChange = async (user: User) => {
  try {
    await adminApi.updateUserRole(user.id, { role: user.role });
    ElMessage.success('角色更新成功');
  } catch (error) {
    console.error('Failed to update user role:', error);
    ElMessage.error('角色更新失败');
    loadUsers();
  }
};

const handleDelete = async (user: User) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除用户 "${user.username}" 吗？此操作不可恢复！`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );

    await adminApi.deleteUser(user.id);
    ElMessage.success('删除成功');
    loadUsers();
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('Failed to delete user:', error);
      ElMessage.error('删除失败');
    }
  }
};

onMounted(() => {
  loadUsers();
});
</script>