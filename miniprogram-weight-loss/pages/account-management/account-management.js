// pages/account-management/account-management.js
Page({
  data: {
    isLoggedIn: false,
    username: '',
    email: '',
    registerDate: '',
    lastSyncTime: '从未同步'
  },

  onLoad() {
    this.checkLoginStatus();
  },

  onShow() {
    this.checkLoginStatus();
  },

  checkLoginStatus() {
    // 检查是否有登录token
    const token = wx.getStorageSync('access_token');
    const userInfo = wx.getStorageSync('userInfo');
    
    if (token && userInfo) {
      this.setData({
        isLoggedIn: true,
        username: userInfo.username || '未设置',
        email: userInfo.email || '未设置',
        registerDate: userInfo.registerDate || '未知',
        lastSyncTime: wx.getStorageSync('lastSyncTime') || '从未同步'
      });
    } else {
      this.setData({
        isLoggedIn: false
      });
    }
  },

  goToLogin() {
    wx.navigateTo({
      url: '/pages/login/login?tab=login'
    });
  },

  goToRegister() {
    wx.navigateTo({
      url: '/pages/login/login?tab=register'
    });
  },

  showChangePassword() {
    wx.showModal({
      title: '修改密码',
      content: '此功能需要验证当前密码',
      showCancel: true,
      confirmText: '继续',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({
            title: '功能开发中',
            icon: 'none'
          });
        }
      }
    });
  },

  showChangeEmail() {
    wx.showModal({
      title: '修改邮箱',
      content: '修改邮箱需要验证新邮箱',
      showCancel: true,
      confirmText: '继续',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({
            title: '功能开发中',
            icon: 'none'
          });
        }
      }
    });
  },

  syncData() {
    wx.showLoading({
      title: '同步中...'
    });

    // 模拟同步
    setTimeout(() => {
      wx.hideLoading();
      
      const now = new Date();
      const timeStr = `${now.getMonth() + 1}月${now.getDate()}日 ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
      wx.setStorageSync('lastSyncTime', timeStr);
      
      this.setData({
        lastSyncTime: timeStr
      });

      wx.showToast({
        title: '同步成功',
        icon: 'success'
      });
    }, 1500);
  },

  showAccountSecurity() {
    wx.showModal({
      title: '账号安全',
      content: '账号安全功能包括：\n\n• 登录设备管理\n• 登录历史查看\n• 异常登录提醒\n• 两步验证设置',
      showCancel: false
    });
  },

  confirmLogout() {
    wx.showModal({
      title: '确认退出',
      content: '退出登录后，本地数据仍会保留，但无法同步到云端',
      confirmText: '退出',
      confirmColor: '#ff4444',
      success: (res) => {
        if (res.confirm) {
          this.logout();
        }
      }
    });
  },

  logout() {
    wx.removeStorageSync('access_token');
    wx.removeStorageSync('userInfo');
    
    wx.showToast({
      title: '已退出登录',
      icon: 'success'
    });

    this.checkLoginStatus();
  },

  confirmDeleteAccount() {
    wx.showModal({
      title: '⚠️ 危险操作',
      content: '注销账号将：\n\n• 永久删除所有云端数据\n• 无法恢复\n• 需要重新注册\n\n确定要继续吗？',
      confirmText: '确认注销',
      confirmColor: '#ff4444',
      success: (res) => {
        if (res.confirm) {
          this.deleteAccount();
        }
      }
    });
  },

  deleteAccount() {
    wx.showModal({
      title: '最后确认',
      content: '这是最后一次确认。\n\n注销后数据将永久删除，无法恢复！',
      confirmText: '我确定',
      confirmColor: '#ff4444',
      success: (res) => {
        if (res.confirm) {
          // 这里应该调用API删除账号
          wx.showToast({
            title: '功能开发中',
            icon: 'none'
          });
        }
      }
    });
  }
});
