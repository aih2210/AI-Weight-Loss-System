// pages/health-mall/health-mall.js
const app = getApp();
const HealthCoinManager = require('../../utils/healthCoinManager.js');

Page({
  data: {
    coinManager: null,
    balance: 0,
    categories: ['全部', '血压计', '血糖仪', '体温计', '体脂秤', '按摩器'],
    currentCategory: 0,
    products: [],
    allProducts: [
      {
        id: 1,
        name: '九安电子血压计',
        brand: '九安医疗',
        category: '血压计',
        image: '/images/products/blood-pressure.jpg',
        icon: '🩺',
        bgColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        originalPrice: 299,
        cashPrice: 199,
        coinPrice: 500,
        discount: '健康币抵扣100元',
        features: ['智能测量', '语音播报', '大屏显示', '记忆功能'],
        stock: 50
      },
      {
        id: 2,
        name: '九安血糖仪套装',
        brand: '九安医疗',
        category: '血糖仪',
        image: '/images/products/glucose-meter.jpg',
        icon: '💉',
        bgColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        originalPrice: 399,
        cashPrice: 249,
        coinPrice: 800,
        discount: '健康币抵扣150元',
        features: ['快速检测', '无痛采血', '50片试纸', '便携收纳'],
        stock: 30
      },
      {
        id: 3,
        name: '九安红外体温计',
        brand: '九安医疗',
        category: '体温计',
        image: '/images/products/thermometer.jpg',
        icon: '🌡️',
        bgColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        originalPrice: 159,
        cashPrice: 99,
        coinPrice: 300,
        discount: '健康币抵扣60元',
        features: ['非接触测量', '1秒出结果', '高精准度', '静音模式'],
        stock: 100
      },
      {
        id: 4,
        name: '九安智能体脂秤',
        brand: '九安医疗',
        category: '体脂秤',
        image: '/images/products/body-scale.jpg',
        icon: '⚖️',
        bgColor: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        originalPrice: 199,
        cashPrice: 129,
        coinPrice: 400,
        discount: '健康币抵扣70元',
        features: ['14项数据', 'APP同步', '家庭共享', '精准测量'],
        stock: 60
      },
      {
        id: 5,
        name: '九安颈椎按摩器',
        brand: '九安医疗',
        category: '按摩器',
        image: '/images/products/neck-massager.jpg',
        icon: '💆',
        bgColor: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        originalPrice: 299,
        cashPrice: 199,
        coinPrice: 500,
        discount: '健康币抵扣100元',
        features: ['热敷功能', '多档调节', '无线便携', '定时保护'],
        stock: 40
      },
      {
        id: 6,
        name: '九安腕式血压计',
        brand: '九安医疗',
        category: '血压计',
        image: '/images/products/wrist-monitor.jpg',
        icon: '⌚',
        bgColor: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
        originalPrice: 249,
        cashPrice: 159,
        coinPrice: 400,
        discount: '健康币抵扣90元',
        features: ['腕式设计', '便携测量', '智能提醒', '数据存储'],
        stock: 45
      },
      {
        id: 7,
        name: '九安血糖试纸（100片）',
        brand: '九安医疗',
        category: '血糖仪',
        image: '/images/products/test-strips.jpg',
        icon: '📋',
        bgColor: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        originalPrice: 199,
        cashPrice: 149,
        coinPrice: 300,
        discount: '健康币抵扣50元',
        features: ['100片装', '独立包装', '长效保存', '精准检测'],
        stock: 80
      },
      {
        id: 8,
        name: '九安足底按摩器',
        brand: '九安医疗',
        category: '按摩器',
        image: '/images/products/foot-massager.jpg',
        icon: '🦶',
        bgColor: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
        originalPrice: 399,
        cashPrice: 269,
        coinPrice: 700,
        discount: '健康币抵扣130元',
        features: ['气压按摩', '加热功能', '多种模式', '遥控操作'],
        stock: 25
      }
    ]
  },

  onLoad() {
    this.data.coinManager = new HealthCoinManager();
    this.loadData();
  },

  onShow() {
    this.loadBalance();
  },

  // 加载数据
  loadData() {
    this.loadBalance();
    this.filterProducts();
  },

  // 加载余额
  loadBalance() {
    const userData = app.getData();
    const balance = this.data.coinManager.getBalance(userData);
    this.setData({ balance });
  },

  // 切换分类
  switchCategory(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      currentCategory: index
    });
    this.filterProducts();
  },

  // 筛选产品
  filterProducts() {
    const { currentCategory, categories, allProducts } = this.data;
    const categoryName = categories[currentCategory];
    
    let products = allProducts;
    if (categoryName !== '全部') {
      products = allProducts.filter(p => p.category === categoryName);
    }
    
    this.setData({ products });
  },

  // 查看产品详情
  viewProduct(e) {
    const product = e.currentTarget.dataset.product;
    
    let content = `${product.brand}\n\n`;
    content += `市场价：¥${product.originalPrice}\n`;
    content += `现金价：¥${product.cashPrice}\n`;
    content += `健康币：${product.coinPrice}个\n\n`;
    content += `💰 ${product.discount}\n\n`;
    content += `产品特点：\n`;
    product.features.forEach((f, i) => {
      content += `${i + 1}. ${f}\n`;
    });
    content += `\n库存：${product.stock}件`;

    wx.showModal({
      title: product.name,
      content: content,
      confirmText: '立即购买',
      cancelText: '返回',
      success: (res) => {
        if (res.confirm) {
          this.buyProduct(product);
        }
      }
    });
  },

  // 购买产品
  buyProduct(product) {
    const userData = app.getData();
    const balance = this.data.coinManager.getBalance(userData);

    // 检查健康币余额
    if (balance < product.coinPrice) {
      wx.showModal({
        title: '健康币不足',
        content: `购买此商品需要${product.coinPrice}健康币\n当前余额：${balance}健康币\n还需要：${product.coinPrice - balance}健康币\n\n快去完成任务赚取健康币吧！`,
        confirmText: '去赚币',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            wx.navigateBack();
          }
        }
      });
      return;
    }

    // 确认购买
    wx.showModal({
      title: '确认购买',
      content: `${product.name}\n\n支付方式：\n现金：¥${product.cashPrice}\n健康币：${product.coinPrice}个\n\n确认购买吗？`,
      confirmText: '确认',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          this.processPurchase(product);
        }
      }
    });
  },

  // 处理购买
  processPurchase(product) {
    wx.showLoading({ title: '处理中...' });

    // 模拟支付流程
    setTimeout(() => {
      const userData = app.getData();
      
      // 扣除健康币
      const success = this.data.coinManager.deductCoins(
        userData,
        product.coinPrice,
        `购买${product.name}`
      );

      if (success) {
        // 记录订单
        if (!userData.orders) {
          userData.orders = [];
        }

        userData.orders.unshift({
          id: Date.now(),
          product: product,
          cashPaid: product.cashPrice,
          coinPaid: product.coinPrice,
          status: 'pending',
          orderTime: new Date().toISOString()
        });

        app.saveData(userData);

        wx.hideLoading();

        wx.showModal({
          title: '购买成功',
          content: `恭喜你成功购买${product.name}！\n\n订单将在1-3个工作日内发货\n请注意查收短信通知`,
          showCancel: false,
          success: () => {
            this.loadBalance();
            
            // 跳转到订单页面
            wx.navigateTo({
              url: '/pages/order-list/order-list'
            });
          }
        });
      } else {
        wx.hideLoading();
        wx.showToast({
          title: '购买失败',
          icon: 'error'
        });
      }
    }, 1500);
  },

  // 查看订单
  viewOrders() {
    wx.navigateTo({
      url: '/pages/order-list/order-list'
    });
  }
});
