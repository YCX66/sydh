import axios from 'axios';

// 创建axios实例
const apiClient = axios.create({
  baseURL: 'https://attsfnmbqrdg.sealoshzh.site/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
apiClient.interceptors.request.use(
  config => {
    // 可以在这里添加认证信息等
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // 全局错误处理
    console.error('API请求错误:', error);
    return Promise.reject(error);
  }
);

// 导航分类相关API
export const categoryApi = {
  // 获取所有导航分类
  getCategories() {
    return apiClient.get('/categories');
  },
  
  // 获取分类详情
  getCategoryDetail(id) {
    return apiClient.get(`/categories/${id}`);
  },
  
  // 添加新分类
  addCategory(categoryData) {
    return apiClient.post('/categories', categoryData);
  },
  
  // 更新分类
  updateCategory(id, categoryData) {
    return apiClient.put(`/categories/${id}`, categoryData);
  },
  
  // 删除分类
  deleteCategory(id) {
    return apiClient.delete(`/categories/${id}`);
  }
};

// 网站信息相关API
export const websiteApi = {
  // 获取所有网站
  getAllWebsites() {
    return apiClient.get('/websites');
  },
  
  // 获取指定分类的网站列表
  getWebsitesByCategory(categoryId) {
    return apiClient.get(`/websites/category/${categoryId}`);
  },
  
  // 获取网站详情
  getWebsiteDetail(id) {
    return apiClient.get(`/websites/${id}`);
  },
  
  // 添加新网站
  addWebsite(websiteData) {
    return apiClient.post('/websites', websiteData);
  },
  
  // 提交众包网站
  submitWebsite(formData) {
    return apiClient.post('/websites/submit', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  // 更新网站信息
  updateWebsite(id, websiteData) {
    return apiClient.put(`/websites/${id}`, websiteData);
  },
  
  // 删除网站
  deleteWebsite(id) {
    return apiClient.delete(`/websites/${id}`);
  }
};

// 评论相关API
export const commentApi = {
  // 获取评论列表
  getComments() {
    return apiClient.get('/comments');
  },
  
  // 提交评论
  submitComment(commentData) {
    return apiClient.post('/comments', commentData);
  }
};

// 随机身份相关API
export const identityApi = {
  // 获取随机用户身份
  getRandomIdentity() {
    return apiClient.get('/identities/random');
  }
};

// 导出API客户端，方便直接使用
export { apiClient }; 