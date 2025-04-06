<template>
  <div class="login-container">
    <div class="login-bubbles">
      <div v-for="n in 7" :key="n" class="bubble"></div>
    </div>
    <div class="login-form-wrapper">
      <div class="login-card">
        <h2 class="login-title">登录系统</h2>
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          size="large"
        >
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="用户名"
              prefix-icon="user"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="密码"
              prefix-icon="lock"
              @keyup.enter="handleLogin"
            />
          </el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            class="login-button"
            @click="handleLogin"
          >
            登录
          </el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  position: relative;
  overflow: hidden;
  padding: 20px;
}

.login-bubbles {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
}

.bubble {
  position: absolute;
  bottom: -100px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  opacity: 0.5;
  animation: rise 15s infinite ease-in;
}

.bubble:nth-child(1) {
  width: 40px;
  height: 40px;
  left: 10%;
  animation-duration: 8s;
}

.bubble:nth-child(2) {
  width: 20px;
  height: 20px;
  left: 20%;
  animation-duration: 5s;
  animation-delay: 1s;
}

.bubble:nth-child(3) {
  width: 50px;
  height: 50px;
  left: 35%;
  animation-duration: 10s;
  animation-delay: 2s;
}

.bubble:nth-child(4) {
  width: 80px;
  height: 80px;
  left: 50%;
  animation-duration: 7s;
  animation-delay: 0s;
}

.bubble:nth-child(5) {
  width: 35px;
  height: 35px;
  left: 65%;
  animation-duration: 6s;
  animation-delay: 1s;
}

.bubble:nth-child(6) {
  width: 45px;
  height: 45px;
  left: 80%;
  animation-duration: 8s;
  animation-delay: 3s;
}

.bubble:nth-child(7) {
  width: 25px;
  height: 25px;
  left: 90%;
  animation-duration: 7s;
  animation-delay: 2s;
}

@keyframes rise {
  0% {
    bottom: -100px;
    transform: translateX(0);
  }
  50% {
    transform: translateX(100px);
  }
  100% {
    bottom: 1080px;
    transform: translateX(-100px);
  }
}

.login-form-wrapper {
  width: 100%;
  max-width: 450px;
  z-index: 1;
  perspective: 1000px;
}

.login-card {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.2);
  padding: 40px 30px;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
  animation: card-entrance 0.8s ease-out;
}

@keyframes card-entrance {
  0% {
    opacity: 0;
    transform: translateY(40px) rotateX(10deg);
  }
  100% {
    opacity: 1;
    transform: translateY(0) rotateX(0);
  }
}

.login-card:hover {
  box-shadow: 0 15px 45px rgba(31, 38, 135, 0.3);
  transform: translateY(-5px);
}

.login-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 30px;
  color: #fff;
  text-align: center;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
}

.login-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 3px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0));
  border-radius: 3px;
}

.login-form {
  margin-top: 20px;
}

:deep(.el-form-item) {
  margin-bottom: 25px;
}

:deep(.el-input__wrapper) {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: none;
  padding: 0 15px;
  height: 50px;
  transition: all 0.3s ease;
}

:deep(.el-input__wrapper:hover) {
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.3), 0 0 15px rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.7);
}

:deep(.el-input__inner) {
  color: #fff;
  height: 100%;
}

:deep(.el-input__inner::placeholder) {
  color: rgba(255, 255, 255, 0.7);
}

:deep(.el-form-item__label) {
  color: #fff;
  font-weight: 500;
  font-size: 16px;
}

.login-button {
  width: 100%;
  padding: 12px;
  height: 50px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  border: none;
  border-radius: 10px;
  color: white;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  margin-top: 10px;
}

.login-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.15);
  background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%);
}

.login-button:active {
  transform: translateY(0);
} 