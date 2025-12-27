// utils/config.js
// API配置文件

// ==================== AI视觉识别配置 ====================

// 百度AI配置（推荐 - 专门针对食物识别优化）
const BAIDU_API_KEY = 'YOUR_API_KEY_HERE'; // 百度AI API Key
const BAIDU_SECRET_KEY = 'YOUR_SECRET_KEY_HERE'; // 百度AI Secret Key

// 腾讯云AI配置（备选方案）
const TENCENT_SECRET_ID = 'YOUR_SECRET_ID_HERE'; // 腾讯云SecretId
const TENCENT_SECRET_KEY = 'YOUR_SECRET_KEY_HERE'; // 腾讯云SecretKey
const TENCENT_APP_ID = 'YOUR_APP_ID_HERE'; // 腾讯云AppId

// 通义千问API配置（备选方案）
const QWEN_API_KEY = 'YOUR_API_KEY_HERE'; // 通义千问API Key

// ==================== 小程序配置 ====================

// 小程序配置
const WECHAT_CONFIG = {
  // 小程序AppID（从微信公众平台获取）
  appId: 'YOUR_APP_ID_HERE', // 请填入你的AppID
  
  // 小程序AppSecret（从微信公众平台获取）
  // ⚠️ 注意：AppSecret不应该暴露在前端代码中，应该在后端使用
  appSecret: 'YOUR_APP_SECRET_HERE',
};

// 开发环境API地址
const DEV_API_BASE_URL = 'http://localhost:8000';

// 生产环境API地址（部署后修改）
const PROD_API_BASE_URL = 'https://your-domain.com';

// 当前环境（开发/生产）
const ENV = 'development'; // 'development' 或 'production'

// 根据环境选择API地址
const API_BASE_URL = ENV === 'development' ? DEV_API_BASE_URL : PROD_API_BASE_URL;

// 导出配置
module.exports = {
  API_BASE_URL,
  ENV,
  WECHAT_CONFIG,
  // AI视觉识别
  BAIDU_API_KEY,
  BAIDU_SECRET_KEY,
  TENCENT_SECRET_ID,
  TENCENT_SECRET_KEY,
  TENCENT_APP_ID,
  QWEN_API_KEY,
  
  // API端点
  API: {
    // 用户认证
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/users/register`,
    USER_INFO: `${API_BASE_URL}/api/users/me`,
    
    // 饮食记录
    FOOD_LOGS: `${API_BASE_URL}/api/diet/logs`,
    
    // 运动记录
    EXERCISE_LOGS: `${API_BASE_URL}/api/exercise/logs`,
    
    // 体重记录
    WEIGHT_LOGS: `${API_BASE_URL}/api/weight/logs`,
    
    // AI功能
    AI_CHAT: `${API_BASE_URL}/api/ai/chat`,
    AI_RECIPE: `${API_BASE_URL}/api/ai/recipe`,
  },
  
  // 请求超时时间（毫秒）
  TIMEOUT: 10000,
  
  // Token存储key
  TOKEN_KEY: 'access_token',
  USER_INFO_KEY: 'userInfo',
};
