// pages/exercise-plan/exercise-plan.js
const app = getApp();
const ExercisePlanner = require('../../utils/exercisePlanner.js');

Page({
  data: {
    planner: null,
    currentPlan: null,
    hasActivePlan: false,
    
    // 用户设置
    fitnessLevel: 0,
    fitnessLevels: ['初学者', '中级', '高级'],
    availableTime: 30,
    timeOptions: [15, 20, 30, 45, 60],
    selectedTimeIndex: 2,
    
    preferences: [],
    allPreferences: ['跑步', '快走', '跳绳', '游泳', '骑车', '瑜伽'],
    preferenceList: [],
    
    equipment: [],
    allEquipment: ['跳绳', '瑜伽垫', '哑铃', '自行车'],
    equipmentList: [],
    
    // 计划展示
    weeklyPlan: [],
    expectedResults: null,
    
    // 错过检测
    missedInfo: null,
    showMinimalPlan: false,
    minimalPlanData: null
  },

  onLoad() {
    this.data.planner = new ExercisePlanner();
    this.initializeLists();
    this.loadCurrentPlan();
    this.checkMissedWorkouts();
  },

  // 初始化列表数据
  initializeLists() {
    const preferenceList = this.data.allPreferences.map(name => ({
      name,
      selected: false
    }));
    
    const equipmentList = this.data.allEquipment.map(name => ({
      name,
      selected: false
    }));
    
    this.setData({
      preferenceList,
      equipmentList
    });
  },

  onShow() {
    this.loadCurrentPlan();
    this.checkMissedWorkouts();
  },

  // 加载当前计划
  loadCurrentPlan() {
    const userData = app.getData();
    const currentPlan = userData.exercisePlan;

    if (currentPlan) {
      this.setData({
        hasActivePlan: true,
        currentPlan,
        weeklyPlan: currentPlan.weeklyPlan,
        expectedResults: currentPlan.expectedResults
      });
    }
  },

  // 检查错过的训练
  checkMissedWorkouts() {
    const missedInfo = this.data.planner.detectMissedWorkouts();
    
    if (missedInfo && missedInfo.consecutiveMissed >= 2) {
      // 连续错过2天以上，显示最小可行方案
      const minimalPlanData = this.data.planner.generateMinimalPlan(missedInfo);
      
      this.setData({
        missedInfo,
        showMinimalPlan: true,
        minimalPlanData
      });

      // 显示提示
      setTimeout(() => {
        wx.showModal({
          title: '💪 重新开始',
          content: minimalPlanData.encouragement + '\n\n' + minimalPlanData.minimalPlan.message,
          confirmText: '试试看',
          cancelText: '稍后',
          success: (res) => {
            if (res.confirm) {
              this.showMinimalPlanDetail();
            }
          }
        });
      }, 500);
    } else {
      this.setData({
        missedInfo,
        showMinimalPlan: false
      });
    }
  },

  // 显示最小可行方案详情
  showMinimalPlanDetail() {
    const { minimalPlan } = this.data.minimalPlanData;
    
    let content = `⏱️ 只需${minimalPlan.duration}分钟\n\n`;
    minimalPlan.activities.forEach((activity, index) => {
      content += `${index + 1}. ${activity.name} - ${activity.description}\n`;
    });
    content += `\n💡 ${minimalPlan.nextStep}`;

    wx.showModal({
      title: minimalPlan.name,
      content: content,
      confirmText: '开始',
      cancelText: '返回',
      success: (res) => {
        if (res.confirm) {
          this.startMinimalWorkout();
        }
      }
    });
  },

  // 开始最小可行方案
  startMinimalWorkout() {
    const { minimalPlan } = this.data.minimalPlanData;
    
    wx.showLoading({ title: '准备中...' });

    setTimeout(() => {
      wx.hideLoading();
      
      wx.showModal({
        title: '🎉 太棒了！',
        content: `你完成了${minimalPlan.duration}分钟的运动！\n\n这是一个很好的开始，明天继续加油！`,
        showCancel: false,
        success: () => {
          // 记录运动
          app.addExerciseLog({
            name: minimalPlan.name,
            duration: minimalPlan.duration,
            calories: minimalPlan.calories,
            type: 'minimal'
          });

          this.loadCurrentPlan();
          this.checkMissedWorkouts();
        }
      });
    }, minimalPlan.duration * 1000); // 模拟运动时间
  },

  // 关闭最小方案提示
  closeMinimalPlan() {
    this.setData({
      showMinimalPlan: false
    });
  },

  // 体能水平选择
  onFitnessLevelChange(e) {
    this.setData({
      fitnessLevel: e.detail.value
    });
  },

  // 时间选择
  onTimeChange(e) {
    const index = parseInt(e.detail.value);
    this.setData({
      selectedTimeIndex: index,
      availableTime: this.data.timeOptions[index]
    });
  },

  // 偏好选择
  togglePreference(e) {
    console.log('togglePreference 被调用');
    const pref = e.currentTarget.dataset.pref;
    console.log('选择的偏好:', pref);
    
    let preferenceList = [...this.data.preferenceList];
    let preferences = [...this.data.preferences];
    
    // 找到对应项并切换选中状态
    const item = preferenceList.find(p => p.name === pref);
    if (item) {
      item.selected = !item.selected;
      
      // 更新preferences数组
      if (item.selected) {
        preferences.push(pref);
        console.log('添加偏好:', pref);
      } else {
        const index = preferences.indexOf(pref);
        if (index > -1) {
          preferences.splice(index, 1);
          console.log('移除偏好:', pref);
        }
      }
    }
    
    console.log('更新后的preferenceList:', preferenceList);
    console.log('更新后的preferences:', preferences);
    
    this.setData({ 
      preferenceList,
      preferences 
    });
  },

  // 设备选择
  toggleEquipment(e) {
    console.log('toggleEquipment 被调用');
    const equip = e.currentTarget.dataset.equip;
    console.log('选择的设备:', equip);
    
    let equipmentList = [...this.data.equipmentList];
    let equipment = [...this.data.equipment];
    
    // 找到对应项并切换选中状态
    const item = equipmentList.find(eq => eq.name === equip);
    if (item) {
      item.selected = !item.selected;
      
      // 更新equipment数组
      if (item.selected) {
        equipment.push(equip);
        console.log('添加设备:', equip);
      } else {
        const index = equipment.indexOf(equip);
        if (index > -1) {
          equipment.splice(index, 1);
          console.log('移除设备:', equip);
        }
      }
    }
    
    console.log('更新后的equipmentList:', equipmentList);
    console.log('更新后的equipment:', equipment);
    
    this.setData({ 
      equipmentList,
      equipment 
    });
  },

  // 生成计划
  generatePlan() {
    const { fitnessLevel, availableTime, preferences, equipment } = this.data;
    const userData = app.getData();

    wx.showLoading({ title: 'AI生成中...' });

    setTimeout(() => {
      // 确定减重阶段
      const weightLossStage = this.determineWeightLossStage(userData);

      // 生成计划
      const userProfile = {
        fitnessLevel: ['beginner', 'intermediate', 'advanced'][fitnessLevel],
        preferences,
        availableTime,
        weightLossStage,
        equipment
      };

      const plan = this.data.planner.generatePlan(userProfile);

      // 保存计划
      userData.exercisePlan = plan;
      app.saveData(userData);

      wx.hideLoading();

      this.setData({
        hasActivePlan: true,
        currentPlan: plan,
        weeklyPlan: plan.weeklyPlan,
        expectedResults: plan.expectedResults
      });

      wx.showToast({
        title: '计划生成成功',
        icon: 'success'
      });
    }, 2000);
  },

  // 确定减重阶段
  determineWeightLossStage(userData) {
    const weightHistory = userData.weightHistory || [];
    
    if (weightHistory.length < 7) {
      return 'initial';
    }

    // 检查最近7天体重变化
    const recent7 = weightHistory.slice(-7);
    const weightChange = recent7[recent7.length - 1].weight - recent7[0].weight;

    if (Math.abs(weightChange) < 0.5) {
      return 'plateau'; // 平台期
    } else if (userData.user.currentWeight <= userData.user.targetWeight + 2) {
      return 'maintenance'; // 维持期
    } else {
      return 'initial'; // 减重期
    }
  },

  // 查看日计划详情
  viewDayPlan(e) {
    const day = e.currentTarget.dataset.day;
    
    if (day.isRestDay) {
      wx.showToast({
        title: '今天是休息日',
        icon: 'none'
      });
      return;
    }

    let content = `🎯 ${day.focus}\n`;
    content += `⏱️ 总时长：${day.totalTime}分钟\n`;
    content += `🔥 消耗：${day.totalCalories}卡\n\n`;
    content += `训练内容：\n`;
    
    day.activities.forEach((activity, index) => {
      content += `${index + 1}. ${activity.name} - ${activity.description}\n`;
    });

    wx.showModal({
      title: day.day + ' 训练计划',
      content: content,
      confirmText: '开始训练',
      cancelText: '返回',
      success: (res) => {
        if (res.confirm) {
          this.startWorkout(day);
        }
      }
    });
  },

  // 开始训练
  startWorkout(day) {
    // 跳转到视频跟练页面
    wx.navigateTo({
      url: `/pages/workout-video/workout-video?plan=${encodeURIComponent(JSON.stringify(day))}`
    });
  },

  // 调整计划
  adjustPlan() {
    wx.showModal({
      title: '调整计划',
      content: '系统将根据你的完成情况自动调整计划。\n\n是否立即调整？',
      success: (res) => {
        if (res.confirm) {
          this.performAdjustment();
        }
      }
    });
  },

  // 执行调整
  performAdjustment() {
    const userData = app.getData();
    const exerciseLogs = userData.exerciseLogs || [];
    
    // 计算完成率
    const last7Days = exerciseLogs.filter(log => {
      const logDate = new Date(log.timestamp);
      const now = new Date();
      const diff = now - logDate;
      return diff < 7 * 24 * 60 * 60 * 1000;
    });

    const completionRate = last7Days.length / 7;

    // 计算体重变化
    const weightHistory = userData.weightHistory || [];
    const weightChange = weightHistory.length >= 2
      ? weightHistory[weightHistory.length - 1].weight - weightHistory[weightHistory.length - 7].weight
      : 0;

    const performanceData = {
      completionRate,
      avgCalories: last7Days.reduce((sum, log) => sum + log.calories, 0) / last7Days.length,
      weightChange
    };

    const adjustment = this.data.planner.adjustPlan(userData.exercisePlan, performanceData);

    if (adjustment.needsAdjustment) {
      wx.showModal({
        title: '调整建议',
        content: adjustment.recommendation + '\n\n是否重新生成计划？',
        success: (res) => {
          if (res.confirm) {
            this.generatePlan();
          }
        }
      });
    } else {
      wx.showToast({
        title: '当前计划很好',
        icon: 'success'
      });
    }
  },

  // 删除计划
  deletePlan() {
    wx.showModal({
      title: '确认删除',
      content: '确定要删除当前计划吗？',
      success: (res) => {
        if (res.confirm) {
          const userData = app.getData();
          delete userData.exercisePlan;
          app.saveData(userData);

          this.setData({
            hasActivePlan: false,
            currentPlan: null,
            weeklyPlan: [],
            expectedResults: null
          });

          wx.showToast({
            title: '已删除',
            icon: 'success'
          });
        }
      }
    });
  }
});
