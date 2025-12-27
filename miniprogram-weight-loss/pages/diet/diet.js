// pages/diet/diet.js
const app = getApp();

Page({
  data: {
    todayLogs: [],
    mealIcons: {
      '早餐': '🌅',
      '午餐': '☀️',
      '晚餐': '🌙',
      '加餐': '🍎'
    },
    showModal: false,
    mealTypes: ['早餐', '午餐', '晚餐', '加餐'],
    mealIndex: 0,
    foodName: '',
    portion: 0,
    calories: 0
  },

  onLoad() {
    this.loadData();
  },

  onShow() {
    this.loadData();
  },

  loadData() {
    const todayLogs = app.getTodayFoodLogs();
    this.setData({
      todayLogs
    });
  },

  goToFoodRecognition() {
    wx.navigateTo({
      url: '/pages/food-recognition/food-recognition'
    });
  },

  goToRecipeGenerator() {
    wx.navigateTo({
      url: '/pages/recipe-generator/recipe-generator'
    });
  },

  showManualInput() {
    this.setData({
      showModal: true
    });
  },

  hideModal() {
    this.setData({
      showModal: false,
      foodName: '',
      portion: 0,
      calories: 0,
      mealIndex: 0
    });
  },

  stopPropagation() {
    // 阻止事件冒泡
  },

  onFoodNameInput(e) {
    this.setData({
      foodName: e.detail.value
    });
  },

  onPortionInput(e) {
    this.setData({
      portion: parseFloat(e.detail.value) || 0
    });
  },

  onCaloriesInput(e) {
    this.setData({
      calories: parseFloat(e.detail.value) || 0
    });
  },

  onMealChange(e) {
    this.setData({
      mealIndex: e.detail.value
    });
  },

  saveFoodLog() {
    const { foodName, portion, calories, mealTypes, mealIndex } = this.data;
    
    if (!foodName) {
      wx.showToast({
        title: '请输入食物名称',
        icon: 'none'
      });
      return;
    }

    if (!portion || !calories) {
      wx.showToast({
        title: '请输入完整信息',
        icon: 'none'
      });
      return;
    }

    app.addFoodLog({
      name: foodName,
      portion,
      calories,
      protein: 0,
      carbs: 0,
      fat: 0,
      meal: mealTypes[mealIndex]
    });

    wx.showToast({
      title: '保存成功',
      icon: 'success'
    });

    this.hideModal();
    this.loadData();
  },

  onPullDownRefresh() {
    this.loadData();
    wx.stopPullDownRefresh();
  }
});
