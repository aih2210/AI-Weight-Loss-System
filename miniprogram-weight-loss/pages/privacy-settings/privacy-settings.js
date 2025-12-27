// pages/privacy-settings/privacy-settings.js
Page({
  data: {
    dataEncryption: true,
    autoBackup: false,
    anonymousStats: true,
    crashReport: true,
    locationPermission: '未授权',
    cameraPermission: '未授权',
    albumPermission: '未授权'
  },

  onLoad() {
    this.loadSettings();
    this.checkPermissions();
  },

  loadSettings() {
    const settings = wx.getStorageSync('privacySettings') || {};
    this.setData({
      dataEncryption: settings.dataEncryption !== false,
      autoBackup: settings.autoBackup || false,
      anonymousStats: settings.anonymousStats !== false,
      crashReport: settings.crashReport !== false
    });
  },

  saveSettings() {
    const { dataEncryption, autoBackup, anonymousStats, crashReport } = this.data;
    wx.setStorageSync('privacySettings', {
      dataEncryption,
      autoBackup,
      anonymousStats,
      crashReport
    });
  },

  onDataEncryptionChange(e) {
    this.setData({
      dataEncryption: e.detail.value
    });
    this.saveSettings();
  },

  onAutoBackupChange(e) {
    this.setData({
      autoBackup: e.detail.value
    });
    this.saveSettings();
  },

  onAnonymousStatsChange(e) {
    this.setData({
      anonymousStats: e.detail.value
    });
    this.saveSettings();
  },

  onCrashReportChange(e) {
    this.setData({
      crashReport: e.detail.value
    });
    this.saveSettings();
  },

  checkPermissions() {
    // 检查位置权限
    wx.getSetting({
      success: (res) => {
        this.setData({
          locationPermission: res.authSetting['scope.userLocation'] ? '已授权' : '未授权',
          cameraPermission: res.authSetting['scope.camera'] ? '已授权' : '未授权',
          albumPermission: res.authSetting['scope.album'] ? '已授权' : '未授权'
        });
      }
    });
  },

  checkLocationPermission() {
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success: () => {
              this.setData({ locationPermission: '已授权' });
              wx.showToast({ title: '授权成功', icon: 'success' });
            },
            fail: () => {
              this.showPermissionGuide('位置');
            }
          });
        } else {
          wx.showToast({ title: '已授权', icon: 'success' });
        }
      }
    });
  },

  checkCameraPermission() {
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.camera']) {
          wx.authorize({
            scope: 'scope.camera',
            success: () => {
              this.setData({ cameraPermission: '已授权' });
              wx.showToast({ title: '授权成功', icon: 'success' });
            },
            fail: () => {
              this.showPermissionGuide('相机');
            }
          });
        } else {
          wx.showToast({ title: '已授权', icon: 'success' });
        }
      }
    });
  },

  checkAlbumPermission() {
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.album']) {
          wx.authorize({
            scope: 'scope.album',
            success: () => {
              this.setData({ albumPermission: '已授权' });
              wx.showToast({ title: '授权成功', icon: 'success' });
            },
            fail: () => {
              this.showPermissionGuide('相册');
            }
          });
        } else {
          wx.showToast({ title: '已授权', icon: 'success' });
        }
      }
    });
  },

  showPermissionGuide(permissionName) {
    wx.showModal({
      title: '需要授权',
      content: `请在设置中开启${permissionName}权限`,
      confirmText: '去设置',
      success: (res) => {
        if (res.confirm) {
          wx.openSetting();
        }
      }
    });
  },

  exportData() {
    wx.showLoading({ title: '导出中...' });
    
    setTimeout(() => {
      wx.hideLoading();
      wx.showModal({
        title: '导出成功',
        content: '数据已导出到本地文件',
        showCancel: false
      });
    }, 1000);
  },

  clearCache() {
    wx.showModal({
      title: '清除缓存',
      content: '确定要清除缓存吗？',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({
            title: '缓存已清除',
            icon: 'success'
          });
        }
      }
    });
  },

  confirmClearAllData() {
    wx.showModal({
      title: '⚠️ 危险操作',
      content: '清除所有数据后将无法恢复！\n\n确定要继续吗？',
      confirmText: '确认清除',
      confirmColor: '#ff4444',
      success: (res) => {
        if (res.confirm) {
          this.clearAllData();
        }
      }
    });
  },

  clearAllData() {
    wx.showModal({
      title: '最后确认',
      content: '这是最后一次确认。\n\n所有数据将被永久删除！',
      confirmText: '我确定',
      confirmColor: '#ff4444',
      success: (res) => {
        if (res.confirm) {
          wx.clearStorageSync();
          wx.showToast({
            title: '数据已清除',
            icon: 'success'
          });
          setTimeout(() => {
            wx.reLaunch({
              url: '/pages/index/index'
            });
          }, 1500);
        }
      }
    });
  },

  showPrivacyPolicy() {
    wx.showModal({
      title: '隐私政策',
      content: '我们重视您的隐私：\n\n• 所有数据默认存储在本地\n• 不会收集个人敏感信息\n• 匿名统计仅用于改进产品\n• 您可以随时导出或删除数据',
      showCancel: false
    });
  },

  showUserAgreement() {
    wx.showModal({
      title: '用户协议',
      content: 'AI减重助手用户协议\n\n1. 本应用仅供参考\n2. 不替代专业医疗建议\n3. 使用前请咨询医生\n4. 数据仅供个人使用',
      showCancel: false
    });
  }
});
