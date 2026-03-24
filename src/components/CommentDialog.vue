<template>
  <el-dialog
    v-model="visible"
    :title="isReply ? '回复评论' : '发表评论'"
    width="500px"
    :before-close="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="内容" prop="content">
        <el-input
          v-model="form.content"
          type="textarea"
          :rows="4"
          placeholder="请输入评论内容..."
          maxlength="500"
          show-word-limit
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="flex justify-end space-x-3">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" :loading="loading" @click="handleSubmit">
          {{ isReply ? '回复' : '发表' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { commentApi } from '@/api';
import { eventBus, EventTypes } from '@/utils/eventBus';
import { useAuthStore } from '@/stores/auth';

interface Props {
  modelValue: boolean;
  articleId: number;
  parentId?: number;
  replyTo?: string;
}

const props = withDefaults(defineProps<Props>(), {
  parentId: undefined,
  replyTo: undefined,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'success'): void;
}>();

const authStore = useAuthStore();
const router = useRouter();
const visible = ref(false);
const loading = ref(false);
const formRef = ref<FormInstance>();
const form = reactive({
  content: '',
});

const rules: FormRules = {
  content: [
    { required: true, message: '请输入评论内容', trigger: 'blur' },
    { min: 1, max: 500, message: '评论内容长度在1到500个字符', trigger: 'blur' },
  ],
};

const isReply = computed(() => !!props.parentId);

watch(() => props.modelValue, (val) => {
  visible.value = val;
});

watch(visible, (val) => {
  emit('update:modelValue', val);
  if (!val) {
    resetForm();
  }
});

const resetForm = () => {
  form.content = '';
  formRef.value?.clearValidate();
};

const handleClose = () => {
  visible.value = false;
};

const handleSubmit = async () => {
  if (!authStore.isAuthenticated) {
    router.push('/login');
    return;
  }
  
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    loading.value = true;

    await commentApi.createComment(props.articleId, {
      content: form.content,
      parentId: props.parentId,
    });

    ElMessage.success(isReply.value ? '回复成功' : '评论成功');
    emit('success');
    handleClose();

    eventBus.emit(EventTypes.COMMENT_ADD, { articleId: props.articleId });
  } catch (error: any) {
    if (error !== false) {
      ElMessage.error(error.message || '操作失败');
    }
  } finally {
    loading.value = false;
  }
};
</script>
