<template>
  <div class="sidebar-container" :class="{ 'collapsed': isCollapsed }">
    <!-- 背景遮罩，用于移动端点击关闭侧边栏 -->
    <div 
      v-if="!isCollapsed && isMobile" 
      class="sidebar-overlay" 
      @click="toggleCollapse"
    ></div>
    
    <div class="sidebar">
      <div class="logo">
        <div class="collapse-toggle" @click="toggleCollapse" :title="isCollapsed ? '展开菜单' : '折叠菜单'">
          <div class="toggle-content">
            <el-icon :size="22">
              <ArrowRight v-if="isCollapsed" />
              <ArrowLeft v-else />
            </el-icon>
            <span v-if="!isCollapsed" class="toggle-text">折叠</span>
            <span v-else class="toggle-text-expand">展开</span>
          </div>
        </div>
      </div>
      <el-menu
        :default-active="activeCategory.toString()"
        class="sidebar-menu"
        @select="handleSelect"
        :collapse="isCollapsed"
      >
        <el-menu-item v-for="category in categories" :key="category.id" :index="category.id.toString()">
          <el-icon><component :is="getCategoryIcon(category)" /></el-icon>
          <template #title>{{ category.category_name }}</template>
        </el-menu-item>
      </el-menu>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { ArrowRight, ArrowLeft } from '@element-plus/icons-vue';
import { categoryApi } from '../api';
import { ElLoading } from 'element-plus';

const emit = defineEmits(['category-selected']);
const categories = ref([]);
const activeCategory = ref(1); // 默认显示第一个分类
const isCollapsed = ref(false);
const isMobile = ref(false);

// 检查是否为移动设备视图
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
  // 在移动设备下默认折叠侧边栏
  if (isMobile.value && !isCollapsed.value) {
    isCollapsed.value = true;
  }
};

// 根据分类获取对应的图标
const getCategoryIcon = (category) => {
  // 这里可以根据分类名或ID返回不同图标
  const iconMap = {
    '设计工具': 'Tools',
    'AIGC工具': 'Magic',
    '高质图库': 'Picture',
    '设计教程': 'Reading',
    '配色方案': 'Brush',
    '字体下载': 'FontSize'
  };
  
  // 默认返回一个通用图标，如果找到映射则返回对应图标
  return iconMap[category.category_name] || 'Menu';
};

const handleSelect = (index) => {
  activeCategory.value = parseInt(index);
  emit('category-selected', activeCategory.value);
  
  // 在移动设备上点击菜单项后自动折叠侧边栏
  if (isMobile.value) {
    isCollapsed.value = true;
  }
  
  // 滚动到对应分类的位置
  const categoryElement = document.getElementById(`category-${index}`);
  if (categoryElement) {
    categoryElement.scrollIntoView({ behavior: 'smooth' });
  }
};

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
};

// 获取分类数据
const fetchCategories = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: '加载分类...',
    background: 'rgba(0, 0, 0, 0.7)'
  });
  
  try {
    const response = await categoryApi.getCategories();
    if (response.data.code === 200) {
      categories.value = response.data.data;
      
      // 如果分类数据加载成功，设置默认选中第一个分类
      if (categories.value.length > 0) {
        activeCategory.value = categories.value[0].id;
        emit('category-selected', activeCategory.value);
      }
    }
  } catch (error) {
    console.error('获取分类失败:', error);
  } finally {
    loading.close();
  }
};

onMounted(() => {
  fetchCategories();
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkMobile);
});
</script>

<style scoped>
.sidebar-container {
  position: fixed;
  top: 80px; /* 与顶栏高度相同 */
  left: 0;
  height: calc(100vh - 80px); /* 减去顶栏高度 */
  z-index: 1000;
  transition: all 0.2s ease-out; /* 加快过渡时间 */
  display: flex;
}

.sidebar-overlay {
  position: fixed;
  top: 80px;
  left: 0;
  width: 100%;
  height: calc(100vh - 80px);
  background: rgba(0, 0, 0, 0.4);
  z-index: -1;
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
}

.sidebar {
  width: 220px;
  height: 100%;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  transition: width 0.2s ease-out; /* 加快过渡时间 */
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  position: relative;
  will-change: width; /* 提高性能 */
  transform: translateZ(0); /* 开启硬件加速 */
}

.sidebar-container.collapsed .sidebar {
  width: 64px;
}

.logo {
  height: 50px;
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(245, 247, 250, 0.6);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.collapse-toggle {
  width: 100%;
  height: 50px;
  background: rgba(255, 255, 255, 0.2);
  color: rgba(236, 64, 122, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease-out; /* 加快过渡时间 */
  border-radius: 0;
  border: none;
}

.toggle-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-text, .toggle-text-expand {
  margin-left: 5px;
  font-size: 14px;
  font-weight: 500;
}

.toggle-text-expand {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.sidebar-container.collapsed .toggle-text-expand {
  opacity: 1;
  pointer-events: all;
  margin-left: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.9);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  color: rgba(236, 64, 122, 0.8);
  display: none;
}

.sidebar-container.collapsed .collapse-toggle:hover .toggle-text-expand {
  display: block;
}

.collapse-toggle:hover {
  background: rgba(236, 64, 122, 0.1);
}

.collapse-toggle:active {
  transform: scale(0.97);
}

.sidebar-menu {
  border-right: none;
  background: transparent !important;
  flex: 1;
}

.sidebar-menu .el-menu-item {
  display: flex;
  align-items: center;
  height: 50px;
  padding: 0 20px;
  margin: 2px 0;
  border-radius: 0;
  transition: all 0.2s ease-out; /* 加快过渡时间 */
  position: relative;
  overflow: hidden;
}

.sidebar-menu .el-menu-item:hover {
  background-color: rgba(248, 187, 208, 0.1) !important;
  transform: translateX(5px);
}

.sidebar-menu .el-menu-item.is-active {
  background-color: rgba(248, 187, 208, 0.2) !important;
  color: rgba(236, 64, 122, 0.8) !important;
  font-weight: bold;
  box-shadow: 0 4px 15px rgba(236, 64, 122, 0.15);
  transform: translateX(8px);
}

.sidebar-menu .el-menu-item.is-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 4px;
  background: linear-gradient(to bottom, rgba(128, 222, 234, 0.7), rgba(248, 187, 208, 0.7));
  border-radius: 0 2px 2px 0;
  box-shadow: 0 0 10px rgba(236, 64, 122, 0.3);
  animation: pulse-border 1.5s infinite alternate;
}

@keyframes pulse-border {
  from {
    opacity: 0.6;
    box-shadow: 0 0 5px rgba(236, 64, 122, 0.2);
  }
  to {
    opacity: 1;
    box-shadow: 0 0 15px rgba(236, 64, 122, 0.4);
  }
}

.sidebar-menu .el-menu-item.is-active::after {
  content: '';
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 6px;
  background-color: rgba(236, 64, 122, 0.8);
  border-radius: 50%;
  opacity: 0.7;
  box-shadow: 0 0 8px rgba(236, 64, 122, 0.5);
}

.sidebar-menu .el-menu-item .el-icon {
  margin-right: 10px;
  transition: all 0.3s ease;
}

.sidebar-menu .el-menu-item:hover .el-icon {
  transform: scale(1.2);
  color: rgba(236, 64, 122, 0.8);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sidebar-container:not(.collapsed) {
    width: 100vw;
  }
  
  .sidebar-container.collapsed {
    width: auto;
    background: none;
  }
  
  .sidebar {
    width: 50%; /* 移动端宽度稍窄 */
    max-width: 200px;
  }
}
</style> 