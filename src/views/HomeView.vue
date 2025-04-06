<template>
  <div class="home">
    <!-- 顶栏 -->
    <Header />
    
    <!-- 侧边栏 -->
    <Sidebar @category-selected="handleCategorySelected" />
    
    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 顶部大图 -->
      <div class="banner-wrapper">
        <img class="banner-image" src="https://objectstorageapi.hzh.sealos.run/s3k94e4s-sydh/AI 工具分类与举例 (1).png" alt="AI 工具分类与举例" />
      </div>
      
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <el-icon class="is-loading"><Loading /></el-icon>
        <span>加载网站数据中...</span>
      </div>
      
      <!-- 所有分类内容 -->
      <template v-else>
        <div v-for="category in categories" :key="category.id" :id="`category-${category.id}`" class="category-section">
          <!-- 分类标题 -->
          <h2 class="category-title">{{ category.category_name }}</h2>
          
          <!-- 分类下的网站列表 -->
          <div v-if="getCategoryWebsites(category.id).length > 0" class="websites-grid">
            <div v-for="website in getCategoryWebsites(category.id)" :key="website.id" class="website-cell">
              <WebsiteCard :website="website" />
            </div>
          </div>
          <el-empty v-else description="该分类下暂无网站" />
        </div>
      </template>
      
      <!-- 评论区域 -->
      <CommentSection />
    </div>
    
    <!-- 悬浮按钮 -->
    <div class="float-button" @click="openAddDialog" title="添加新网站">
      <el-icon><Plus /></el-icon>
      <span class="float-button-text">添加网站</span>
    </div>
    
    <!-- 添加网站对话框 -->
    <AddWebsiteDialog
      v-model:visible="addDialogVisible"
      @website-added="handleWebsiteAdded"
    />
    
    <!-- 添加返回顶部按钮 -->
    <div 
      v-if="showBackToTop" 
      class="back-to-top" 
      :class="{ visible: showBackToTop }"
      @click="scrollToTop"
    >
      <el-icon><Top /></el-icon>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { Plus, Loading, Top } from '@element-plus/icons-vue';
import Header from '../components/Header.vue';
import Sidebar from '../components/Sidebar.vue';
import WebsiteCard from '../components/WebsiteCard.vue';
import AddWebsiteDialog from '../components/AddWebsiteDialog.vue';
import CommentSection from '../components/CommentSection.vue';
import { categoryApi, websiteApi } from '../api';
import { ElMessage } from 'element-plus';

// 数据
const categories = ref([]);
const websitesByCategory = ref({});
const currentCategoryId = ref(1);
const addDialogVisible = ref(false);
const loading = ref(false);

// 返回顶部按钮控制
const showBackToTop = ref(false);

// 获取分类列表
const fetchCategories = async () => {
  try {
    const response = await categoryApi.getCategories();
    if (response.data.code === 200) {
      categories.value = response.data.data;
    }
  } catch (error) {
    console.error('获取分类列表失败:', error);
    ElMessage.error('获取分类列表失败，请刷新页面重试');
  }
};

// 获取网站列表
const fetchWebsites = async (categoryId) => {
  loading.value = true;
  try {
    const response = await websiteApi.getWebsitesByCategory(categoryId);
    if (response.data.code === 200) {
      // 将该分类的网站数据保存到缓存中
      websitesByCategory.value[categoryId] = response.data.data;
    }
  } catch (error) {
    console.error(`获取分类 ${categoryId} 的网站列表失败:`, error);
    ElMessage.error('获取网站列表失败，请刷新页面重试');
  } finally {
    loading.value = false;
  }
};

// 初始化所有分类的网站数据
const initAllWebsites = async () => {
  loading.value = true;
  try {
    // 先加载分类
    await fetchCategories();
    
    // 加载每个分类的网站数据
    const fetchPromises = categories.value.map(category => 
      fetchWebsites(category.id)
    );
    
    await Promise.all(fetchPromises);
  } catch (error) {
    console.error('初始化网站数据失败:', error);
  } finally {
    loading.value = false;
  }
};

// 获取指定分类的网站列表
const getCategoryWebsites = (categoryId) => {
  return websitesByCategory.value[categoryId] || [];
};

// 处理分类选择
const handleCategorySelected = (categoryId) => {
  currentCategoryId.value = categoryId;
  
  // 如果缓存中没有该分类的网站数据，则加载
  if (!websitesByCategory.value[categoryId]) {
    fetchWebsites(categoryId);
  }
};

// 打开添加网站对话框
const openAddDialog = () => {
  addDialogVisible.value = true;
};

// 处理网站添加
const handleWebsiteAdded = () => {
  // 网站添加成功后，刷新当前分类的数据
  fetchWebsites(currentCategoryId.value);
};

// 监听滚动事件以显示/隐藏返回顶部按钮
const handleScroll = () => {
  showBackToTop.value = window.scrollY > 300;
};

// 返回顶部
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

// 生命周期钩子
onMounted(() => {
  initAllWebsites();
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.home {
  min-height: 100vh;
  position: relative;
  padding-top: 80px; /* 与顶栏高度相同 */
}

.main-content {
  margin-left: 64px; /* 紧挨着侧边栏 */
  padding: 20px 30px;
  transition: margin-left 0.3s ease;
}

/* 当侧边栏折叠时调整主内容区域 */
:deep(.sidebar-container.collapsed) ~ .main-content {
  margin-left: 64px;
}

.banner-wrapper {
  width: 100%;
  height: auto;
  max-height: 280px;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 30px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.banner-wrapper:hover {
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
  transform: translateY(-5px);
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background-color: rgba(255, 255, 255, 0.8);
  transition: all 0.5s ease;
}

.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #909399;
  font-size: 16px;
}

.loading-container .el-icon {
  margin-right: 8px;
  font-size: 24px;
  animation: pulse 1.5s infinite ease-in-out;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.category-section {
  margin-bottom: 40px;
}

.category-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
  padding-left: 10px;
  border-left: 4px solid var(--accent-dark);
  position: relative;
  display: inline-block;
  transition: all 0.3s ease;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.category-title::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -5px;
  width: 0;
  height: 2px;
  background: linear-gradient(to right, var(--accent-dark), transparent);
  transition: width 0.3s ease;
}

.category-title:hover::after {
  width: 100%;
}

.category-title:hover {
  transform: translateX(5px);
  color: var(--accent-dark);
}

.websites-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
}

.website-cell {
  min-height: 100px;
  height: 120px; /* 统一高度 */
}

/* 响应式布局调整 */
@media (max-width: 1600px) {
  .websites-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 1200px) {
  .websites-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 992px) {
  .websites-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 10px;
    margin-left: 0;
  }
  
  .category-section {
    padding: 10px;
  }
  
  .category-title {
    font-size: 18px;
    margin-bottom: 15px;
    padding-left: 10px;
  }
  
  .website-grid {
    grid-template-columns: repeat(1, 1fr);
    gap: 16px;
  }
  
  .float-button {
    width: 44px;
    height: 44px;
    right: 15px;
    bottom: 15px;
    font-size: 18px;
  }
  
  /* 添加返回顶部按钮 */
  .back-to-top {
    position: fixed;
    bottom: 15px;
    left: 15px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, #ec407a 0%, #d81b60 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    z-index: 99;
    transition: all 0.2s ease;
    opacity: 0.8;
    transform: translateY(100px);
  }
  
  .back-to-top.visible {
    transform: translateY(0);
  }
  
  .back-to-top:hover {
    transform: translateY(-3px);
    opacity: 1;
  }
  
  .back-to-top:active {
    transform: scale(0.95);
  }
}

@media (max-width: 480px) {
  .websites-grid {
    gap: 12px;
  }
  
  .category-title {
    font-size: 16px;
  }
}

.float-button {
  position: fixed;
  right: 30px;
  bottom: 30px;
  width: auto;
  min-width: 65px;
  height: 65px;
  padding: 0 20px;
  background: var(--button-gradient);
  color: white;
  border-radius: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 8px 25px rgba(236, 64, 122, 0.2);
  z-index: 999;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  overflow: hidden;
}

.float-button:hover {
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 12px 30px rgba(236, 64, 122, 0.3);
  background: linear-gradient(135deg, rgba(236, 64, 122, 0.8), rgba(38, 198, 218, 0.8));
}

.float-button:active {
  transform: translateY(2px) scale(0.98);
  box-shadow: 0 5px 15px rgba(64, 158, 255, 0.3);
}

.float-button .el-icon {
  font-size: 26px;
  margin-right: 8px;
  transition: all 0.3s ease;
}

.float-button:hover .el-icon {
  transform: rotate(90deg);
}

.float-button-text {
  font-size: 16px;
  font-weight: 500;
  white-space: nowrap;
}

/* 在移动端只显示图标 */
@media (max-width: 768px) {
  .float-button {
    width: 60px;
    min-width: 60px;
    height: 60px;
    padding: 0;
    border-radius: 50%;
  }
  
  .float-button .el-icon {
    margin-right: 0;
  }
  
  .float-button-text {
    display: none;
  }
}
</style> 