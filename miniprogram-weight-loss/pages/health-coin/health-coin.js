// pages/health-coin/health-coin.js
const app = getApp();
const HealthCoinManager = require('../../utils/healthCoinManager.js');

Page({
  data: {
    coinManager: null,
    balance: 0,
    statistics: null,
    dailyTasks: [],
    recentHistory: [],
    showCheckInAnimation: false
  },

  onLoad() {
    this.data.coinManager = new HealthCoinManager();
    this.loadData();
  },

  onShow() {
    this.loadData();
  },

  // 加载数据
  loadData() {
    const userData = app.getData();
    const statistics = this.data.coinManager.getStatistics(userData);
    const dailyTasks = this.data.coinManager.getDailyTasks(userData);
    const recentHistory = (userData.coinHistory || []).slice(0, 10);

    this.setData({
      balance: statistics.balance,
      statistics,
      dailyTasks,
      recentHistory
    });
  },

  // 每日签到
  doCheckIn() {
    const userData = app.getData();
    const result = this.data.coinManager.dailyCheckIn(userData);

    if (result.success) {
      app.saveData(userData);
      
      // 显示签到动画
      this.setData({
        showCheckInAnimation: true
      });

      setTimeout(() => {
        this.setData({
          showCheckInAnimation: false
        });
      }, 2000);

      let message = result.message;
      if (result.bonusMessages.length > 0) {
        message += '\n🎉 ' + result.bonusMessages.join(', ');
      }

      wx.showModal({
        title: '签到成功',
        content: message + `\n\n连续签到${result.consecutiveDays}天`,
        showCancel: false,
        success: () => {
          this.loadData();
        }
      });
    } else {
      wx.showToast({
        title: result.message,
        icon: 'none'
      });
    }
  },

  // 查看任务详情
  viewTaskDetail(e) {
    const task = e.currentTarget.dataset.task;
    
    if (task.completed) {
      wx.showToast({
        title: '今日已完成',
        icon: 'success'
      });
      return;
    }

    const actions = {
      checkIn: () => this.doCheckIn(),
      exercise: () => wx.navigateTo({ url: '/pages/exercise/exercise' }),
      diet: () => wx.navigateTo({ url: '/pages/diet/diet' }),
      weight: () => wx.navigateTo({ url: '/pages/weight-update/weight-update' })
    };

    if (actions[task.id]) {
      actions[task.id]();
    }
  },

  // 查看历史记录
  viewHistory() {
    wx.navigateTo({
      url: '/pages/coin-history/coin-history'
    });
  },

  // 前往商城
  goToMall() {
    wx.navigateTo({
      url: '/pages/health-mall/health-mall'
    });
  },

  // 查看规则
  viewRules() {
    wx.showModal({
      title: '健康币规则',
      content: '📅 每日签到：10币\n🏃 完成运动：15币\n🍽️ 饮食记录：8币\n⚖️ 体重记录：5币\n\n🎁 连续签到奖励：\n3天+20币，7天+50币，30天+200币\n\n💰 健康币可在商城购买九安医疗产品，享受专属优惠！',
      showCancel: false
    });
  }
});
