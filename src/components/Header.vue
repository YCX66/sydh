<template>
  <header class="header">
    <div class="sky-canopy">
      <div v-for="n in 50" :key="n" class="star-particle"></div>
    </div>
    <div class="container">
      <div class="logo-container">
        <h1 class="logo-text">任意门<span class="subtitle">--极客们都喜欢的AI导航网站</span></h1>
      </div>
    </div>
  </header>
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  const particles = document.querySelectorAll('.star-particle');
  
  particles.forEach(particle => {
    // 随机设置粒子的初始位置
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    
    // 随机设置粒子的大小
    const size = Math.random() * 3 + 1;
    
    // 随机设置粒子的亮度和透明度
    const brightness = Math.random() * 100 + 50;
    const opacity = Math.random() * 0.5 + 0.3;
    
    // 随机设置动画延迟和持续时间
    const delay = Math.random() * 10;
    const duration = Math.random() * 15 + 10;
    
    // 应用样式
    particle.style.left = `${x}%`;
    particle.style.top = `${y}%`;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.filter = `brightness(${brightness}%)`;
    particle.style.opacity = opacity;
    particle.style.animationDelay = `${delay}s`;
    particle.style.animationDuration = `${duration}s`;
  });
});
</script>

<style scoped>
.header {
  height: 80px;
  width: 100%;
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1001;
  overflow: hidden;
  border-bottom: none;
  background: linear-gradient(to bottom, rgba(128, 222, 234, 0.7), rgba(236, 64, 122, 0.1));
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}

.sky-canopy {
  position: absolute;
  top: -100%;
  left: 0;
  width: 100%;
  height: 200%;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
  opacity: 0.9;
}

.star-particle {
  position: absolute;
  width: 2px;
  height: 2px;
  background-color: white;
  border-radius: 50%;
  box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.8);
  animation: star-float linear infinite, pulse 3s ease-in-out infinite alternate;
  z-index: -1;
}

@keyframes star-float {
  0% {
    transform: translateY(0) translateX(0) scale(1);
    opacity: var(--init-opacity, 0.5);
  }
  100% {
    transform: translateY(150px) translateX(30px) scale(0);
    opacity: 0;
  }
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 5px 1px rgba(255, 255, 255, 0.5);
  }
  100% {
    box-shadow: 0 0 15px 3px rgba(255, 255, 255, 0.8);
  }
}

.container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  position: relative;
  z-index: 1;
}

.logo-container {
  display: flex;
  align-items: center;
  position: relative;
}

.logo-container::before,
.logo-container::after {
  content: '';
  position: absolute;
  height: 2px;
  background: linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0));
  width: 100px;
  animation: glowing 3s infinite alternate;
}

.logo-container::before {
  left: -150%;
  top: 50%;
}

.logo-container::after {
  right: -150%;
  top: 50%;
}

@keyframes glowing {
  0% {
    width: 100px;
    opacity: 0.3;
  }
  100% {
    width: 150px;
    opacity: 0.8;
  }
}

.logo-text {
  font-size: 32px;
  font-weight: 900;
  margin: 0;
  letter-spacing: 2px;
  color: #000000;
  -webkit-text-fill-color: #000000;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.7);
  font-family: 'Playfair Display', serif;
  position: relative;
  display: flex;
  align-items: center;
  background: none;
  -webkit-background-clip: unset;
}

.subtitle {
  font-size: 16px;
  font-weight: 500;
  margin-left: 10px;
  letter-spacing: 1px;
  color: white;
  -webkit-text-fill-color: white;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3), 0 0 15px rgba(128, 222, 234, 0.6);
  white-space: nowrap;
}

@keyframes text-glow {
  0% {
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.5), 0 0 20px rgba(128, 222, 234, 0.4);
    letter-spacing: 2px;
  }
  100% {
    text-shadow: 0 0 20px rgba(255, 255, 255, 0.8), 0 0 30px rgba(128, 222, 234, 0.8), 0 0 40px rgba(128, 222, 234, 0.4);
    letter-spacing: 3px;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .logo-text {
    font-size: 22px;
  }
  
  .subtitle {
    font-size: 12px;
    margin-left: 5px;
  }
}
</style> 