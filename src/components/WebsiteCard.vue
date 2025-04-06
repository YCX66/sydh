<template>
  <div 
    class="website-card glass-effect" 
    :class="{ 'featured': featured, 'horizontal': horizontal }"
    @click="navigateToWebsite"
  >
    <div class="website-logo">
      <img 
        :src="website.icon_url" 
        :alt="website.website_name" 
        @error="handleImageError"
      />
      <div v-if="imageError" class="icon-fallback">
        {{ getFirstLetter() }}
      </div>
    </div>
    <div class="website-info">
      <h3 class="website-title">{{ website.website_name }}</h3>
      <p class="website-description">{{ website.intro }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  website: {
    type: Object,
    required: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  horizontal: {
    type: Boolean,
    default: false
  }
});

const imageError = ref(false);

const navigateToWebsite = () => {
  window.open(props.website.link, '_blank');
};

const handleImageError = () => {
  imageError.value = true;
};

const getFirstLetter = () => {
  const name = props.website.website_name || '';
  return name.charAt(0).toUpperCase();
};

const formatUrl = (url) => {
  if (!url) return '';
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
};
</script>

<style scoped>
.website-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 15px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
  min-height: 120px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.website-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 15px 40px rgba(31, 38, 135, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.website-card:active {
  transform: translateY(-2px) scale(0.98);
}

.website-logo {
  width: 50px;
  height: 50px;
  min-width: 50px;
  border-radius: 12px;
  overflow: hidden;
  margin-right: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background-color: rgba(245, 247, 250, 0.3);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.website-card:hover .website-logo {
  transform: scale(1.1) rotate(3deg);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.website-logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
}

.icon-fallback {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #409EFF, #53a8ff);
  color: white;
  font-size: 20px;
  font-weight: bold;
}

.website-info {
  flex: 1;
  overflow: hidden;
}

.website-title {
  margin: 0 0 5px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.3s ease;
}

.website-card:hover .website-title {
  color: #409EFF;
  transform: translateX(3px);
}

.website-description {
  margin: 0;
  font-size: 12px;
  color: #606266;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.5;
  max-height: 36px;
  transition: all 0.3s ease;
}

/* 特色卡片样式 */
.website-card.featured {
  padding: 20px;
  background: linear-gradient(
    135deg, 
    rgba(255, 255, 255, 0.2), 
    rgba(219, 237, 255, 0.25)
  );
  box-shadow: 0 15px 35px rgba(31, 38, 135, 0.15);
}

.website-card.featured .website-logo {
  width: 80px;
  height: 80px;
  margin-right: 25px;
  border-radius: 16px;
}

.website-card.featured .website-title {
  font-size: 22px;
  margin-bottom: 10px;
}

.website-card.featured .website-description {
  font-size: 14px;
  -webkit-line-clamp: 3;
}

/* 横向卡片样式 */
.website-card.horizontal {
  padding: 18px;
  background: linear-gradient(
    to right,
    rgba(245, 247, 255, 0.15),
    rgba(235, 245, 255, 0.25)
  );
}

.website-card.horizontal .website-logo {
  width: 60px;
  height: 60px;
  margin-right: 20px;
  border-radius: 14px;
}

.website-card.horizontal .website-title {
  font-size: 18px;
  margin-bottom: 8px;
}

/* 移动端样式优化 */
@media (max-width: 768px) {
  .website-card {
    padding: 12px;
  }
  
  .website-logo {
    width: 40px;
    height: 40px;
    min-width: 40px;
  }
  
  .website-title {
    font-size: 15px;
    margin-bottom: 6px;
  }
  
  .website-description {
    font-size: 12px;
    -webkit-line-clamp: 2;
    margin-bottom: 6px;
  }
  
  .website-url {
    font-size: 11px;
  }
  
  .card-actions {
    margin-top: 6px;
  }
}
</style> 