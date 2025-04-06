.website-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 16px;
  margin: 20px 0;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.empty-state:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(31, 38, 135, 0.15);
}

.empty-icon {
  font-size: 60px;
  color: #DCDFE6;
  margin-bottom: 20px;
  opacity: 0.7;
}

.empty-text {
  font-size: 16px;
  color: #909399;
  margin-bottom: 20px;
  font-weight: 500;
}

.website-enter-active,
.website-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.website-enter-from,
.website-leave-to {
  opacity: 0;
  transform: scale(0.8) translateY(30px);
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.loading-icon {
  font-size: 40px;
  color: #409EFF;
  margin-bottom: 20px;
  animation: pulse 1.5s ease infinite alternate;
}

.loading-text {
  font-size: 16px;
  color: #606266;
  font-weight: 500;
}

@keyframes pulse {
  0% {
    opacity: 0.5;
    transform: scale(0.95);
  }
  100% {
    opacity: 1;
    transform: scale(1.05);
  }
} 