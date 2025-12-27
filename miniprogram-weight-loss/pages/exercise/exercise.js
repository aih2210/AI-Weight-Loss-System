// pages/exercise/exercise.js
const app = getApp();

Page({
  data: {
    todayLogs: [],
    todayExercise: 0,
    progress: 0,
    showModal: false,
    exerciseTypes: ['跑步', '快走', '游泳', '骑行', '瑜伽', '力量训练', '跳绳', '爬楼梯', '其他'],
    exerciseIndex: 0,
    duration: 0,
    calories: 0,
    notes: '',
    // 智能计划相关
    hasActivePlan: false,
    planStats: null,
    todayPlan: null
  },

  onLoad() {
    this.loadData();
    this.loadPlanData();
  },

  onShow() {
    this.loadData();
    this.loadPlanData();
  },

  loadData() {
    const todayLogs = app.getTodayExerciseLogs();
    const todayExercise = app.getTodayExerciseCalories();
    const userData = app.getData();
    const target = userData.settings.dailyExerciseTarget || 300;
    const progress = Math.min(Math.round((todayExercise / target) * 100), 100);

    this.setData({
      todayLogs,
      todayExercise,
      progress,
      target
    });
  },

  // 加载计划数据
  loadPlanData() {
    const userData = app.getData();
    const exercisePlan = userData.exercisePlan;

    if (exercisePlan) {
      // 获取今天是周几
      const today = new Date().getDay(); // 0-6
      const todayPlan = exercisePlan.weeklyPlan.find(d => d.dayIndex === today);

      this.setData({
        hasActivePlan: true,
        planStats: exercisePlan.expectedResults,
        todayPlan: todayPlan && !todayPlan.isRestDay ? todayPlan : null
      });
    } else {
      this.setData({
        hasActivePlan: false,
        planStats: null,
        todayPlan: null
      });
    }
  },

  // 跳转到智能运动计划
  goToExercisePlan() {
    wx.navigateTo({
      url: '/pages/exercise-plan/exercise-plan'
    });
  },

  showAddExercise() {
    this.setData({
      showModal: true
    });
  },

  hideModal() {
    this.setData({
      showModal: false,
      exerciseIndex: 0,
      duration: 0,
      calories: 0,
      notes: ''
    });
  },

  stopPropagation() {
    // 阻止事件冒泡
  },

  onExerciseChange(e) {
    const index = e.detail.value;
    const { exerciseTypes, duration } = this.data;
    
    // 根据运动类型和时长自动计算卡路里
    const caloriesPerMinute = {
      '跑步': 10,
      '快走': 5,
      '游泳': 8,
      '骑行': 7,
      '瑜伽': 3,
      '力量训练': 6,
      '跳绳': 12,
      '爬楼梯': 9,
      '其他': 5
    };
    
    const type = exerciseTypes[index];
    const estimatedCalories = Math.round(duration * caloriesPerMinute[type]);
    
    this.setData({
      exerciseIndex: index,
      calories: estimatedCalories
    });
  },

  onDurationInput(e) {
    const duration = parseFloat(e.detail.value) || 0;
    const { exerciseTypes, exerciseIndex } = this.data;
    
    // 自动计算卡路里
    const caloriesPerMinute = {
      '跑步': 10,
      '快走': 5,
      '游泳': 8,
      '骑行': 7,
      '瑜伽': 3,
      '力量训练': 6,
      '跳绳': 12,
      '爬楼梯': 9,
      '其他': 5
    };
    
    const type = exerciseTypes[exerciseIndex];
    const estimatedCalories = Math.round(duration * caloriesPerMinute[type]);
    
    this.setData({
      duration,
      calories: estimatedCalories
    });
  },

  onCaloriesInput(e) {
    this.setData({
      calories: parseFloat(e.detail.value) || 0
    });
  },

  onNotesInput(e) {
    this.setData({
      notes: e.detail.value
    });
  },

  saveExerciseLog() {
    const { exerciseTypes, exerciseIndex, duration, calories, notes } = this.data;
    
    if (!duration) {
      wx.showToast({
        title: '请输入运动时长',
        icon: 'none'
      });
      return;
    }

    if (!calories) {
      wx.showToast({
        title: '请输入消耗卡路里',
        icon: 'none'
      });
      return;
    }

    app.addExerciseLog({
      type: exerciseTypes[exerciseIndex],
      duration,
      calories,
      notes
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
