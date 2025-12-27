// pages/metabolism-analysis/metabolism-analysis.js
const app = getApp();
const metabolismPredictor = require('../../utils/metabolismPredictor.js');

Page({
  data: {
    loading: true,
    report: null,
    showDetail: false,
    chartData: null
  },

  onLoad() {
    this.analyzeMetabolism();
  },

  onShow() {
    this.analyzeMetabolism();
  },

  analyzeMetabolism() {
    wx.showLoading({ title: '分析中...' });
    
    // 强制重新读取最新数据
    const userData = app.getData();
    
    console.log('=== 代谢分析调试信息 ===');
    console.log('当前体重:', userData.user.currentWeight);
    console.log('体重历史记录数:', userData.weightHistory.length);
    if (userData.weightHistory.length > 0) {
      const latest = userData.weightHistory[userData.weightHistory.length - 1];
      console.log('最新体重记录:', latest.weight, latest.date);
    }
    
    const historyData = this.prepareHistoryData(userData);

    // 确保使用最新的体重数据
    const latestUserData = this.getLatestUserData(userData, historyData);
    
    console.log('分析使用的体重:', latestUserData.currentWeight);
    console.log('历史数据天数:', historyData.length);

    try {
      const report = metabolismPredictor.generateReport(latestUserData, historyData);
      
      // 格式化百分比显示
      report.metabolism.changeRatePercent = (report.metabolism.changeRate * 100).toFixed(1);
      report.plateau.confidencePercent = (report.plateau.confidence * 100).toFixed(0);
      report.metabolism.confidencePercent = (report.metabolism.confidence * 100).toFixed(0);
      
      // 格式化体重趋势预测中的百分比
      if (report.weightTrend && report.weightTrend.predictions) {
        report.weightTrend.predictions.forEach(pred => {
          pred.confidencePercent = (pred.confidence * 100).toFixed(0);
        });
      }
      
      // 计算实际TDEE（基于真实数据）
      const actualTDEE = metabolismPredictor.calculateActualTDEE(historyData);
      if (actualTDEE) {
        report.metabolism.actualTDEE = actualTDEE.tdee;
        report.metabolism.actualTDEEConfidence = (actualTDEE.confidence * 100).toFixed(0);
        report.metabolism.hasActualTDEE = true;
        
        // 比较理论TDEE和实际TDEE
        const difference = actualTDEE.tdee - report.metabolism.currentTDEE;
        report.metabolism.tdeeDifference = Math.round(difference);
        report.metabolism.tdeeDifferencePercent = ((difference / report.metabolism.currentTDEE) * 100).toFixed(1);
      } else {
        report.metabolism.hasActualTDEE = false;
      }
      
      // 格式化时间戳
      const date = new Date(report.timestamp);
      report.formattedTime = `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
      
      this.setData({
        report,
        loading: false,
        chartData: this.prepareChartData(historyData)
      });

      wx.hideLoading();
    } catch (error) {
      console.error('代谢分析失败:', error);
      wx.hideLoading();
      wx.showToast({
        title: '分析失败',
        icon: 'none'
      });
    }
  },

  /**
   * 获取最新的用户数据（包含最新体重）
   */
  getLatestUserData(userData, historyData) {
    const user = { ...userData.user };
    
    console.log('=== getLatestUserData 调试 ===');
    console.log('原始user.currentWeight:', user.currentWeight);
    
    // 优先从体重历史记录中获取最新体重（最准确）
    const weightHistory = userData.weightHistory || [];
    if (weightHistory.length > 0) {
      // 按日期排序，获取最新的记录
      const sortedHistory = [...weightHistory].sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      const latestRecord = sortedHistory[0];
      console.log('体重历史记录最新:', latestRecord.weight, latestRecord.date);
      user.currentWeight = latestRecord.weight;
      user.weight = latestRecord.weight;
    }
    
    // 如果历史记录为空，从历史数据中获取
    if (!user.currentWeight && historyData && historyData.length > 0) {
      const latestWeight = historyData[historyData.length - 1].weight;
      console.log('历史数据最新体重:', latestWeight);
      user.currentWeight = latestWeight;
      user.weight = latestWeight;
    }
    
    console.log('最终使用的体重:', user.currentWeight);
    
    // 确保所有必需字段都存在
    user.height = user.height || 170;
    user.age = user.age || 25;
    user.gender = user.gender || 'female';
    user.targetWeight = user.targetWeight || user.currentWeight - 5;
    user.startWeight = user.startWeight || user.currentWeight;
    
    return user;
  },

  prepareHistoryData(userData) {
    const history = [];
    const today = new Date();
    
    // 收集体重记录（使用weightHistory）
    const weightHistory = userData.weightHistory || [];
    
    // 收集饮食记录（使用foodLogs）
    const foodLogs = userData.foodLogs || [];
    
    // 收集运动记录（使用exerciseLogs）
    const exerciseLogs = userData.exerciseLogs || [];
    
    // 合并数据（最近30天）
    let lastKnownWeight = userData.user.currentWeight || userData.user.weight || 60;
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = this.formatDate(date);
      
      // 查找当天数据
      const weightRecord = weightHistory.find(r => r.date === dateStr);
      const dayFoodLogs = foodLogs.filter(r => r.date === dateStr);
      const dayExerciseLogs = exerciseLogs.filter(r => r.date === dateStr);
      
      // 计算当天总热量
      const calories = dayFoodLogs.reduce((sum, r) => sum + (r.calories || 0), 0);
      const exerciseCalories = dayExerciseLogs.reduce((sum, r) => sum + (r.calories || 0), 0);
      
      // 使用实际体重记录，如果没有则使用上一次的体重
      let weight = lastKnownWeight;
      if (weightRecord && weightRecord.weight) {
        weight = weightRecord.weight;
        lastKnownWeight = weight; // 更新最后已知体重
      }
      
      history.push({
        date: dateStr,
        weight,
        calories,
        exerciseCalories
      });
    }
    
    return history;
  },
  
  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  prepareChartData(historyData) {
    return {
      dates: historyData.map(d => d.date.substring(5)), // MM/DD
      weights: historyData.map(d => d.weight),
      calories: historyData.map(d => d.calories),
      exercise: historyData.map(d => d.exerciseCalories)
    };
  },

  toggleDetail() {
    this.setData({
      showDetail: !this.data.showDetail
    });
  },

  viewRecommendation(e) {
    const rec = e.currentTarget.dataset.rec;
    wx.showModal({
      title: rec.title,
      content: rec.content,
      showCancel: false,
      confirmText: '知道了'
    });
  },

  refreshAnalysis() {
    this.analyzeMetabolism();
  },

  goToWeightUpdate() {
    wx.navigateTo({
      url: '/pages/weight-update/weight-update'
    });
  },

  goToDiet() {
    wx.navigateTo({
      url: '/pages/diet/diet'
    });
  },

  goToExercise() {
    wx.navigateTo({
      url: '/pages/exercise/exercise'
    });
  },

  shareReport() {
    const { report } = this.data;
    if (!report) return;

    const summary = `📊 我的代谢分析报告\n\n` +
      `当前BMR: ${report.metabolism.currentBMR} kcal\n` +
      `预测BMR: ${report.metabolism.predictedBMR} kcal\n` +
      `变化率: ${(report.metabolism.changeRate * 100).toFixed(1)}%\n\n` +
      `${report.summary.join('\n')}`;

    wx.showModal({
      title: '分享报告',
      content: summary,
      showCancel: false,
      confirmText: '知道了'
    });
  }
});
