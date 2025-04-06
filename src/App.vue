<script setup>
import '@/assets/styles/glassmorphism.css';
import MouseEffects from '@/components/MouseEffects.vue';
import { onMounted } from 'vue';

// 初始化背景粒子
onMounted(() => {
  const particles = document.querySelectorAll('.particle');
  
  particles.forEach(particle => {
    // 随机设置粒子的初始位置
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    
    // 随机设置粒子的大小
    const size = Math.random() * 100 + 50;
    
    // 随机设置粒子的透明度
    const opacity = Math.random() * 0.1 + 0.05;
    
    // 随机设置动画延迟和持续时间
    const delay = Math.random() * 5;
    const duration = Math.random() * 10 + 20;
    
    // 应用样式
    particle.style.left = `${x}%`;
    particle.style.top = `${y}%`;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.opacity = opacity;
    particle.style.animationDelay = `${delay}s`;
    particle.style.animationDuration = `${duration}s`;
  });
});
</script>

<template>
  <div class="app-container">
    <!-- 鼠标特效组件 -->
    <MouseEffects />
    
    <!-- 背景粒子 -->
    <div class="particles-container">
      <div v-for="n in 20" :key="n" class="particle"></div>
    </div>
    
    <router-view />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: linear-gradient(135deg, #e0f7fa 0%, #f5f7fa 50%, #e8f5e9 100%);
  background-attachment: fixed;
}

.app-container {
  width: 100%;
  min-height: 100vh;
  position: relative;
}

/* 背景粒子 */
.particles-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
}

.particle {
  position: absolute;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(to right, rgba(64, 158, 255, 0.1), rgba(100, 200, 255, 0.1));
  animation: float linear infinite;
}

@keyframes float {
  0% {
    transform: translateY(0) translateX(0) rotate(0deg) scale(1);
  }
  25% {
    transform: translateY(-20px) translateX(20px) rotate(90deg) scale(1.1);
  }
  50% {
    transform: translateY(0) translateX(40px) rotate(180deg) scale(1);
  }
  75% {
    transform: translateY(20px) translateX(20px) rotate(270deg) scale(0.9);
  }
  100% {
    transform: translateY(0) translateX(0) rotate(360deg) scale(1);
  }
}
</style>
