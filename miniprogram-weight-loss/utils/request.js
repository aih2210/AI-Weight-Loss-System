// utils/request.js
// HTTP请求工具类

const { API_BASE_URL, TIMEOUT, TOKEN_KEY } = require('./config.js');

/**
 * 发送HTTP请求
 * @param {Object} options 请求配置
 * @returns {Promise}
 */
function request(options) {
  return new Promise((resolve, reject) => {
    // 获取token
    const token = wx.getStorageSync(TOKEN_KEY);
    
    // 构建请求头
    const header = {
      'Content-Type': 'application/json',
      ...options.header
    };
    
    // 如果有token，添加到请求头
    if (token) {
      header['Authorization'] = `Bearer ${token}`;
    }
    
    // 发送请求
    wx.request({
      url: options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: header,
      timeout: options.timeout || TIMEOUT,
      success: (res) => {
        // 请求成功
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data);
        } else if (res.statusCode === 401) {
          // Token过期或无效
          wx.removeStorageSync(TOKEN_KEY);
          wx.removeStorageSync('userInfo');
          
          wx.showModal({
            title: '登录已过期',
            content: '请重新登录',
            showCancel: false,
            success: () => {
              wx.navigateTo({
                url: '/pages/login/login'
              });
            }
          });
          
          reject(new Error('未授权'));
        } else {
          // 其他错误
          reject(res.data || new Error('请求失败'));
        }
      },
      fail: (err) => {
        // 请求失败
        console.error('请求失败:', err);
        reject(err);
      }
    });
  });
}

/**
 * GET请求
 */
function get(url, data = {}, options = {}) {
  return request({
    url,
    method: 'GET',
    data,
    ...options
  });
}

/**
 * POST请求
 */
function post(url, data = {}, options = {}) {
  return request({
    url,
    method: 'POST',
    data,
    ...options
  });
}

/**
 * PUT请求
 */
function put(url, data = {}, options = {}) {
  return request({
    url,
    method: 'PUT',
    data,
    ...options
  });
}

/**
 * DELETE请求
 */
function del(url, data = {}, options = {}) {
  return request({
    url,
    method: 'DELETE',
    data,
    ...options
  });
}

/**
 * 上传文件
 */
function upload(url, filePath, name = 'file', formData = {}) {
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync(TOKEN_KEY);
    
    wx.uploadFile({
      url,
      filePath,
      name,
      formData,
      header: {
        'Authorization': token ? `Bearer ${token}` : ''
      },
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const data = JSON.parse(res.data);
            resolve(data);
          } catch (e) {
            resolve(res.data);
          }
        } else {
          reject(new Error('上传失败'));
        }
      },
      fail: reject
    });
  });
}

module.exports = {
  request,
  get,
  post,
  put,
  del,
  upload
};
