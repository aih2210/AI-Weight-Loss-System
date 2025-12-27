// pages/profile/profile.js
const app = getApp();

Page({
  data: {
    userData: {},
    streak: 0,
    weightLost: 0,
    daysUsed: 0,
    showEditModal: false,
    showGoalModal: false,
    editName: '',
    editAge: 0,
    editHeight: 0,
    editGender: 0,
    genderOptions: ['男', '女'],
    targetWeight: 0,
    dailyCalorieTarget: 0,
    dailyExerciseTarget: 0,
    // 头像相关
    avatarUrl: '',
    showAvatarOptions: false,
    avatarEmojis: ['👤', '😊', '🙂', '😎', '🤗', '😇', '🥰', '😍', '🤩', '😋', '🤓', '🧐', '🤠', '👨', '👩', '🧑', '👶', '🧒', '👦', '👧']
  },

  onLoad() {
    this.loadData();
  },

  onShow() {
    this.loadData();
  },

  loadData() {
    const userData = app.getData();
    const streak = app.getStreak();
    const weightLost = (userData.user.startWeight - userData.user.currentWeight).toFixed(1);
    const startDate = new Date(userData.user.startDate);
    const daysUsed = Math.floor((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    this.setData({
      userData,
      streak,
      weightLost,
      daysUsed,
      avatarUrl: userData.user.avatar || '👤'
    });
  },

  // 显示头像选择器
  showAvatarPicker() {
    this.setData({
      showAvatarOptions: true
    });
  },

  // 隐藏头像选择器
  hideAvatarPicker() {
    this.setData({
      showAvatarOptions: false
    });
  },

  // 选择Emoji头像
  selectEmojiAvatar(e) {
    const emoji = e.currentTarget.dataset.emoji;
    this.updateAvatar(emoji);
  },

  // 选择相册图片
  chooseImageAvatar() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];
        this.updateAvatar(tempFilePath);
      },
      fail: (err) => {
        console.error('选择图片失败:', err);
        wx.showToast({
          title: '选择图片失败',
          icon: 'none'
        });
      }
    });
  },

  // 更新头像
  updateAvatar(avatar) {
    const userData = app.getData();
    userData.user.avatar = avatar;
    app.saveData(userData);

    this.setData({
      avatarUrl: avatar,
      showAvatarOptions: false
    });

    wx.showToast({
      title: '头像更新成功',
      icon: 'success'
    });
  },

  showEditProfile() {
    const { userData } = this.data;
    this.setData({
      showEditModal: true,
      editName: userData.user.name,
      editAge: userData.user.age,
      editHeight: userData.user.height,
      editGender: userData.user.gender === 'male' ? 0 : 1
    });
  },

  hideEditModal() {
    this.setData({
      showEditModal: false
    });
  },

  showGoalSettings() {
    const { userData } = this.data;
    this.setData({
      showGoalModal: true,
      targetWeight: userData.user.targetWeight,
      dailyCalorieTarget: userData.settings.dailyCalorieTarget,
      dailyExerciseTarget: userData.settings.dailyExerciseTarget
    });
  },

  hideGoalModal() {
    this.setData({
      showGoalModal: false
    });
  },

  stopPropagation() {
    // 阻止事件冒泡
  },

  onNameInput(e) {
    this.setData({
      editName: e.detail.value
    });
  },

  onAgeInput(e) {
    this.setData({
      editAge: parseInt(e.detail.value) || 0
    });
  },

  onHeightInput(e) {
    this.setData({
      editHeight: parseInt(e.detail.value) || 0
    });
  },

  onGenderChange(e) {
    this.setData({
      editGender: e.detail.value
    });
  },

  saveProfile() {
    const { editName, editAge, editHeight, editGender, genderOptions } = this.data;
    
    if (!editName || !editAge || !editHeight) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      });
      return;
    }

    const userData = app.getData();
    userData.user.name = editName;
    userData.user.age = editAge;
    userData.user.height = editHeight;
    userData.user.gender = editGender === 0 ? 'male' : 'female';
    app.saveData(userData);

    wx.showToast({
      title: '保存成功',
      icon: 'success'
    });

    this.hideEditModal();
    this.loadData();
  },

  onTargetWeightInput(e) {
    this.setData({
      targetWeight: parseFloat(e.detail.value) || 0
    });
  },

  onCalorieTargetInput(e) {
    this.setData({
      dailyCalorieTarget: parseInt(e.detail.value) || 0
    });
  },

  onExerciseTargetInput(e) {
    this.setData({
      dailyExerciseTarget: parseInt(e.detail.value) || 0
    });
  },

  saveGoals() {
    const { targetWeight, dailyCalorieTarget, dailyExerciseTarget } = this.data;
    
    if (!targetWeight || !dailyCalorieTarget || !dailyExerciseTarget) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      });
      return;
    }

    const userData = app.getData();
    userData.user.targetWeight = targetWeight;
    userData.settings.dailyCalorieTarget = dailyCalorieTarget;
    userData.settings.dailyExerciseTarget = dailyExerciseTarget;
    app.saveData(userData);

    wx.showToast({
      title: '保存成功',
      icon: 'success'
    });

    this.hideGoalModal();
    this.loadData();
  },

  goToWeightUpdate() {
    wx.navigateTo({
      url: '/pages/weight-update/weight-update'
    });
  },

  goToDataManagement() {
    wx.navigateTo({
      url: '/pages/data-management/data-management'
    });
  },

  goToAccountManagement() {
    wx.navigateTo({
      url: '/pages/account-management/account-management'
    });
  },

  goToPrivacySettings() {
    wx.navigateTo({
      url: '/pages/privacy-settings/privacy-settings'
    });
  },

  goToNotificationSettings() {
    wx.navigateTo({
      url: '/pages/notification-settings/notification-settings'
    });
  },

  showAbout() {
    wx.showModal({
      title: 'AI减重助手',
      content: '版本：v1.0\n\n一个帮助你科学减重的智能助手\n\n所有数据存储在本地，保护你的隐私',
      showCancel: false
    });
  },

  onPullDownRefresh() {
    this.loadData();
    wx.stopPullDownRefresh();
  }
});
