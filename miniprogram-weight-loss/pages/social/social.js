// pages/social/social.js
Page({
  data: {
    myCode: '',
    friends: [],
    showAddModal: false,
    friendCode: ''
  },

  onLoad() {
    this.generateMyCode();
    this.loadFriends();
  },

  generateMyCode() {
    // 生成唯一邀请码
    const code = 'WL' + Date.now().toString().slice(-8);
    this.setData({
      myCode: code
    });
  },

  loadFriends() {
    // 模拟好友数据
    const friends = [
      { id: 1, name: '健身达人小王', avatar: '💪', progress: 85, weightLost: 8.5, days: 45 },
      { id: 2, name: '减重中的小李', avatar: '🏃', progress: 60, weightLost: 5.2, days: 30 }
    ];
    this.setData({
      friends
    });
  },

  copyCode() {
    wx.setClipboardData({
      data: this.data.myCode,
      success: () => {
        wx.showToast({
          title: '邀请码已复制',
          icon: 'success'
        });
      }
    });
  },

  showAddFriend() {
    this.setData({
      showAddModal: true
    });
  },

  hideModal() {
    this.setData({
      showAddModal: false,
      friendCode: ''
    });
  },

  onCodeInput(e) {
    this.setData({
      friendCode: e.detail.value
    });
  },

  addFriend() {
    const { friendCode } = this.data;
    
    if (!friendCode) {
      wx.showToast({
        title: '请输入邀请码',
        icon: 'none'
      });
      return;
    }

    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
    
    this.hideModal();
  },

  viewFriendDetail(e) {
    const friend = e.currentTarget.dataset.friend;
    wx.showModal({
      title: friend.name,
      content: `进度：${friend.progress}%\n已减重：${friend.weightLost}kg\n坚持：${friend.days}天\n\n继续加油！💪`,
      showCancel: false
    });
  },

  sendEncouragement(e) {
    const friend = e.currentTarget.dataset.friend;
    wx.showToast({
      title: `已为${friend.name}加油`,
      icon: 'success'
    });
  }
});
