// pages/index/index.js
const app = getApp();
const EmotionalAI = require('../../utils/emotionalAI.js');

Page({
  data: {
    userData: {},
    todayCalories: 0,
    todayExercise: 0,
    netCalories: 0,
    streak: 0,
    progress: 0,
    weightLost: 0,
    healthCoins: 0,
    // 健康数据
    steps: 0,
    heartRate: 0,
    sleep: 0,
    healthScore: 0,
    // 活动能量统计
    weeklyCalories: [],
    avgCalories: 0,
    // AI情感感知
    emotionalAI: null,
    emotionalState: {
      emoji: '😊',
      message: '欢迎回来！',
      encouragement: '我在这里陪伴你',
      suggestions: []
    }
  },

  onLoad() {
    this.data.emotionalAI = new EmotionalAI();
    this.loadData();
    this.loadEmotionalState();
  },

  onShow() {
    this.loadData();
    this.loadEmotionalState();
  },

  loadData() {
    const userData = app.getData();
    const todayCalories = app.getTodayCalories();
    const todayExercise = app.getTodayExerciseCalories();
    const netCalories = todayCalories - todayExercise;
    const streak = app.getStreak();
    const healthCoins = userData.healthCoins || 0;
    
    const weightLost = userData.user.startWeight - userData.user.currentWeight;
    const totalToLose = userData.user.startWeight - userData.user.targetWeight;
    const progress = Math.round((weightLost / totalToLose) * 100);

    // 加载健康数据
    const healthData = userData.healthData || {};
    const steps = healthData.todaySteps || 0;
    const heartRate = healthData.heartRate || 0;
    const sleep = healthData.sleep || 0;
    
    // 计算健康评分
    const healthScore = this.calculateHealthScore(steps, heartRate, sleep, todayCalories, todayExercise);
    
    // 加载活动能量数据
    const caloriesStats = this.loadCaloriesData(userData);

    this.setData({
      userData,
      todayCalories,
      todayExercise,
      netCalories,
      streak,
      progress,
      weightLost: weightLost.toFixed(1),
      healthCoins,
      steps,
      heartRate,
      sleep,
      healthScore,
      weeklyCalories: caloriesStats.weeklyCalories,
      avgCalories: caloriesStats.avgCalories
    });
  },

  // 加载活动能量数据（使用真实运动数据）
  loadCaloriesData(userData) {
    const exerciseLogs = userData.exerciseLogs || [];
    const today = new Date();
    const weeklyCalories = [];
    const weekDays = ['六', '日', '一', '二', '三', '四', '五'];
    
    // 生成最近7天的数据
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = this.formatDate(date);
      
      // 查找当天的运动记录
      const dayLogs = exerciseLogs.filter(log => {
        const logDate = new Date(log.timestamp);
        return this.formatDate(logDate) === dateStr;
      });
      
      const calories = dayLogs.reduce((sum, log) => sum + (log.calories || 0), 0);
      
      weeklyCalories.push({
        day: weekDays[(date.getDay() + 6) % 7],
        calories: calories || 0,
        isToday: i === 0
      });
    }
    
    // 如果所有数据都是0，使用模拟数据
    const hasRealData = weeklyCalories.some(item => item.calories > 0);
    if (!hasRealData) {
      // 使用模拟数据
      const mockData = [142, 0, 180, 220, 120, 160, 350];
      weeklyCalories.forEach((item, index) => {
        item.calories = mockData[index];
      });
    }
    
    // 计算平均消耗
    const totalCalories = weeklyCalories.reduce((sum, item) => sum + item.calories, 0);
    const avgCalories = Math.floor(totalCalories / 7);
    
    return {
      weeklyCalories,
      avgCalories
    };
  },

  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  calculateHealthScore(steps, heartRate, sleep, calories, exercise) {
    let score = 0;
    
    // 步数评分 (30分)
    if (steps >= 10000) score += 30;
    else if (steps >= 6000) score += 20;
    else if (steps >= 3000) score += 10;
    
    // 心率评分 (20分)
    if (heartRate >= 60 && heartRate <= 100) score += 20;
    else if (heartRate > 0) score += 10;
    
    // 睡眠评分 (20分)
    if (sleep >= 7 && sleep <= 9) score += 20;
    else if (sleep >= 6) score += 10;
    
    // 饮食评分 (15分)
    if (calories > 0 && calories <= 1800) score += 15;
    else if (calories > 0) score += 5;
    
    // 运动评分 (15分)
    if (exercise >= 300) score += 15;
    else if (exercise >= 150) score += 10;
    else if (exercise > 0) score += 5;
    
    return score;
  },

  // 加载AI情感状态
  loadEmotionalState() {
    try {
      const state = this.data.emotionalAI.analyzeUserState();
      this.setData({
        emotionalState: state
      });
    } catch (error) {
      console.error('加载情感状态失败:', error);
      // 使用默认状态
      this.setData({
        emotionalState: {
          emoji: '😊',
          message: '欢迎回来！让我们一起开始今天的健康之旅',
          encouragement: '我在这里陪伴你',
          suggestions: []
        }
      });
    }
  },

  goToWeightUpdate() {
    wx.navigateTo({
      url: '/pages/weight-update/weight-update'
    });
  },

  goToEmotionLog() {
    wx.navigateTo({
      url: '/pages/emotion-log/emotion-log'
    });
  },

  goToHealthAnalysis() {
    wx.navigateTo({
      url: '/pages/health-analysis/health-analysis'
    });
  },

  goToMetabolismAnalysis() {
    wx.navigateTo({
      url: '/pages/metabolism-analysis/metabolism-analysis'
    });
  },

  goToDiningAssistant() {
    wx.navigateTo({
      url: '/pages/dining-assistant/dining-assistant'
    });
  },

  syncHealthData() {
    wx.navigateTo({
      url: '/pages/health-analysis/health-analysis'
    });
  },

  onPullDownRefresh() {
    this.loadData();
    wx.stopPullDownRefresh();
  },

  // 跳转到健康币页面
  goToHealthCoin() {
    wx.navigateTo({
      url: '/pages/health-coin/health-coin'
    });
  },

  // 跳转到体重更新
  goToWeightUpdate() {
    wx.navigateTo({
      url: '/pages/weight-update/weight-update'
    });
  },

  // 跳转到健康分析
  goToHealthAnalysis() {
    wx.navigateTo({
      url: '/pages/health-analysis/health-analysis'
    });
  },

  // 跳转到代谢率分析
  goToMetabolismAnalysis() {
    wx.navigateTo({
      url: '/pages/metabolism-analysis/metabolism-analysis'
    });
  },

  // 跳转到情绪记录
  goToEmotionLog() {
    wx.navigateTo({
      url: '/pages/emotion-log/emotion-log'
    });
  },

  // 跳转到聚餐助手
  goToDiningAssistant() {
    wx.navigateTo({
      url: '/pages/dining-assistant/dining-assistant'
    });
  }
});
