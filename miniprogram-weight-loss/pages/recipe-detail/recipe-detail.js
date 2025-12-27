// pages/recipe-detail/recipe-detail.js
Page({
  data: {
    recipe: null,
    currentTab: 0, // 0: 食材, 1: 步骤, 2: 营养
    completedSteps: []
  },

  onLoad(options) {
    if (options.recipe) {
      try {
        const recipe = JSON.parse(decodeURIComponent(options.recipe));
        this.setData({ recipe });
      } catch (error) {
        console.error('解析食谱数据失败:', error);
        wx.showToast({
          title: '数据加载失败',
          icon: 'none'
        });
      }
    }
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      currentTab: parseInt(tab)
    });
  },

  toggleStep(e) {
    const stepIndex = e.currentTarget.dataset.index;
    const completedSteps = this.data.completedSteps;
    const index = completedSteps.indexOf(stepIndex);
    
    if (index > -1) {
      completedSteps.splice(index, 1);
    } else {
      completedSteps.push(stepIndex);
    }
    
    this.setData({ completedSteps });
    
    // 检查是否全部完成
    if (completedSteps.length === this.data.recipe.steps.length) {
      wx.showToast({
        title: '🎉 完成制作！',
        icon: 'success'
      });
    }
  },

  startCooking() {
    wx.showModal({
      title: '开始烹饪',
      content: '准备好所有食材了吗？点击每个步骤可以标记完成进度。',
      confirmText: '开始',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            currentTab: 1,
            completedSteps: []
          });
        }
      }
    });
  },

  shareRecipe() {
    const { recipe } = this.data;
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
    
    wx.showToast({
      title: '点击右上角分享',
      icon: 'none'
    });
  },

  onShareAppMessage() {
    const { recipe } = this.data;
    return {
      title: `推荐一道健康食谱：${recipe.name}`,
      path: `/pages/recipe-detail/recipe-detail?recipe=${encodeURIComponent(JSON.stringify(recipe))}`,
      imageUrl: '' // 可以添加食谱图片
    };
  },

  addToFavorites() {
    wx.showToast({
      title: '已收藏',
      icon: 'success'
    });
  },

  goBack() {
    wx.navigateBack();
  }
});
