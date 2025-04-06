<template>
  <div class="mouse-effects-container">
    <!-- 鼠标点击特效容器 -->
    <div ref="clickEffectsContainer" class="click-effects-container"></div>
    
    <!-- 鼠标尾迹容器 -->
    <div ref="trailContainer" class="trail-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// 引用DOM元素
const clickEffectsContainer = ref(null);
const trailContainer = ref(null);

// 存储尾迹元素
const trails = [];
const MAX_TRAILS = 20;
const TRAIL_TIMEOUT = 50;

// 鼠标点击特效
const handleClick = (e) => {
  if (!clickEffectsContainer.value) return;
  
  // 创建点击特效
  const clickEffect = document.createElement('div');
  clickEffect.className = 'click-effect';
  
  // 设置特效位置
  clickEffect.style.left = `${e.clientX}px`;
  clickEffect.style.top = `${e.clientY}px`;
  
  // 添加到容器
  clickEffectsContainer.value.appendChild(clickEffect);
  
  // 动画结束后移除
  clickEffect.addEventListener('animationend', () => {
    clickEffect.remove();
  });
};

// 鼠标移动尾迹特效
let trailTimeout;
const handleMouseMove = (e) => {
  if (!trailContainer.value) return;
  
  // 限制尾迹生成频率
  if (trailTimeout) return;
  trailTimeout = setTimeout(() => {
    trailTimeout = null;
  }, TRAIL_TIMEOUT);
  
  // 创建尾迹元素
  const trail = document.createElement('div');
  trail.className = 'mouse-trail';
  
  // 随机生成尾迹颜色
  const hue = Math.random() * 360;
  trail.style.backgroundColor = `hsla(${hue}, 100%, 70%, 0.7)`;
  
  // 设置尾迹位置
  trail.style.left = `${e.clientX}px`;
  trail.style.top = `${e.clientY}px`;
  
  // 添加到容器
  trailContainer.value.appendChild(trail);
  trails.push(trail);
  
  // 限制尾迹数量
  if (trails.length > MAX_TRAILS) {
    const oldestTrail = trails.shift();
    oldestTrail.remove();
  }
  
  // 动画结束后移除
  setTimeout(() => {
    if (trails.includes(trail)) {
      const index = trails.indexOf(trail);
      if (index > -1) {
        trails.splice(index, 1);
      }
      trail.remove();
    }
  }, 1000);
};

// 生命周期钩子
onMounted(() => {
  // 添加事件监听
  window.addEventListener('click', handleClick);
  window.addEventListener('mousemove', handleMouseMove);
});

onUnmounted(() => {
  // 移除事件监听
  window.removeEventListener('click', handleClick);
  window.removeEventListener('mousemove', handleMouseMove);
  
  // 清除定时器
  if (trailTimeout) {
    clearTimeout(trailTimeout);
  }
});
</script>

<style scoped>
.mouse-effects-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
  overflow: hidden;
}

.click-effects-container,
.trail-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* 点击特效 */
.click-effect {
  position: absolute;
  transform: translate(-50%, -50%);
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
  animation: click-animation 0.8s cubic-bezier(0, 0.2, 0.8, 1) forwards;
}

@keyframes click-animation {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(0);
    background-color: rgba(255, 255, 255, 0.8);
    box-shadow: 0 0 10px 5px rgba(255, 255, 255, 0.8);
  }
  50% {
    opacity: 0.8;
    transform: translate(-50%, -50%) scale(1);
    background-color: rgba(64, 158, 255, 0.8);
    box-shadow: 0 0 10px 15px rgba(64, 158, 255, 0.5);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(1.5);
    background-color: rgba(64, 158, 255, 0);
    box-shadow: 0 0 10px 25px rgba(64, 158, 255, 0);
  }
}

/* 鼠标尾迹 */
.mouse-trail {
  position: absolute;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: trail-animation 1s ease-out forwards;
}

@keyframes trail-animation {
  0% {
    opacity: 0.7;
    width: 8px;
    height: 8px;
    box-shadow: 0 0 10px 2px currentColor;
  }
  100% {
    opacity: 0;
    width: 15px;
    height: 15px;
    box-shadow: 0 0 20px 5px currentColor;
  }
}
</style> 