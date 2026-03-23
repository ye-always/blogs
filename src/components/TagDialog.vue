<template>
  <el-dialog
    v-model="visible"
    :title="isEdit ? '编辑标签' : '新建标签'"
    width="500px"
    :before-close="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="标签名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入标签名称" />
      </el-form-item>
      
      <el-form-item label="标识符" prop="slug">
        <el-input v-model="form.slug" placeholder="请输入标识符（英文）" />
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
import { tagApi } from '@/api';
import type { Tag } from '@/api';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';

interface Props {
  modelValue: boolean;
  tag: Tag | null;
}

const props = withDefaults(defineProps<Props>(), {
  tag: null,
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
});

const rules: FormRules = {
  name: [
    { required: true, message: '请输入标签名称', trigger: 'blur' },
    { min: 1, max: 30, message: '标签名称长度在1到30个字符', trigger: 'blur' },
  ],
  slug: [
    { required: true, message: '请输入标识符', trigger: 'blur' },
    { pattern: /^[a-z0-9-]+$/, message: '标识符只能包含小写字母、数字和连字符', trigger: 'blur' },
  ],
};

const isEdit = computed(() => !!props.tag);

watch(() => props.modelValue, (val) => {
  visible.value = val;
  if (val && props.tag) {
    Object.assign(form, {
      name: props.tag.name,
      slug: props.tag.slug,
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
      await tagApi.updateTag(props.tag!.id, form);
      ElMessage.success('更新成功');
    } else {
      await tagApi.createTag(form);
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
