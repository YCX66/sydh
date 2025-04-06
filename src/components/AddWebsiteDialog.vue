<template>
  <el-dialog
    v-model="dialogVisible"
    title="添加新网站"
    width="500px"
    destroy-on-close
  >
    <el-form 
      :model="formData" 
      :rules="formRules" 
      ref="formRef" 
      label-width="80px"
      label-position="right"
    >
      <el-form-item label="网站名称" prop="websiteName">
        <el-input v-model="formData.websiteName" placeholder="推荐工具，网站，文章，视频，或博主都可以"></el-input>
      </el-form-item>
      
      <el-form-item label="网站链接" prop="link">
        <el-input v-model="formData.link" placeholder="请输入网站地址 (http://...)"></el-input>
      </el-form-item>
      
      <el-form-item label="网站图标" prop="iconFile">
        <el-upload
          class="icon-uploader"
          action="#"
          :auto-upload="false"
          :show-file-list="true"
          :limit="1"
          accept="image/png,image/jpeg,image/gif,image/svg+xml,image/x-icon"
          list-type="picture"
          :on-change="handleIconChange"
        >
          <template #trigger>
            <el-button type="primary">选择图标</el-button>
          </template>
          <template #tip>
            <div class="el-upload__tip">
              可以不传或者用表情包替代
            </div>
          </template>
        </el-upload>
      </el-form-item>
      
      <el-form-item label="网站简介" prop="intro">
        <el-input 
          v-model="formData.intro" 
          type="textarea" 
          :rows="3" 
          placeholder="简要描述网站内容（选填）"
        ></el-input>
      </el-form-item>
      
      <el-form-item label="所属分类" prop="categoryId">
        <el-select v-model="formData.categoryId" placeholder="请选择分类">
          <el-option
            v-for="category in categories"
            :key="category.id"
            :label="category.category_name"
            :value="category.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="submitForm" :loading="submitting">
          提交
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { websiteApi, categoryApi } from '../api';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:visible', 'website-added']);

const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
});

const submitting = ref(false);
const formRef = ref(null);
const categories = ref([]);

// 表单数据
const formData = reactive({
  websiteName: '',
  link: '',
  intro: '',
  categoryId: null,
  iconFile: null
});

// 表单验证规则
const formRules = {
  websiteName: [
    { required: true, message: '请输入网站名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在2到50个字符', trigger: 'blur' }
  ],
  link: [
    { required: true, message: '请输入网站链接', trigger: 'blur' },
    { 
      pattern: /^https?:\/\/.+\..+/,
      message: '请输入有效的网站地址，以http://或https://开头', 
      trigger: 'blur' 
    }
  ],
  intro: [
    { min: 5, max: 200, message: '简介长度在5到200个字符', trigger: 'blur' }
  ],
  categoryId: [
    { required: true, message: '请选择所属分类', trigger: 'change' }
  ]
};

// 处理图标文件变更
const handleIconChange = (file) => {
  const isImage = file.raw.type.startsWith('image/');
  const isLt2M = file.raw.size / 1024 / 1024 < 2;

  if (!isImage) {
    ElMessage.error('图标必须是图片格式!');
    return false;
  }
  
  if (!isLt2M) {
    ElMessage.error('图标大小不能超过2MB!');
    return false;
  }
  
  formData.iconFile = file.raw;
};

// 获取分类列表
const fetchCategories = async () => {
  try {
    const response = await categoryApi.getCategories();
    if (response.data.code === 200) {
      categories.value = response.data.data || [];
      
      // 如果有分类数据，设置默认值
      if (categories.value.length > 0) {
        formData.categoryId = categories.value[0].id;
      }
    }
  } catch (error) {
    console.error('获取分类列表失败:', error);
    ElMessage.warning('获取分类列表失败，请稍后重试');
  }
};

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate(async (valid, fields) => {
    if (valid) {
      submitting.value = true;
      
      try {
        // 创建FormData对象
        const submitFormData = new FormData();
        submitFormData.append('categoryId', formData.categoryId);
        submitFormData.append('websiteName', formData.websiteName);
        
        // 如果没有填写简介，使用默认值
        const introText = formData.intro.trim() ? formData.intro.trim() : "未填写简介";
        submitFormData.append('intro', introText);
        
        submitFormData.append('link', formData.link);
        
        // 如果有图标文件则添加，否则不添加
        if (formData.iconFile) {
          submitFormData.append('iconFile', formData.iconFile);
        }
        
        const response = await websiteApi.submitWebsite(submitFormData);
        
        if (response.data.code === 201) {
          ElMessage.success('网站提交成功！');
          resetForm();
          dialogVisible.value = false;
          emit('website-added');
        } else {
          ElMessage.error(response.data.message || '提交失败，请重试');
        }
      } catch (error) {
        console.error('提交网站失败:', error);
        ElMessage.error('提交失败，请检查网络连接后重试');
      } finally {
        submitting.value = false;
      }
    } else {
      console.log('表单验证失败', fields);
    }
  });
};

// 重置表单
const resetForm = () => {
  formData.websiteName = '';
  formData.link = '';
  formData.intro = '';
  formData.iconFile = null;
  
  if (formRef.value) {
    formRef.value.resetFields();
  }
};

// 取消
const handleCancel = () => {
  dialogVisible.value = false;
  resetForm();
};

// 对话框打开时加载分类
watch(() => dialogVisible.value, (val) => {
  if (val) {
    fetchCategories();
  }
});

onMounted(() => {
  fetchCategories();
});
</script>

<style scoped>
.form-container {
  padding: 10px;
}

:deep(.el-dialog) {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 10px 30px rgba(31, 38, 135, 0.4);
  overflow: hidden;
}

:deep(.el-dialog__header) {
  background: linear-gradient(135deg, rgba(128, 222, 234, 0.8), rgba(248, 187, 208, 0.8));
  padding: 15px 20px;
  margin: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.6);
  color: #333;
}

:deep(.el-dialog__title) {
  font-weight: 700;
  font-size: 18px;
  color: #333;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.6);
}

:deep(.el-dialog__headerbtn:hover .el-dialog__close) {
  color: #409EFF;
  transform: rotate(90deg);
  transition: all 0.3s ease;
}

:deep(.el-dialog__body) {
  padding: 20px;
  background: rgba(255, 255, 255, 0.95);
}

:deep(.el-form-item__label) {
  font-weight: 600;
  color: #333;
}

:deep(.el-input__wrapper), 
:deep(.el-textarea__wrapper) {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(128, 222, 234, 0.3);
  transition: all 0.3s ease;
}

:deep(.el-input__wrapper:hover),
:deep(.el-textarea__wrapper:hover) {
  border-color: rgba(236, 64, 122, 0.4);
  box-shadow: 0 0 10px rgba(236, 64, 122, 0.2);
}

:deep(.el-input__wrapper.is-focus),
:deep(.el-textarea__wrapper.is-focus) {
  box-shadow: 0 0 0 1px rgba(236, 64, 122, 0.3), 0 0 15px rgba(236, 64, 122, 0.2);
  border-color: rgba(236, 64, 122, 0.5);
}

:deep(.el-select__wrapper) {
  background: rgba(255, 255, 255, 0.5);
}

:deep(.el-select-dropdown__item.selected) {
  background: rgba(64, 158, 255, 0.1);
  color: #409EFF;
  font-weight: 600;
}

:deep(.el-dialog__footer) {
  padding: 15px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.05);
}

:deep(.el-button) {
  border-radius: 8px;
  font-weight: 500;
  padding: 10px 24px;
  transition: all 0.3s ease;
}

:deep(.el-button--primary) {
  background: var(--button-gradient);
  border: none;
  box-shadow: 0 4px 12px rgba(236, 64, 122, 0.2);
}

:deep(.el-button--primary:hover) {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(236, 64, 122, 0.3);
  background: linear-gradient(135deg, rgba(236, 64, 122, 0.8), rgba(38, 198, 218, 0.8));
}

:deep(.el-button--default) {
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(220, 223, 230, 0.6);
  backdrop-filter: blur(5px);
}

:deep(.el-button--default:hover) {
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-2px);
}

.upload-box {
  border: 2px dashed rgba(64, 158, 255, 0.5);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
}

.upload-box:hover {
  border-color: #409EFF;
  background: rgba(255, 255, 255, 0.4);
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.upload-text {
  margin-top: 10px;
  color: #606266;
}

.icon-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: relative;
}

.preview-image {
  width: 80px;
  height: 80px;
  object-fit: contain;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  background: white;
  padding: 5px;
  transition: all 0.3s ease;
}

.preview-image:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.remove-icon {
  position: absolute;
  top: -10px;
  right: -10px;
  background: rgba(245, 108, 108, 0.9);
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(245, 108, 108, 0.5);
  transition: all 0.2s ease;
}

.remove-icon:hover {
  transform: scale(1.1);
  background: #f56c6c;
}
</style> 