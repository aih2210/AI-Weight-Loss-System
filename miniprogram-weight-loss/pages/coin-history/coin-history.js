// pages/coin-history/coin-history.js
const app = getApp();

Page({
  data: {
    history: [],
    filterType: 'all', // all, earn, spend
    filteredHistory: []
  },

  onLoad() {
    this.loadHistory();
  },

  // 加载历史记录
  loadHistory() {
    const userData = app.getData();
    const history = userData.coinHistory || [];
    
    this.setData({ 
      history,
      filteredHistory: history
    });
  },

  // 切换筛选
  switchFilter(e) {
    const type = e.currentTarget.dataset.type;
    const { history } = this.data;
    
    let filteredHistory = history;
    if (type !== 'all') {
      filteredHistory = history.filter(h => h.type === type);
    }
    
    this.setData({
      filterType: type,
      filteredHistory
    });
  },

  // 格式化时间
  formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) {
      return '刚刚';
    } else if (diff < 3600000) {
      return `${Math.floor(diff / 60000)}分钟前`;
    } else if (diff < 86400000) {
      return `${Math.floor(diff / 3600000)}小时前`;
    } else {
      return date.toLocaleDateString();
    }
  }
});
