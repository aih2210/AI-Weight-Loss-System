import axios from 'axios';

// 配置API基础URL
const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 用户相关API
export const userAPI = {
  register: (data: any) => api.post('/users/register', data),
  getProfile: (userId: string) => api.get(`/users/${userId}`),
  updateProfile: (userId: string, data: any) => 
    api.put(`/users/${userId}`, data),
};

// 代谢建模API
export const metabolismAPI = {
  predictBMR: (data: any) => api.post('/metabolism/predict-bmr', data),
  detectPlateau: (userId: string, weightHistory: number[]) =>
    api.post('/metabolism/detect-plateau', { user_id: userId, weight_history: weightHistory }),
  predictWeight: (userId: string, days: number = 7) =>
    api.post('/metabolism/predict-weight', { user_id: userId, days }),
};

// 饮食管理API
export const dietAPI = {
  recognizeFood: (imageFile: any) => {
    const formData = new FormData();
    formData.append('file', imageFile);
    return api.post('/diet/recognize-food', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  logFood: (data: any) => api.post('/diet/log-food', data),
  logEmotion: (data: any) => api.post('/diet/log-emotion', data),
  analyzeEmotionPattern: (userId: string) =>
    api.get(`/diet/analyze-emotion-pattern/${userId}`),
  generateRecipe: (originalFood: string, calorieTarget: number) =>
    api.post('/diet/generate-recipe', { original_food: originalFood, calorie_target: calorieTarget }),
};

// 运动管理API
export const exerciseAPI = {
  generatePlan: (data: any) => api.post('/exercise/generate-plan', data),
  logExercise: (data: any) => api.post('/exercise/log-exercise', data),
  analyzeAdherence: (userId: string) =>
    api.get(`/exercise/analyze-adherence/${userId}`),
  getMinimalPlan: (userId: string) =>
    api.post(`/exercise/minimal-plan/${userId}`),
};

// 数据分析API
export const analyticsAPI = {
  getDashboard: (userId: string) => api.get(`/analytics/dashboard/${userId}`),
  getProgress: (userId: string, startDate: string, endDate: string) =>
    api.get(`/analytics/progress/${userId}`, {
      params: { start_date: startDate, end_date: endDate },
    }),
};

export default api;
