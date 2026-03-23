<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <el-radio-group v-model="statusFilter" @change="loadComments" class="w-full sm:w-auto">
        <el-radio-button label="">全部</el-radio-button>
        <el-radio-button label="pending">待审核</el-radio-button>
        <el-radio-button label="approved">已通过</el-radio-button>
        <el-radio-button label="rejected">已拒绝</el-radio-button>
      </el-radio-group>
      <el-button
        v-if="selectedComments.length > 0"
        type="primary"
        class="w-full sm:w-auto"
        @click="handleBatchApprove"
      >
        批量通过 ({{ selectedComments.length }})
      </el-button>
    </div>

    <el-card>
      <el-table
        :data="comments"
        v-loading="loading"
        stripe
        @selection-change="handleSelectionChange"
        class="responsive-table"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="评论内容" min-width="200">
          <template #default="{ row }">
            <div class="max-w-md">
              <p class="text-gray-900 line-clamp-2">{{ row.content }}</p>
              <p class="text-sm text-gray-500 mt-1">文章: {{ row.articleTitle || '未知' }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="评论者" width="150">
          <template #default="{ row }">
            <div class="flex items-center space-x-2">
              <img
                :src="row.author.avatar || defaultAvatar"
                :alt="row.author.username"
                class="h-5 w-5 rounded-full object-cover"
              >
              <span>{{ row.author.username }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="点赞" width="80" align="center">
          <template #default="{ row }">
            {{ row.likes }}
          </template>
        </el-table-column>
        <el-table-column label="发布时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <template v-if="row.status === 'pending'">
              <el-button
                type="success"
                size="small"
                link
                @click="handleApprove(row.id)"
              >
                通过
              </el-button>
              <el-button
                type="danger"
                size="small"
                link
                @click="handleReject(row.id)"
              >
                拒绝
              </el-button>
            </template>
            <template v-else>
              <el-button
                type="danger"
                size="small"
                link
                @click="handleDelete(row)"
              >
                删除
              </el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>

      <div class="mt-4 flex justify-center">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          layout="prev, pager, next"
          @current-change="loadComments"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { adminApi, commentApi } from '@/api';
import type { Comment } from '@/api';
import { ElMessage, ElMessageBox } from 'element-plus';

const loading = ref(false);
const comments = ref<Comment[]>([]);
const statusFilter = ref('');
const selectedComments = ref<string[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

const defaultAvatar = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"%3E%3Cpath stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /%3E%3C/svg%3E';

const loadComments = async () => {
  try {
    loading.value = true;
    const data = await adminApi.getComments({
      page: currentPage.value,
      pageSize: pageSize.value,
      status: statusFilter.value,
    });
    comments.value = data.list || [];
    total.value = data.total || 0;
  } catch (error) {
    console.error('Failed to load comments:', error);
  } finally {
    loading.value = false;
  }
};

const getStatusType = (status: string) => {
  const types: Record<string, any> = {
    pending: 'warning',
    approved: 'success',
    rejected: 'danger',
  };
  return types[status] || 'info';
};

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    pending: '待审核',
    approved: '已通过',
    rejected: '已拒绝',
  };
  return texts[status] || status;
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('zh-CN');
};

const handleSelectionChange = (selection: Comment[]) => {
  selectedComments.value = selection.map(c => c.id);
};

const handleApprove = async (commentId: string) => {
  try {
    await commentApi.approveComment(commentId);
    ElMessage.success('审核通过');
    loadComments();
  } catch (error) {
    ElMessage.error('操作失败');
  }
};

const handleReject = async (commentId: string) => {
  try {
    await commentApi.rejectComment(commentId);
    ElMessage.success('已拒绝');
    loadComments();
  } catch (error) {
    ElMessage.error('操作失败');
  }
};

const handleDelete = async (comment: Comment) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这条评论吗？',
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );

    await commentApi.deleteComment(comment.id);
    ElMessage.success('删除成功');
    loadComments();
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败');
    }
  }
};

const handleBatchApprove = async () => {
  try {
    await ElMessageBox.confirm(
      `确定要通过这 ${selectedComments.value.length} 条评论吗？`,
      '确认批量通过',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );

    await adminApi.batchApproveComments(selectedComments.value);
    ElMessage.success('批量审核通过成功');
    selectedComments.value = [];
    loadComments();
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败');
    }
  }
};

onMounted(() => {
  loadComments();
});
</script>
