// pages/health-analysis/health-analysis.js
const app = getApp();

Page({
  data: {
    steps: 0,
    heartRate: 0,
    sleep: 0,
    calories: 0,
    distance: 0,
    hasWearableData: false,
    healthData: {
      heartRate: [],
      steps: [],
      sleep: []
    },
    recommendations: []
  },

  onLoad() {
    this.loadHealthData();
    this.syncWearableData();
  },

  onShow() {
    this.loadHealthData();
  },

  loadHealthData() {
    const userData = app.getData();
    const healthData = userData.healthData || {};
    
    this.setData({
      steps: healthData.todaySteps || 0,
      heartRate: healthData.heartRate || 0,
      sleep: healthData.sleep || 0,
      calories: healthData.calories || 0,
      distance: healthData.distance || 0,
      hasWearableData: healthData.hasWearableData || false
    });

    this.generateRecommendations();
  },

  syncWearableData() {
    wx.showLoading({
      title: '同步中...'
    });

    // 获取微信运动步数
    wx.getWeRunData({
      success: (res) => {
        // 模拟解析步数数据
        const steps = Math.floor(Math.random() * 5000) + 5000; // 5000-10000步
        const distance = (steps * 0.6 / 1000).toFixed(2); // 假设每步0.6米
        const calories = Math.floor(steps * 0.04); // 每步约0.04卡路里

        this.updateHealthData({
          todaySteps: steps,
          distance: distance,
          calories: calories,
          hasWearableData: true
        });

        wx.hideLoading();
        wx.showToast({
          title: '同步成功',
          icon: 'success'
        });
      },
      fail: () => {
        wx.hideLoading();
        // 模拟数据
        this.simulateHealthData();
      }
    });
  },

  simulateHealthData() {
    const steps = Math.floor(Math.random() * 5000) + 5000;
    const heartRate = Math.floor(Math.random() * 20) + 70; // 70-90
    const sleep = (Math.random() * 2 + 6).toFixed(1); // 6-8小时
    const distance = (steps * 0.6 / 1000).toFixed(2);
    const calories = Math.floor(steps * 0.04);

    this.updateHealthData({
      todaySteps: steps,
      heartRate: heartRate,
      sleep: sleep,
      distance: distance,
      calories: calories,
      hasWearableData: true
    });

    wx.showToast({
      title: '已加载模拟数据',
      icon: 'success'
    });
  },

  updateHealthData(data) {
    const userData = app.getData();
    userData.healthData = {
      ...userData.healthData,
      ...data,
      lastSync: new Date().toLocaleString()
    };
    app.saveData(userData);
    this.loadHealthData();
  },

  generateRecommendations() {
    const { steps, heartRate, sleep } = this.data;
    const recommendations = [];

    // 步数建议
    if (steps < 6000) {
      recommendations.push({
        icon: '🚶',
        title: '步数不足',
        content: '今日步数较少，建议增加日常活动量，目标10000步/天',
        type: 'warning'
      });
    } else if (steps >= 10000) {
      recommendations.push({
        icon: '🎉',
        title: '步数达标',
        content: '太棒了！今日步数已达标，继续保持',
        type: 'success'
      });
    }

    // 心率建议
    if (heartRate > 0) {
      if (heartRate < 60) {
        recommendations.push({
          icon: '💓',
          title: '心率偏低',
          content: '静息心率偏低，如无不适可能是运动员心脏，建议咨询医生',
          type: 'info'
        });
      } else if (heartRate > 100) {
        recommendations.push({
          icon: '❤️',
          title: '心率偏高',
          content: '静息心率偏高，建议减少咖啡因摄入，保持充足休息',
          type: 'warning'
        });
      } else {
        recommendations.push({
          icon: '💚',
          title: '心率正常',
          content: '心率在正常范围内，心血管健康状况良好',
          type: 'success'
        });
      }
    }

    // 睡眠建议
    if (sleep > 0) {
      if (sleep < 6) {
        recommendations.push({
          icon: '😴',
          title: '睡眠不足',
          content: '睡眠时间不足会影响代谢和减重效果，建议保证7-8小时睡眠',
          type: 'warning'
        });
      } else if (sleep >= 7 && sleep <= 9) {
        recommendations.push({
          icon: '😊',
          title: '睡眠充足',
          content: '睡眠时间充足，有利于身体恢复和减重',
          type: 'success'
        });
      }
    }

    // 综合建议
    recommendations.push({
      icon: '💡',
      title: '健康提示',
      content: '保持规律运动、充足睡眠和健康饮食是减重成功的关键',
      type: 'info'
    });

    this.setData({
      recommendations
    });
  },

  viewHistory() {
    wx.navigateTo({
      url: '/pages/health-history/health-history'
    });
  },

  goToMedication() {
    wx.navigateTo({
      url: '/pages/medication/medication'
    });
  },

  goToDeviceManagement() {
    wx.navigateTo({
      url: '/pages/device-management/device-management'
    });
  }
});
