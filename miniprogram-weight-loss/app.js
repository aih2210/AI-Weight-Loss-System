// app.js
App({
  onLaunch() {
    // 初始化数据
    this.initData();
    
    // 检查更新
    this.checkUpdate();
  },
  
  // 初始化数据
  initData() {
    const userData = wx.getStorageSync('userData');
    if (!userData) {
      const defaultData = {
        user: {
          name: '用户',
          age: 30,
          gender: 'male',
          height: 170,
          currentWeight: 56,
          targetWeight: 50,
          startWeight: 60,
          startDate: this.formatDate(new Date()),
          avatar: '👤' // 默认头像
        },
        weightHistory: [
          { weight: 60, date: this.getDaysAgo(21), timestamp: Date.now() - 21*24*60*60*1000 },
          { weight: 58, date: this.getDaysAgo(14), timestamp: Date.now() - 14*24*60*60*1000 },
          { weight: 57, date: this.getDaysAgo(7), timestamp: Date.now() - 7*24*60*60*1000 },
          { weight: 56, date: this.getDaysAgo(0), timestamp: Date.now() }
        ],
        foodLogs: [],
        exerciseLogs: [],
        emotionLogs: [],
        recipes: [],
        settings: {
          dailyCalorieTarget: 1500,
          dailyExerciseTarget: 300,
          reminderEnabled: true
        }
      };
      wx.setStorageSync('userData', defaultData);
    } else {
      // 确保旧数据也有avatar字段
      if (!userData.user.avatar) {
        userData.user.avatar = '👤';
        wx.setStorageSync('userData', userData);
      }
    }
  },
  
  // 获取数据
  getData() {
    return wx.getStorageSync('userData') || {};
  },
  
  // 保存数据
  saveData(data) {
    wx.setStorageSync('userData', data);
  },
  
  // 添加体重记录
  addWeightRecord(weight, date) {
    const data = this.getData();
    data.weightHistory.push({ 
      weight, 
      date: date || this.formatDate(new Date()), 
      timestamp: Date.now() 
    });
    data.user.currentWeight = weight;
    this.saveData(data);
  },
  
  // 添加饮食记录
  addFoodLog(food) {
    const data = this.getData();
    data.foodLogs.push({
      ...food,
      id: Date.now(),
      date: this.formatDate(new Date()),
      timestamp: Date.now()
    });
    this.saveData(data);
  },
  
  // 添加运动记录
  addExerciseLog(exercise) {
    const data = this.getData();
    data.exerciseLogs.push({
      ...exercise,
      id: Date.now(),
      date: this.formatDate(new Date()),
      timestamp: Date.now()
    });
    this.saveData(data);
  },
  
  // 添加情绪记录
  addEmotionLog(emotion) {
    const data = this.getData();
    data.emotionLogs.push({
      ...emotion,
      id: Date.now(),
      date: this.formatDate(new Date()),
      timestamp: Date.now()
    });
    this.saveData(data);
  },
  
  // 获取今日饮食记录
  getTodayFoodLogs() {
    const data = this.getData();
    const today = this.formatDate(new Date());
    return data.foodLogs.filter(log => log.date === today);
  },
  
  // 获取今日运动记录
  getTodayExerciseLogs() {
    const data = this.getData();
    const today = this.formatDate(new Date());
    return data.exerciseLogs.filter(log => log.date === today);
  },
  
  // 获取今日卡路里
  getTodayCalories() {
    const logs = this.getTodayFoodLogs();
    return logs.reduce((sum, log) => sum + (log.calories || 0), 0);
  },
  
  // 获取今日运动消耗
  getTodayExerciseCalories() {
    const logs = this.getTodayExerciseLogs();
    return logs.reduce((sum, log) => sum + (log.calories || 0), 0);
  },
  
  // 获取连续打卡天数
  getStreak() {
    const data = this.getData();
    const logs = [...data.foodLogs, ...data.exerciseLogs].sort((a, b) => b.timestamp - a.timestamp);
    
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 30; i++) {
      const dateStr = this.formatDate(currentDate);
      const hasLog = logs.some(log => log.date === dateStr);
      
      if (hasLog) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  },
  
  // 工具函数：格式化日期
  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },
  
  // 工具函数：获取N天前的日期
  getDaysAgo(days) {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return this.formatDate(date);
  },
  
  // 检查小程序更新
  checkUpdate() {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate(res => {
        if (res.hasUpdate) {
          updateManager.onUpdateReady(() => {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: res => {
                if (res.confirm) {
                  updateManager.applyUpdate();
                }
              }
            });
          });
        }
      });
    }
  },
  
  globalData: {
    userInfo: null
  }
});
