// pages/health-history/health-history.js
const app = getApp();

Page({
  data: {
    currentTab: 0,
    tabs: ['步数', '心率', '睡眠', '体重'],
    stepsHistory: [],
    heartRateHistory: [],
    sleepHistory: [],
    weightHistory: [],
    dateRange: 7 // 默认显示7天
  },

  onLoad() {
    this.loadHistoryData();
  },

  loadHistoryData() {
    const userData = app.getData();
    
    // 生成模拟历史数据
    this.setData({
      stepsHistory: this.generateStepsHistory(),
      heartRateHistory: this.generateHeartRateHistory(),
      sleepHistory: this.generateSleepHistory(),
      weightHistory: userData.weightHistory || []
    });
  },

  generateStepsHistory() {
    const history = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = this.formatDate(date);
      const steps = Math.floor(Math.random() * 5000) + 5000; // 5000-10000
      const target = 10000;
      const progress = Math.round((steps / target) * 100);
      
      history.push({
        date: dateStr,
        value: steps,
        target: target,
        progress: progress,
        status: steps >= target ? 'success' : steps >= 6000 ? 'warning' : 'danger'
      });
    }
    
    return history;
  },

  generateHeartRateHistory() {
    const history = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = this.formatDate(date);
      const heartRate = Math.floor(Math.random() * 20) + 70; // 70-90
      
      history.push({
        date: dateStr,
        value: heartRate,
        unit: 'bpm',
        status: heartRate >= 60 && heartRate <= 100 ? 'success' : 'warning'
      });
    }
    
    return history;
  },

  generateSleepHistory() {
    const history = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = this.formatDate(date);
      const sleep = (Math.random() * 3 + 5).toFixed(1); // 5-8小时
      const quality = sleep >= 7 ? '优' : sleep >= 6 ? '良' : '差';
      
      history.push({
        date: dateStr,
        value: sleep,
        unit: '小时',
        quality: quality,
        status: sleep >= 7 ? 'success' : sleep >= 6 ? 'warning' : 'danger'
      });
    }
    
    return history;
  },

  formatDate(date) {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekDay = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()];
    return `${month}/${day} 周${weekDay}`;
  },

  switchTab(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      currentTab: index
    });
  },

  changeDateRange(e) {
    const range = e.currentTarget.dataset.range;
    this.setData({
      dateRange: range
    });
    
    // 重新加载数据
    this.loadHistoryData();
  },

  exportData() {
    wx.showModal({
      title: '导出数据',
      content: '健康数据将导出为CSV文件\n\n功能开发中，敬请期待...',
      showCancel: false
    });
  },

  shareData() {
    wx.showModal({
      title: '分享数据',
      content: '将健康数据分享给医生或好友\n\n功能开发中，敬请期待...',
      showCancel: false
    });
  }
});
