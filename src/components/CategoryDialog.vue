<template>
  <el-dialog
    v-model="visible"
    :title="isEdit ? '编辑分类' : '新建分类'"
    width="500px"
    :before-close="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入分类名称" />
      </el-form-item>
      
      <el-form-item label="标识符" prop="slug">
        <el-input v-model="form.slug" placeholder="请输入标识符（英文）" />
      </el-form-item>
      
      <el-form-item label="分类描述" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="3"
          placeholder="请输入分类描述"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="flex justify-end space-x-3">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" :loading="loading" @click="handleSubmit">
          保存
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue';
import { categoryApi } from '@/api';
import type { Category } from '@/api';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';

interface Props {
  modelValue: boolean;
  category: Category | null;
}

const props = withDefaults(defineProps<Props>(), {
  category: null,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'success'): void;
}>();

const visible = ref(false);
const loading = ref(false);
const formRef = ref<FormInstance>();

const form = reactive({
  name: '',
  slug: '',
  description: '',
});

const rules: FormRules = {
  name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { min: 1, max: 50, message: '分类名称长度在1到50个字符', trigger: 'blur' },
  ],
  slug: [
    { required: true, message: '请输入标识符', trigger: 'blur' },
    { pattern: /^[a-z0-9-]+$/, message: '标识符只能包含小写字母、数字和连字符', trigger: 'blur' },
  ],
};

const isEdit = computed(() => !!props.category);

watch(() => props.modelValue, (val) => {
  visible.value = val;
  if (val && props.category) {
    Object.assign(form, {
      name: props.category.name,
      slug: props.category.slug,
      description: props.category.description || '',
    });
  } else if (val) {
    resetForm();
  }
});

watch(visible, (val) => {
  emit('update:modelValue', val);
  if (!val) {
    resetForm();
  }
});

const resetForm = () => {
  form.name = '';
  form.slug = '';
  form.description = '';
  formRef.value?.clearValidate();
};

const handleClose = () => {
  visible.value = false;
  resetForm();
};

const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    loading.value = true;

    if (isEdit.value) {
      await categoryApi.updateCategory(props.category!.id, form);
      ElMessage.success('更新成功');
    } else {
      await categoryApi.createCategory(form);
      ElMessage.success('创建成功');
    }

    emit('success');
    handleClose();
  } catch (error: any) {
    if (error !== false) {
      ElMessage.error(error.message || '操作失败');
    }
  } finally {
    loading.value = false;
  }
};
</script>
