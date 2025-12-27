// pages/notification-settings/notification-settings.js
Page({
  data: {
    notificationEnabled: true,
    dietReminder: true,
    exerciseReminder: true,
    weightReminder: true,
    waterReminder: false,
    aiSuggestion: true,
    progressUpdate: true,
    achievementNotification: true,
    dndEnabled: false,
    breakfastTime: '08:00',
    lunchTime: '12:00',
    dinnerTime: '18:00',
    exerciseTime: '19:00',
    dndStartTime: '22:00',
    dndEndTime: '07:00'
  },

  onLoad() {
    this.loadSettings();
  },

  loadSettings() {
    const settings = wx.getStorageSync('notificationSettings') || {};
    this.setData({
      notificationEnabled: settings.notificationEnabled !== false,
      dietReminder: settings.dietReminder !== false,
      exerciseReminder: settings.exerciseReminder !== false,
      weightReminder: settings.weightReminder !== false,
      waterReminder: settings.waterReminder || false,
      aiSuggestion: settings.aiSuggestion !== false,
      progressUpdate: settings.progressUpdate !== false,
      achievementNotification: settings.achievementNotification !== false,
      dndEnabled: settings.dndEnabled || false,
      breakfastTime: settings.breakfastTime || '08:00',
      lunchTime: settings.lunchTime || '12:00',
      dinnerTime: settings.dinnerTime || '18:00',
      exerciseTime: settings.exerciseTime || '19:00',
      dndStartTime: settings.dndStartTime || '22:00',
      dndEndTime: settings.dndEndTime || '07:00'
    });
  },

  saveSettings() {
    wx.setStorageSync('notificationSettings', this.data);
    wx.showToast({
      title: '设置已保存',
      icon: 'success'
    });
  },

  onNotificationEnabledChange(e) {
    this.setData({
      notificationEnabled: e.detail.value
    });
    this.saveSettings();
  },

  onDietReminderChange(e) {
    this.setData({
      dietReminder: e.detail.value
    });
    this.saveSettings();
  },

  onExerciseReminderChange(e) {
    this.setData({
      exerciseReminder: e.detail.value
    });
    this.saveSettings();
  },

  onWeightReminderChange(e) {
    this.setData({
      weightReminder: e.detail.value
    });
    this.saveSettings();
  },

  onWaterReminderChange(e) {
    this.setData({
      waterReminder: e.detail.value
    });
    this.saveSettings();
  },

  onAiSuggestionChange(e) {
    this.setData({
      aiSuggestion: e.detail.value
    });
    this.saveSettings();
  },

  onProgressUpdateChange(e) {
    this.setData({
      progressUpdate: e.detail.value
    });
    this.saveSettings();
  },

  onAchievementNotificationChange(e) {
    this.setData({
      achievementNotification: e.detail.value
    });
    this.saveSettings();
  },

  onDndEnabledChange(e) {
    this.setData({
      dndEnabled: e.detail.value
    });
    this.saveSettings();
  },

  setBreakfastTime() {
    this.showTimePicker('breakfastTime', '早餐时间');
  },

  setLunchTime() {
    this.showTimePicker('lunchTime', '午餐时间');
  },

  setDinnerTime() {
    this.showTimePicker('dinnerTime', '晚餐时间');
  },

  setExerciseTime() {
    this.showTimePicker('exerciseTime', '运动时间');
  },

  setDndStartTime() {
    this.showTimePicker('dndStartTime', '免打扰开始时间');
  },

  setDndEndTime() {
    this.showTimePicker('dndEndTime', '免打扰结束时间');
  },

  showTimePicker(field, title) {
    wx.showModal({
      title: `设置${title}`,
      content: '时间选择功能开发中',
      showCancel: false
    });
  }
});
