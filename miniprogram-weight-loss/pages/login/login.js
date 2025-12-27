// pages/login/login.js
const { API } = require('../../utils/config.js');
const { post, get } = require('../../utils/request.js');

Page({
  data: {
    activeTab: 'login', // 'login' 或 'register'
    
    // 登录表单
    loginUsername: '',
    loginPassword: '',
    
    // 注册表单
    registerUsername: '',
    registerEmail: '',
    registerPassword: '',
    registerPasswordConfirm: '',
    registerName: '',
    
    // 状态
    isLoading: false,
    rememberMe: false
  },

  onLoad(options) {
    // 如果传入了tab参数，切换到对应tab
    if (options.tab) {
      this.setData({
        activeTab: options.tab
      });
    }
    
    // 检查是否已登录
    const token = wx.getStorageSync('access_token');
    if (token) {
      wx.showModal({
        title: '提示',
        content: '您已登录，是否返回？',
        success: (res) => {
          if (res.confirm) {
            wx.navigateBack();
          }
        }
      });
    }
  },

  // 切换Tab
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      activeTab: tab
    });
  },

  // 登录表单输入
  onLoginUsernameInput(e) {
    this.setData({
      loginUsername: e.detail.value
    });
  },

  onLoginPasswordInput(e) {
    this.setData({
      loginPassword: e.detail.value
    });
  },

  // 注册表单输入
  onRegisterUsernameInput(e) {
    this.setData({
      registerUsername: e.detail.value
    });
  },

  onRegisterEmailInput(e) {
    this.setData({
      registerEmail: e.detail.value
    });
  },

  onRegisterPasswordInput(e) {
    this.setData({
      registerPassword: e.detail.value
    });
  },

  onRegisterPasswordConfirmInput(e) {
    this.setData({
      registerPasswordConfirm: e.detail.value
    });
  },

  onRegisterNameInput(e) {
    this.setData({
      registerName: e.detail.value
    });
  },

  // 记住我
  toggleRememberMe() {
    this.setData({
      rememberMe: !this.data.rememberMe
    });
  },

  // 登录
  handleLogin() {
    const { loginUsername, loginPassword } = this.data;

    // 表单验证
    if (!loginUsername) {
      wx.showToast({
        title: '请输入用户名',
        icon: 'none'
      });
      return;
    }

    if (!loginPassword) {
      wx.showToast({
        title: '请输入密码',
        icon: 'none'
      });
      return;
    }

    this.setData({ isLoading: true });

    // 调用登录API（使用表单格式）
    wx.request({
      url: API.LOGIN,
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: `username=${encodeURIComponent(loginUsername)}&password=${encodeURIComponent(loginPassword)}`,
      success: (res) => {
        if (res.statusCode === 200 && res.data.access_token) {
          // 保存token
          wx.setStorageSync('access_token', res.data.access_token);
          
          // 获取用户信息
          this.getUserInfo(res.data.access_token);
        } else {
          wx.showToast({
            title: res.data.detail || '登录失败',
            icon: 'none'
          });
        }
      },
      fail: (err) => {
        console.error('登录失败:', err);
        wx.showModal({
          title: '登录失败',
          content: '无法连接到服务器，请检查：\n1. 后端服务是否启动\n2. API地址是否正确\n3. 网络连接是否正常',
          showCancel: false
        });
      },
      complete: () => {
        this.setData({ isLoading: false });
      }
    });
  },

  // 获取用户信息
  getUserInfo(token) {
    get(API.USER_INFO)
      .then((data) => {
        // 保存用户信息
        wx.setStorageSync('userInfo', data);
        
        wx.showToast({
          title: '登录成功',
          icon: 'success'
        });

        // 延迟跳转
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      })
      .catch((err) => {
        console.error('获取用户信息失败:', err);
      });
  },

  // 注册
  handleRegister() {
    const { 
      registerUsername, 
      registerEmail, 
      registerPassword, 
      registerPasswordConfirm,
      registerName 
    } = this.data;

    // 表单验证
    if (!registerUsername) {
      wx.showToast({
        title: '请输入用户名',
        icon: 'none'
      });
      return;
    }

    if (registerUsername.length < 3) {
      wx.showToast({
        title: '用户名至少3个字符',
        icon: 'none'
      });
      return;
    }

    if (!registerEmail) {
      wx.showToast({
        title: '请输入邮箱',
        icon: 'none'
      });
      return;
    }

    // 简单的邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerEmail)) {
      wx.showToast({
        title: '邮箱格式不正确',
        icon: 'none'
      });
      return;
    }

    if (!registerPassword) {
      wx.showToast({
        title: '请输入密码',
        icon: 'none'
      });
      return;
    }

    if (registerPassword.length < 6) {
      wx.showToast({
        title: '密码至少6个字符',
        icon: 'none'
      });
      return;
    }

    if (registerPassword !== registerPasswordConfirm) {
      wx.showToast({
        title: '两次密码不一致',
        icon: 'none'
      });
      return;
    }

    this.setData({ isLoading: true });

    // 调用注册API
    post(API.REGISTER, {
      username: registerUsername,
      email: registerEmail,
      password: registerPassword,
      name: registerName || registerUsername
    })
      .then((data) => {
        if (data.access_token) {
          // 保存token
          wx.setStorageSync('access_token', data.access_token);
          
          wx.showToast({
            title: '注册成功',
            icon: 'success'
          });

          // 获取用户信息
          this.getUserInfo(data.access_token);
        }
      })
      .catch((err) => {
        console.error('注册失败:', err);
        wx.showToast({
          title: err.detail || '注册失败',
          icon: 'none',
          duration: 2000
        });
      })
      .finally(() => {
        this.setData({ isLoading: false });
      });
  },

  // 忘记密码
  handleForgotPassword() {
    wx.showModal({
      title: '忘记密码',
      content: '请联系管理员重置密码\n\n或通过注册邮箱找回密码',
      showCancel: false
    });
  },

  // 跳过登录
  skipLogin() {
    wx.showModal({
      title: '提示',
      content: '跳过登录后，数据将仅保存在本地，无法同步到云端',
      confirmText: '继续',
      success: (res) => {
        if (res.confirm) {
          wx.navigateBack();
        }
      }
    });
  }
});
