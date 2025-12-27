// pages/weight-update/weight-update.js
const app = getApp();

Page({
  data: {
    currentWeight: 0,
    date: '',
    weightHistory: []
  },

  onLoad() {
    const userData = app.getData();
    const today = app.formatDate(new Date());
    
    this.setData({
      currentWeight: userData.user.currentWeight,
      date: today,
      weightHistory: userData.weightHistory.slice(-5).reverse()
    });
  },

  onWeightInput(e) {
    this.setData({
      currentWeight: parseFloat(e.detail.value) || 0
    });
  },

  onDateChange(e) {
    this.setData({
      date: e.detail.value
    });
  },

  saveWeight() {
    const { currentWeight, date } = this.data;
    
    if (!currentWeight || currentWeight <= 0) {
      wx.showToast({
        title: '请输入有效的体重',
        icon: 'none'
      });
      return;
    }

    // 保存体重记录
    app.addWeightRecord(currentWeight, date);
    
    // 显示成功提示
    wx.showToast({
      title: '保存成功',
      icon: 'success',
      duration: 1500
    });

    // 延迟返回，确保数据已保存
    setTimeout(() => {
      // 返回上一页并刷新
      wx.navigateBack({
        success: () => {
          // 获取上一页实例
          const pages = getCurrentPages();
          if (pages.length > 1) {
            const prevPage = pages[pages.length - 2];
            // 如果上一页是代谢分析页面，触发刷新
            if (prevPage.route === 'pages/metabolism-analysis/metabolism-analysis') {
              prevPage.analyzeMetabolism();
            }
            // 如果上一页是首页，触发刷新
            if (prevPage.route === 'pages/index/index') {
              prevPage.onShow();
            }
          }
        }
      });
    }, 1500);
  }
});
