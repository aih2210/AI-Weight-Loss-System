// pages/order-list/order-list.js
const app = getApp();

Page({
  data: {
    orders: [],
    statusMap: {
      pending: { text: '待发货', color: '#ff9800' },
      shipped: { text: '已发货', color: '#2196f3' },
      delivered: { text: '已送达', color: '#4caf50' },
      completed: { text: '已完成', color: '#9e9e9e' }
    }
  },

  onLoad() {
    this.loadOrders();
  },

  onShow() {
    this.loadOrders();
  },

  // 加载订单
  loadOrders() {
    const userData = app.getData();
    const orders = userData.orders || [];
    
    this.setData({ orders });
  },

  // 查看订单详情
  viewOrderDetail(e) {
    const order = e.currentTarget.dataset.order;
    
    let content = `订单号：${order.id}\n\n`;
    content += `商品：${order.product.name}\n`;
    content += `品牌：${order.product.brand}\n\n`;
    content += `支付信息：\n`;
    content += `现金：¥${order.cashPaid}\n`;
    content += `健康币：${order.coinPaid}个\n\n`;
    content += `下单时间：${new Date(order.orderTime).toLocaleString()}\n`;
    content += `订单状态：${this.data.statusMap[order.status].text}`;

    wx.showModal({
      title: '订单详情',
      content: content,
      showCancel: false
    });
  },

  // 取消订单
  cancelOrder(e) {
    const order = e.currentTarget.dataset.order;
    
    if (order.status !== 'pending') {
      wx.showToast({
        title: '该订单无法取消',
        icon: 'none'
      });
      return;
    }

    wx.showModal({
      title: '取消订单',
      content: '确定要取消这个订单吗？健康币将退回到你的账户。',
      success: (res) => {
        if (res.confirm) {
          this.processCancelOrder(order);
        }
      }
    });
  },

  // 处理取消订单
  processCancelOrder(order) {
    const userData = app.getData();
    const HealthCoinManager = require('../../utils/healthCoinManager.js');
    const coinManager = new HealthCoinManager();

    // 退回健康币
    coinManager.addCoins(userData, order.coinPaid, `取消订单退款：${order.product.name}`);

    // 更新订单状态
    const orderIndex = userData.orders.findIndex(o => o.id === order.id);
    if (orderIndex > -1) {
      userData.orders[orderIndex].status = 'cancelled';
    }

    app.saveData(userData);

    wx.showToast({
      title: '订单已取消',
      icon: 'success'
    });

    this.loadOrders();
  }
});
