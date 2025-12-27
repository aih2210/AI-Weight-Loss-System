// pages/data-management/data-management.js
const app = getApp();

Page({
  data: {
    foodCount: 0,
    exerciseCount: 0,
    emotionCount: 0,
    weightCount: 0,
    totalCount: 0,
    storageSize: '0KB',
    lastBackupTime: '从未备份',
    hasBackup: false
  },

  onLoad() {
    this.loadData();
    this.checkBackup();
  },

  onShow() {
    this.loadData();
    this.checkBackup();
  },

  loadData() {
    const data = app.getData();
    const foodCount = data.foodLogs.length;
    const exerciseCount = data.exerciseLogs.length;
    const emotionCount = data.emotionLogs.length;
    const weightCount = data.weightHistory.length;
    const totalCount = foodCount + exerciseCount + emotionCount + weightCount;

    // 计算存储大小
    const storageInfo = wx.getStorageInfoSync();
    const sizeKB = (storageInfo.currentSize || 0);
    const storageSize = sizeKB < 1024 ? `${sizeKB}KB` : `${(sizeKB / 1024).toFixed(2)}MB`;

    this.setData({
      foodCount,
      exerciseCount,
      emotionCount,
      weightCount,
      totalCount,
      storageSize
    });
  },

  checkBackup() {
    const backupData = wx.getStorageSync('dataBackup');
    const lastBackupTime = wx.getStorageSync('lastBackupTime');
    
    this.setData({
      hasBackup: !!backupData,
      lastBackupTime: lastBackupTime || '从未备份'
    });
  },

  // 导出数据
  exportData() {
    wx.showLoading({ title: '准备导出...' });

    try {
      const data = app.getData();
      const exportData = {
        version: '1.0',
        exportTime: new Date().toISOString(),
        data: data
      };

      // 转换为JSON字符串
      const jsonStr = JSON.stringify(exportData, null, 2);
      
      wx.hideLoading();

      // 显示数据预览
      wx.showModal({
        title: '数据导出',
        content: `数据已准备完成！\n\n包含：\n• 饮食记录 ${this.data.foodCount} 条\n• 运动记录 ${this.data.exerciseCount} 条\n• 情绪记录 ${this.data.emotionCount} 条\n• 体重记录 ${this.data.weightCount} 条\n\n数据大小：${(jsonStr.length / 1024).toFixed(2)}KB`,
        confirmText: '复制数据',
        success: (res) => {
          if (res.confirm) {
            wx.setClipboardData({
              data: jsonStr,
              success: () => {
                wx.showToast({
                  title: '已复制到剪贴板',
                  icon: 'success'
                });
                
                // 显示保存提示
                setTimeout(() => {
                  wx.showModal({
                    title: '保存提示',
                    content: '数据已复制到剪贴板！\n\n请：\n1. 打开备忘录或文本编辑器\n2. 粘贴数据\n3. 保存为文件\n\n文件名建议：\nweight-loss-data-' + new Date().toISOString().split('T')[0] + '.json',
                    showCancel: false
                  });
                }, 1500);
              }
            });
          }
        }
      });
    } catch (error) {
      wx.hideLoading();
      wx.showToast({
        title: '导出失败',
        icon: 'none'
      });
      console.error('导出数据失败:', error);
    }
  },

  // 导入数据
  importData() {
    wx.showModal({
      title: '导入数据',
      content: '请确保已复制有效的JSON数据到剪贴板',
      confirmText: '开始导入',
      success: (res) => {
        if (res.confirm) {
          wx.getClipboardData({
            success: (clipRes) => {
              try {
                const importData = JSON.parse(clipRes.data);
                
                // 验证数据格式
                if (!importData.data || !importData.version) {
                  throw new Error('数据格式不正确');
                }

                // 显示确认对话框
                wx.showModal({
                  title: '确认导入',
                  content: `即将导入数据：\n\n导出时间：${new Date(importData.exportTime).toLocaleString()}\n版本：${importData.version}\n\n⚠️ 当前数据将被覆盖！`,
                  confirmText: '确认导入',
                  confirmColor: '#ff4444',
                  success: (confirmRes) => {
                    if (confirmRes.confirm) {
                      this.performImport(importData.data);
                    }
                  }
                });
              } catch (error) {
                wx.showModal({
                  title: '导入失败',
                  content: '剪贴板中的数据格式不正确\n\n请确保：\n1. 已复制完整的JSON数据\n2. 数据来自本应用的导出功能',
                  showCancel: false
                });
              }
            },
            fail: () => {
              wx.showToast({
                title: '读取剪贴板失败',
                icon: 'none'
              });
            }
          });
        }
      }
    });
  },

  performImport(data) {
    wx.showLoading({ title: '导入中...' });

    try {
      // 保存数据
      app.saveData(data);
      
      wx.hideLoading();
      wx.showToast({
        title: '导入成功',
        icon: 'success'
      });

      // 刷新页面
      setTimeout(() => {
        this.loadData();
        wx.showModal({
          title: '导入完成',
          content: '数据已成功导入！\n\n建议重启小程序以确保数据正确加载。',
          confirmText: '重启',
          success: (res) => {
            if (res.confirm) {
              wx.reLaunch({
                url: '/pages/index/index'
              });
            }
          }
        });
      }, 1500);
    } catch (error) {
      wx.hideLoading();
      wx.showToast({
        title: '导入失败',
        icon: 'none'
      });
      console.error('导入数据失败:', error);
    }
  },

  // 备份数据
  backupData() {
    wx.showLoading({ title: '备份中...' });

    try {
      const data = app.getData();
      const backupTime = new Date().toLocaleString();
      
      // 保存备份
      wx.setStorageSync('dataBackup', data);
      wx.setStorageSync('lastBackupTime', backupTime);
      
      wx.hideLoading();
      wx.showToast({
        title: '备份成功',
        icon: 'success'
      });

      this.checkBackup();
    } catch (error) {
      wx.hideLoading();
      wx.showToast({
        title: '备份失败',
        icon: 'none'
      });
      console.error('备份失败:', error);
    }
  },

  // 恢复数据
  restoreData() {
    const backupData = wx.getStorageSync('dataBackup');
    
    if (!backupData) {
      wx.showToast({
        title: '没有备份数据',
        icon: 'none'
      });
      return;
    }

    wx.showModal({
      title: '确认恢复',
      content: `确定要恢复到备份时的数据吗？\n\n备份时间：${this.data.lastBackupTime}\n\n⚠️ 当前数据将被覆盖！`,
      confirmText: '确认恢复',
      confirmColor: '#ff4444',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '恢复中...' });

          try {
            app.saveData(backupData);
            
            wx.hideLoading();
            wx.showToast({
              title: '恢复成功',
              icon: 'success'
            });

            setTimeout(() => {
              wx.reLaunch({
                url: '/pages/index/index'
              });
            }, 1500);
          } catch (error) {
            wx.hideLoading();
            wx.showToast({
              title: '恢复失败',
              icon: 'none'
            });
            console.error('恢复失败:', error);
          }
        }
      }
    });
  },

  // 删除备份
  deleteBackup() {
    wx.showModal({
      title: '确认删除',
      content: '确定要删除备份数据吗？',
      confirmText: '删除',
      confirmColor: '#ff4444',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('dataBackup');
          wx.removeStorageSync('lastBackupTime');
          
          wx.showToast({
            title: '备份已删除',
            icon: 'success'
          });

          this.checkBackup();
        }
      }
    });
  },

  // 查看数据详情
  viewDataDetails() {
    const data = app.getData();
    
    wx.showModal({
      title: '数据详情',
      content: `用户信息：\n姓名：${data.user.name}\n年龄：${data.user.age}岁\n身高：${data.user.height}cm\n当前体重：${data.user.currentWeight}kg\n目标体重：${data.user.targetWeight}kg\n\n记录统计：\n饮食：${this.data.foodCount}条\n运动：${this.data.exerciseCount}条\n情绪：${this.data.emotionCount}条\n体重：${this.data.weightCount}条\n\n存储大小：${this.data.storageSize}`,
      showCancel: false
    });
  },

  // 清除所有数据
  clearData() {
    wx.showModal({
      title: '⚠️ 危险操作',
      content: '确定要清除所有数据吗？\n\n此操作将：\n• 删除所有记录\n• 删除所有设置\n• 恢复到初始状态\n\n⚠️ 此操作不可恢复！',
      confirmText: '确认清除',
      confirmColor: '#ff4444',
      success: (res) => {
        if (res.confirm) {
          // 二次确认
          wx.showModal({
            title: '最后确认',
            content: '这是最后一次确认！\n\n数据将被永久删除，无法恢复！',
            confirmText: '我确定',
            confirmColor: '#ff4444',
            success: (confirmRes) => {
              if (confirmRes.confirm) {
                this.performClear();
              }
            }
          });
        }
      }
    });
  },

  performClear() {
    wx.showLoading({ title: '清除中...' });

    try {
      wx.clearStorageSync();
      app.initData();
      
      wx.hideLoading();
      wx.showToast({
        title: '数据已清除',
        icon: 'success'
      });

      setTimeout(() => {
        wx.reLaunch({
          url: '/pages/index/index'
        });
      }, 1500);
    } catch (error) {
      wx.hideLoading();
      wx.showToast({
        title: '清除失败',
        icon: 'none'
      });
      console.error('清除失败:', error);
    }
  }
});
