<template>
  <div class="comment-section">
    <h2 class="section-title">用户评论</h2>
    
    <!-- 添加评论 -->
    <div class="comment-form">
      <el-input
        v-model="commentContent"
        type="textarea"
        :rows="3"
        placeholder="分享你的想法..."
        class="comment-input"
      />
      <div class="comment-form-footer">
        <div class="random-identity" v-if="randomIdentity">
          使用随机昵称发表评论：<span class="identity-name">{{ randomIdentity.nickname }}</span>
          <el-button type="text" size="small" @click="refreshRandomIdentity">换一个</el-button>
        </div>
        <el-button type="primary" @click="submitComment" :loading="submitLoading" :disabled="!commentContent.trim() || !randomIdentity">
          发表评论
        </el-button>
      </div>
    </div>
    
    <!-- 评论列表 -->
    <div class="comment-list">
      <el-empty v-if="comments.length === 0" description="暂无评论，快来发表第一条评论吧！" />
      
      <div v-else>
        <div v-for="comment in comments" :key="comment.id" class="comment-item">
          <el-avatar :size="40" class="commenter-avatar">
            {{ getAvatarText(comment.random_identity) }}
          </el-avatar>
          <div class="comment-content">
            <div class="comment-header">
              <span class="commenter-name">{{ comment.random_identity }}</span>
              <span class="comment-time">{{ formatDate(comment.create_time) }}</span>
            </div>
            <p class="comment-text">{{ comment.content }}</p>
          </div>
        </div>
      </div>
      
      <div v-if="loading" class="loading-container">
        <el-icon class="is-loading"><Loading /></el-icon>
        <span>加载评论中...</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { commentApi, identityApi } from '../api';
import { ElMessage } from 'element-plus';
import { Loading } from '@element-plus/icons-vue';

const commentContent = ref('');
const commentsData = ref([]);
const loading = ref(false);
const submitLoading = ref(false);
const randomIdentity = ref(null);

// 按照发布时间从早到晚排序评论
const comments = computed(() => {
  return [...commentsData.value].sort((a, b) => {
    // 使用日期字符串比较，格式：YYYY-MM-DD HH:mm:ss
    return new Date(a.create_time) - new Date(b.create_time);
  });
});

// 格式化日期，只显示年月日
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      // 如果日期无效，尝试手动解析
      const parts = dateStr.split(' ')[0].split('-');
      if (parts.length === 3) {
        return `${parts[0]}-${parts[1]}-${parts[2]}`;
      }
      return dateStr.split(' ')[0]; // 退回到简单分割方法
    }
    return date.toISOString().split('T')[0]; // 返回YYYY-MM-DD格式
  } catch (e) {
    console.error('日期格式化错误:', e);
    return dateStr.split(' ')[0]; // 出错时返回原始格式的日期部分
  }
};

// 获取评论列表
const fetchComments = async () => {
  loading.value = true;
  try {
    const response = await commentApi.getComments();
    if (response.data.code === 200) {
      commentsData.value = response.data.data;
    }
  } catch (error) {
    console.error('获取评论失败:', error);
    ElMessage.error('获取评论失败，请刷新页面重试');
  } finally {
    loading.value = false;
  }
};

// 获取随机身份
const fetchRandomIdentity = async () => {
  try {
    const response = await identityApi.getRandomIdentity();
    if (response.data.code === 200) {
      randomIdentity.value = response.data.data;
    }
  } catch (error) {
    console.error('获取随机身份失败:', error);
    ElMessage.error('获取随机身份失败，请刷新页面重试');
  }
};

// 刷新随机身份
const refreshRandomIdentity = async () => {
  await fetchRandomIdentity();
  ElMessage.success('已为您更换新身份');
};

// 提交评论
const submitComment = async () => {
  const content = commentContent.value.trim();
  if (!content) {
    ElMessage.warning('评论内容不能为空');
    return;
  }
  
  if (!randomIdentity.value) {
    ElMessage.warning('未获取到身份信息，请刷新页面重试');
    return;
  }
  
  submitLoading.value = true;
  
  try {
    const commentData = {
      content: content,
      random_identity: randomIdentity.value.nickname
    };
    
    const response = await commentApi.submitComment(commentData);
    
    if (response.data.code === 201) {
      ElMessage.success('评论发表成功');
      commentContent.value = '';
      await fetchComments(); // 重新获取评论列表
      await fetchRandomIdentity(); // 更新随机身份
    } else {
      ElMessage.error(response.data.message || '评论发表失败');
    }
  } catch (error) {
    console.error('提交评论失败:', error);
    ElMessage.error('评论发表失败，请重试');
  } finally {
    submitLoading.value = false;
  }
};

// 从身份名称中获取头像文本
const getAvatarText = (name) => {
  if (!name) return '?';
  return name.substring(0, 1);
};

onMounted(async () => {
  fetchComments();
  fetchRandomIdentity();
});
</script>

<style scoped>
.comment-section {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 20px;
  margin-top: 30px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.comment-section:hover {
  box-shadow: 0 12px 42px rgba(31, 38, 135, 0.15);
  transform: translateY(-5px);
  border-color: rgba(255, 255, 255, 0.3);
}

.section-title {
  font-size: 20px;
  margin-bottom: 20px;
  color: #333;
  font-weight: 600;
  position: relative;
  padding-left: 15px;
  display: inline-block;
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 4px;
  background: linear-gradient(to bottom, #409EFF, #53a8ff);
  border-radius: 2px;
}

.comment-form {
  margin-bottom: 30px;
  background: rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.comment-input {
  margin-bottom: 15px;
}

.comment-form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.random-identity {
  font-size: 14px;
  color: #666;
  transition: all 0.3s ease;
}

.random-identity:hover {
  transform: translateY(-2px);
}

.identity-name {
  color: #409EFF;
  font-weight: 500;
  text-shadow: 0 2px 10px rgba(64, 158, 255, 0.2);
}

.comment-list {
  position: relative;
  min-height: 100px;
}

.comment-item {
  display: flex;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(240, 240, 240, 0.5);
  transition: all 0.3s ease;
}

.comment-item:hover {
  transform: translateX(5px);
}

.commenter-avatar {
  margin-right: 15px;
  background: linear-gradient(135deg, #409EFF, #53a8ff);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(64, 158, 255, 0.2);
  transition: all 0.3s ease;
}

.comment-item:hover .commenter-avatar {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 6px 15px rgba(64, 158, 255, 0.3);
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.commenter-name {
  font-weight: 500;
  color: #409EFF;
  transition: all 0.3s ease;
}

.comment-item:hover .commenter-name {
  text-shadow: 0 2px 10px rgba(64, 158, 255, 0.2);
}

.comment-time {
  color: #909399;
  font-size: 12px;
}

.comment-text {
  font-size: 14px;
  color: #333;
  margin: 5px 0;
  line-height: 1.5;
  word-break: break-word;
}

.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #909399;
  font-size: 14px;
  margin: 20px 0;
  min-height: 100px;
}

.loading-container .el-icon {
  margin-right: 8px;
  animation: rotate 1.5s linear infinite;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style> 