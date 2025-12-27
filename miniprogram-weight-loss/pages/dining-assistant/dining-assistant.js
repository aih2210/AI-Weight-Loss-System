// pages/dining-assistant/dining-assistant.js
const app = getApp();
const mapConfig = require('../../config/map.js');

// 注意：需要下载腾讯地图SDK并放在utils目录
// 下载地址：https://lbs.qq.com/miniProgram/jsSdk/jsSdkGuide/jsSdkOverview
let QQMapWX = null;
try {
  QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
} catch (e) {
  console.log('腾讯地图SDK未安装，将使用模拟数据');
}

Page({
  data: {
    location: null,
    locationName: '',
    restaurants: [],
    selectedRestaurant: null,
    mealType: 0,
    mealTypes: ['早餐', '午餐', '晚餐', '夜宵'],
    showPreAdvice: false,
    showPostAdvice: false,
    preAdvice: null,
    postAdvice: null,
    caloriesBudget: 0,
    searchRadius: 2, // 搜索半径（公里）
    filterType: 'all', // 餐厅类型筛选
    sortBy: 'recommend', // 排序方式：recommend, distance, health, rating
    useRealAPI: false, // 是否使用真实API
    qqmapsdk: null, // 地图SDK实例
    isSearching: false, // 是否正在搜索
    lastSearchTime: 0, // 上次搜索时间
    searchCache: {}, // 搜索结果缓存
    favoriteRestaurants: [], // 收藏的餐馆
    
    // 扩展的餐厅数据库（模拟不同位置的餐厅）
    restaurantDatabase: [
      // 轻食类
      {
        id: 1,
        name: '轻食沙拉馆',
        type: '轻食',
        lat: 0, // 相对偏移
        lng: 0,
        rating: 4.8,
        avgCalories: 400,
        healthScore: 95,
        tags: ['低卡', '高蛋白', '新鲜'],
        openHours: '7:00-22:00',
        priceRange: '25-45元',
        dishes: [
          { name: '烤鸡胸沙拉', calories: 380, protein: 45, carbs: 20, fat: 12, price: 38 },
          { name: '金枪鱼沙拉', calories: 350, protein: 40, carbs: 18, fat: 10, price: 42 },
          { name: '藜麦蔬菜碗', calories: 420, protein: 15, carbs: 60, fat: 8, price: 35 }
        ]
      },
      {
        id: 2,
        name: '绿色轻食',
        type: '轻食',
        lat: 0.003,
        lng: 0.002,
        rating: 4.7,
        avgCalories: 380,
        healthScore: 93,
        tags: ['有机', '低脂', '健康'],
        openHours: '8:00-21:00',
        priceRange: '30-50元',
        dishes: [
          { name: '牛油果鸡肉沙拉', calories: 420, protein: 38, carbs: 25, fat: 15, price: 45 },
          { name: '三文鱼沙拉', calories: 390, protein: 35, carbs: 20, fat: 18, price: 48 },
          { name: '素食能量碗', calories: 350, protein: 12, carbs: 55, fat: 8, price: 32 }
        ]
      },
      // 便当类
      {
        id: 3,
        name: '健康便当',
        type: '便当',
        lat: 0.005,
        lng: -0.003,
        rating: 4.6,
        avgCalories: 550,
        healthScore: 85,
        tags: ['营养均衡', '便捷', '实惠'],
        openHours: '10:00-21:00',
        priceRange: '20-35元',
        dishes: [
          { name: '鸡胸肉便当', calories: 520, protein: 35, carbs: 55, fat: 15, price: 28 },
          { name: '鱼肉便当', calories: 480, protein: 32, carbs: 50, fat: 12, price: 32 },
          { name: '素食便当', calories: 450, protein: 18, carbs: 65, fat: 10, price: 22 }
        ]
      },
      {
        id: 4,
        name: '营养快餐',
        type: '便当',
        lat: -0.002,
        lng: 0.004,
        rating: 4.5,
        avgCalories: 580,
        healthScore: 82,
        tags: ['快速', '营养', '多样'],
        openHours: '10:30-22:00',
        priceRange: '18-32元',
        dishes: [
          { name: '照烧鸡腿饭', calories: 620, protein: 38, carbs: 68, fat: 18, price: 30 },
          { name: '牛肉饭', calories: 680, protein: 42, carbs: 65, fat: 22, price: 35 },
          { name: '蔬菜鸡肉饭', calories: 520, protein: 35, carbs: 60, fat: 12, price: 26 }
        ]
      },
      // 日料类
      {
        id: 5,
        name: '日式料理',
        type: '日料',
        lat: 0.008,
        lng: 0.005,
        rating: 4.7,
        avgCalories: 600,
        healthScore: 80,
        tags: ['精致', '低油', '海鲜'],
        openHours: '11:00-22:00',
        priceRange: '40-80元',
        dishes: [
          { name: '三文鱼刺身套餐', calories: 580, protein: 38, carbs: 45, fat: 20, price: 68 },
          { name: '寿司拼盘', calories: 620, protein: 25, carbs: 80, fat: 15, price: 58 },
          { name: '照烧鸡肉饭', calories: 650, protein: 35, carbs: 70, fat: 18, price: 45 }
        ]
      },
      {
        id: 6,
        name: '寿司之家',
        type: '日料',
        lat: -0.006,
        lng: 0.007,
        rating: 4.8,
        avgCalories: 550,
        healthScore: 85,
        tags: ['新鲜', '手工', '精选'],
        openHours: '11:30-21:30',
        priceRange: '35-70元',
        dishes: [
          { name: '综合寿司', calories: 520, protein: 28, carbs: 75, fat: 12, price: 52 },
          { name: '刺身拼盘', calories: 480, protein: 42, carbs: 30, fat: 18, price: 78 },
          { name: '鳗鱼饭', calories: 680, protein: 32, carbs: 80, fat: 22, price: 58 }
        ]
      },
      // 中餐类
      {
        id: 7,
        name: '蒸菜馆',
        type: '中餐',
        lat: 0.004,
        lng: -0.005,
        rating: 4.5,
        avgCalories: 500,
        healthScore: 88,
        tags: ['清淡', '少油', '健康'],
        openHours: '10:00-21:00',
        priceRange: '25-45元',
        dishes: [
          { name: '清蒸鲈鱼套餐', calories: 480, protein: 40, carbs: 35, fat: 12, price: 42 },
          { name: '蒸鸡肉蔬菜', calories: 450, protein: 38, carbs: 30, fat: 10, price: 38 },
          { name: '杂粮饭+蒸菜', calories: 520, protein: 20, carbs: 70, fat: 8, price: 32 }
        ]
      },
      {
        id: 8,
        name: '家常菜馆',
        type: '中餐',
        lat: -0.004,
        lng: -0.006,
        rating: 4.4,
        avgCalories: 650,
        healthScore: 70,
        tags: ['家常', '实惠', '分量足'],
        openHours: '10:30-21:30',
        priceRange: '20-40元',
        dishes: [
          { name: '番茄炒蛋套餐', calories: 580, protein: 25, carbs: 75, fat: 18, price: 28 },
          { name: '青椒肉丝', calories: 720, protein: 35, carbs: 68, fat: 28, price: 35 },
          { name: '清炒时蔬', calories: 420, protein: 15, carbs: 60, fat: 12, price: 22 }
        ]
      },
      // 火锅类
      {
        id: 9,
        name: '火锅店',
        type: '火锅',
        lat: 0.010,
        lng: -0.008,
        rating: 4.9,
        avgCalories: 800,
        healthScore: 60,
        tags: ['社交', '多样', '高热量'],
        openHours: '11:00-23:00',
        priceRange: '50-100元',
        dishes: [
          { name: '清汤锅底+海鲜', calories: 650, protein: 45, carbs: 40, fat: 25, price: 88 },
          { name: '麻辣锅底', calories: 950, protein: 35, carbs: 50, fat: 60, price: 78 },
          { name: '菌汤锅底+蔬菜', calories: 550, protein: 25, carbs: 60, fat: 15, price: 68 }
        ]
      },
      // 快餐类
      {
        id: 10,
        name: '快餐店',
        type: '快餐',
        lat: 0.002,
        lng: 0.003,
        rating: 4.2,
        avgCalories: 900,
        healthScore: 45,
        tags: ['快速', '高热量', '油炸'],
        openHours: '7:00-23:00',
        priceRange: '25-50元',
        dishes: [
          { name: '炸鸡套餐', calories: 1200, protein: 40, carbs: 100, fat: 60, price: 45 },
          { name: '汉堡套餐', calories: 1100, protein: 35, carbs: 110, fat: 55, price: 42 },
          { name: '烤鸡腿饭', calories: 850, protein: 38, carbs: 80, fat: 35, price: 35 }
        ]
      },
      {
        id: 11,
        name: '西式快餐',
        type: '快餐',
        lat: -0.003,
        lng: 0.006,
        rating: 4.3,
        avgCalories: 850,
        healthScore: 50,
        tags: ['西式', '快捷', '连锁'],
        openHours: '6:30-23:30',
        priceRange: '20-45元',
        dishes: [
          { name: '鸡肉卷', calories: 780, protein: 32, carbs: 85, fat: 28, price: 32 },
          { name: '牛肉汉堡', calories: 920, protein: 38, carbs: 95, fat: 38, price: 38 },
          { name: '沙拉套餐', calories: 520, protein: 25, carbs: 55, fat: 18, price: 35 }
        ]
      },
      // 素食类
      {
        id: 12,
        name: '素食餐厅',
        type: '素食',
        lat: 0.007,
        lng: -0.004,
        rating: 4.6,
        avgCalories: 450,
        healthScore: 90,
        tags: ['素食', '健康', '低卡'],
        openHours: '10:00-21:00',
        priceRange: '25-45元',
        dishes: [
          { name: '素食拼盘', calories: 420, protein: 18, carbs: 65, fat: 8, price: 38 },
          { name: '豆腐煲', calories: 380, protein: 22, carbs: 45, fat: 12, price: 32 },
          { name: '蔬菜炒饭', calories: 520, protein: 15, carbs: 80, fat: 10, price: 28 }
        ]
      }
    ]
  },

  onLoad() {
    this.calculateCaloriesBudget();
    this.initMapSDK();
    this.loadFavorites();
    
    // 尝试从缓存加载位置
    const cachedLocation = wx.getStorageSync('dining_location');
    const cacheTime = wx.getStorageSync('dining_location_time');
    const now = Date.now();
    
    // 如果缓存位置在5分钟内，使用缓存
    if (cachedLocation && cacheTime && (now - cacheTime < 5 * 60 * 1000)) {
      this.setData({
        location: cachedLocation,
        locationName: '当前位置（缓存）'
      });
      wx.showToast({
        title: '使用缓存位置',
        icon: 'none',
        duration: 1500
      });
    } else {
      // 否则获取新位置
      this.getLocation();
    }
  },

  // 加载收藏的餐馆
  loadFavorites() {
    try {
      const favorites = wx.getStorageSync('favorite_restaurants') || [];
      this.setData({ favoriteRestaurants: favorites });
    } catch (e) {
      console.error('加载收藏失败:', e);
    }
  },

  // 初始化地图SDK
  initMapSDK() {
    if (QQMapWX && mapConfig.qqmapKey !== 'YOUR_TENCENT_MAP_KEY_HERE') {
      try {
        this.setData({
          qqmapsdk: new QQMapWX({
            key: mapConfig.qqmapKey
          }),
          useRealAPI: true
        });
        console.log('腾讯地图SDK初始化成功');
      } catch (e) {
        console.error('腾讯地图SDK初始化失败:', e);
        this.setData({ useRealAPI: false });
      }
    } else {
      console.log('未配置腾讯地图API Key');
      this.setData({ useRealAPI: false });
    }
  },

  // 使用模拟位置（用于开发和测试）- 已禁用，现在使用真实位置
  // useMockLocation() {
  //   // 设置一个模拟的位置（北京市中心）
  //   this.setData({
  //     location: {
  //       latitude: 39.9042,
  //       longitude: 116.4074
  //     },
  //     locationName: '模拟位置（测试用）'
  //   });

  //   wx.showToast({
  //     title: '使用模拟位置',
  //     icon: 'none',
  //     duration: 2000
  //   });

  //   // 自动搜索餐厅
  //   setTimeout(() => {
  //     this.searchNearbyRestaurants();
  //   }, 500);
  // },

  // 计算今日剩余卡路里预算
  calculateCaloriesBudget() {
    const userData = app.getData();
    const target = userData.settings.dailyCalorieTarget || 1500;
    const consumed = app.getTodayCalories();
    const budget = Math.max(0, target - consumed);
    
    this.setData({
      caloriesBudget: budget
    });
  },

  // 获取位置
  getLocation() {
    wx.showLoading({ title: '获取位置中...' });
    
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        wx.hideLoading();
        
        const newLocation = {
          latitude: res.latitude,
          longitude: res.longitude
        };
        
        this.setData({
          location: newLocation,
          locationName: '当前位置'
        });

        // 缓存位置信息
        try {
          wx.setStorageSync('dining_location', newLocation);
          wx.setStorageSync('dining_location_time', Date.now());
        } catch (e) {
          console.error('缓存位置失败:', e);
        }

        // 搜索附近餐厅
        this.searchNearbyRestaurants();
        
        wx.showToast({
          title: '位置获取成功',
          icon: 'success'
        });
      },
      fail: (err) => {
        wx.hideLoading();
        console.error('位置获取失败:', err);
        
        wx.showModal({
          title: '位置获取失败',
          content: '无法获取位置信息，请检查：\n1. 是否允许位置权限\n2. 是否开启GPS定位\n3. 网络连接是否正常',
          confirmText: '重新获取',
          cancelText: '去设置',
          success: (res) => {
            if (res.confirm) {
              this.getLocation();
            } else {
              wx.openSetting({
                success: (settingRes) => {
                  if (settingRes.authSetting['scope.userLocation']) {
                    this.getLocation();
                  }
                }
              });
            }
          }
        });
      }
    });
  },

  // 搜索附近餐厅
  searchNearbyRestaurants() {
    // 防止频繁搜索（3秒内只能搜索一次）
    const now = Date.now();
    if (this.data.isSearching) {
      wx.showToast({
        title: '搜索中，请稍候',
        icon: 'none'
      });
      return;
    }
    
    if (now - this.data.lastSearchTime < 3000) {
      wx.showToast({
        title: '请勿频繁搜索',
        icon: 'none'
      });
      return;
    }

    // 生成缓存key
    const { location, searchRadius, filterType } = this.data;
    const cacheKey = `${location.latitude}_${location.longitude}_${searchRadius}_${filterType}`;
    
    // 检查缓存（5分钟内有效）
    const cached = this.data.searchCache[cacheKey];
    if (cached && (now - cached.time < 5 * 60 * 1000)) {
      this.setData({ 
        restaurants: cached.data,
        lastSearchTime: now
      });
      wx.showToast({
        title: '使用缓存结果',
        icon: 'none',
        duration: 1500
      });
      return;
    }

    this.setData({ 
      isSearching: true,
      lastSearchTime: now
    });

    // 检查是否已配置腾讯地图API
    if (this.data.qqmapsdk && mapConfig.qqmapKey !== 'YOUR_TENCENT_MAP_KEY_HERE') {
      // 使用真实地图API搜索
      this.searchRealRestaurants(cacheKey);
    } else {
      // 未配置API Key，直接使用模拟数据
      console.log('未配置腾讯地图API Key，使用模拟数据');
      this.searchMockRestaurants();
    }
  },

  // 使用真实地图API搜索餐厅
  searchRealRestaurants(cacheKey) {
    wx.showLoading({ title: '搜索餐厅中...' });

    const { location, searchRadius, filterType } = this.data;
    
    if (!location) {
      wx.hideLoading();
      wx.showToast({
        title: '请先获取位置',
        icon: 'none'
      });
      return;
    }

    // 根据筛选类型设置搜索关键词
    let keyword = '餐厅';
    if (filterType !== 'all') {
      const keywordMap = {
        '轻食': '轻食 沙拉',
        '便当': '便当 快餐',
        '日料': '日本料理 寿司',
        '中餐': '中餐 中式',
        '火锅': '火锅',
        '快餐': '快餐',
        '素食': '素食 蔬食'
      };
      keyword = keywordMap[filterType] || '餐厅';
    }

    this.data.qqmapsdk.search({
      keyword: keyword,
      location: {
        latitude: location.latitude,
        longitude: location.longitude
      },
      radius: searchRadius * 1000, // 转换为米
      page_size: 20,
      orderby: '_distance', // 按距离排序
      success: (res) => {
        wx.hideLoading();
        this.setData({ isSearching: false });
        
        if (res.status === 0 && res.data && res.data.length > 0) {
          // 处理真实餐馆数据
          const restaurants = res.data.map((poi, index) => {
            const type = this.categorizeRestaurant(poi.category);
            const distance = (poi._distance / 1000).toFixed(1); // 转换为公里
            
            return {
              id: poi.id || `real_${index}`,
              name: poi.title,
              address: poi.address,
              type: type,
              lat: poi.location.lat,
              lng: poi.location.lng,
              distance: parseFloat(distance),
              rating: this.estimateRating(poi),
              avgCalories: this.estimateCalories(type),
              healthScore: this.estimateHealthScore(type),
              tags: this.generateTags(type),
              openHours: '营业中',
              priceRange: this.estimatePriceRange(type),
              dishes: this.generateDishes(type),
              isReal: true, // 标记为真实数据
              tel: poi.tel || '',
              actualLat: poi.location.lat,
              actualLng: poi.location.lng,
              isFavorite: this.checkIsFavorite(poi.id || `real_${index}`)
            };
          });

          // 计算推荐分数并排序
          const processedRestaurants = restaurants.map(r => ({
            ...r,
            score: this.calculateRestaurantScore(r, this.data.caloriesBudget)
          }));

          const sorted = this.sortRestaurants(processedRestaurants);

          // 缓存搜索结果
          const newCache = { ...this.data.searchCache };
          newCache[cacheKey] = {
            data: sorted,
            time: Date.now()
          };

          this.setData({ 
            restaurants: sorted,
            searchCache: newCache
          });

          wx.showToast({
            title: `找到${sorted.length}家餐厅`,
            icon: 'success'
          });
        } else {
          wx.showModal({
            title: '未找到餐厅',
            content: `附近${searchRadius}公里内没有找到符合条件的餐厅\n\n建议：\n1. 扩大搜索范围\n2. 更改筛选条件\n3. 使用模拟数据测试`,
            confirmText: '使用模拟数据',
            cancelText: '取消',
            success: (modalRes) => {
              if (modalRes.confirm) {
                this.searchMockRestaurants();
              }
            }
          });
        }
      },
      fail: (error) => {
        wx.hideLoading();
        this.setData({ isSearching: false });
        console.error('搜索失败:', error);
        
        wx.showModal({
          title: '搜索失败',
          content: '地图API调用失败，是否使用模拟数据？',
          confirmText: '使用模拟数据',
          success: (res) => {
            if (res.confirm) {
              this.searchMockRestaurants();
            }
          }
        });
      }
    });
  },

  // 分类餐馆类型
  categorizeRestaurant(category) {
    if (!category) return '中餐';
    
    const categoryLower = category.toLowerCase();
    
    if (categoryLower.includes('轻食') || categoryLower.includes('沙拉')) {
      return '轻食';
    } else if (categoryLower.includes('便当') || categoryLower.includes('盒饭')) {
      return '便当';
    } else if (categoryLower.includes('日') || categoryLower.includes('寿司') || categoryLower.includes('刺身')) {
      return '日料';
    } else if (categoryLower.includes('火锅')) {
      return '火锅';
    } else if (categoryLower.includes('快餐') || categoryLower.includes('汉堡') || categoryLower.includes('炸鸡')) {
      return '快餐';
    } else if (categoryLower.includes('素食') || categoryLower.includes('蔬食')) {
      return '素食';
    } else {
      return '中餐';
    }
  },

  // 估算评分
  estimateRating(poi) {
    // 基于距离和其他因素估算评分
    return (4.0 + Math.random() * 1.0).toFixed(1);
  },

  // 估算平均卡路里
  estimateCalories(type) {
    const calorieMap = {
      '轻食': 400,
      '便当': 550,
      '日料': 600,
      '中餐': 650,
      '火锅': 800,
      '快餐': 900,
      '素食': 450
    };
    return calorieMap[type] || 600;
  },

  // 估算健康分数
  estimateHealthScore(type) {
    const healthMap = {
      '轻食': 95,
      '素食': 90,
      '便当': 85,
      '日料': 80,
      '中餐': 70,
      '火锅': 60,
      '快餐': 45
    };
    return healthMap[type] || 70;
  },

  // 生成标签
  generateTags(type) {
    const tagMap = {
      '轻食': ['低卡', '高蛋白', '新鲜'],
      '便当': ['营养均衡', '便捷', '实惠'],
      '日料': ['精致', '低油', '海鲜'],
      '中餐': ['家常', '实惠', '分量足'],
      '火锅': ['社交', '多样', '高热量'],
      '快餐': ['快速', '高热量', '油炸'],
      '素食': ['素食', '健康', '低卡']
    };
    return tagMap[type] || ['美味', '实惠'];
  },

  // 估算价格范围
  estimatePriceRange(type) {
    const priceMap = {
      '轻食': '25-45元',
      '便当': '20-35元',
      '日料': '40-80元',
      '中餐': '20-40元',
      '火锅': '50-100元',
      '快餐': '25-50元',
      '素食': '25-45元'
    };
    return priceMap[type] || '30-50元';
  },

  // 生成推荐菜品
  generateDishes(type) {
    const dishMap = {
      '轻食': [
        { name: '烤鸡胸沙拉', calories: 380, protein: 45, carbs: 20, fat: 12, price: 38 },
        { name: '金枪鱼沙拉', calories: 350, protein: 40, carbs: 18, fat: 10, price: 42 },
        { name: '藜麦蔬菜碗', calories: 420, protein: 15, carbs: 60, fat: 8, price: 35 }
      ],
      '便当': [
        { name: '鸡胸肉便当', calories: 520, protein: 35, carbs: 55, fat: 15, price: 28 },
        { name: '鱼肉便当', calories: 480, protein: 32, carbs: 50, fat: 12, price: 32 },
        { name: '素食便当', calories: 450, protein: 18, carbs: 65, fat: 10, price: 22 }
      ],
      '日料': [
        { name: '三文鱼刺身套餐', calories: 580, protein: 38, carbs: 45, fat: 20, price: 68 },
        { name: '寿司拼盘', calories: 620, protein: 25, carbs: 80, fat: 15, price: 58 },
        { name: '照烧鸡肉饭', calories: 650, protein: 35, carbs: 70, fat: 18, price: 45 }
      ],
      '中餐': [
        { name: '清蒸鲈鱼套餐', calories: 480, protein: 40, carbs: 35, fat: 12, price: 42 },
        { name: '番茄炒蛋套餐', calories: 580, protein: 25, carbs: 75, fat: 18, price: 28 },
        { name: '清炒时蔬', calories: 420, protein: 15, carbs: 60, fat: 12, price: 22 }
      ],
      '火锅': [
        { name: '清汤锅底+海鲜', calories: 650, protein: 45, carbs: 40, fat: 25, price: 88 },
        { name: '麻辣锅底', calories: 950, protein: 35, carbs: 50, fat: 60, price: 78 },
        { name: '菌汤锅底+蔬菜', calories: 550, protein: 25, carbs: 60, fat: 15, price: 68 }
      ],
      '快餐': [
        { name: '烤鸡腿饭', calories: 850, protein: 38, carbs: 80, fat: 35, price: 35 },
        { name: '鸡肉卷', calories: 780, protein: 32, carbs: 85, fat: 28, price: 32 },
        { name: '沙拉套餐', calories: 520, protein: 25, carbs: 55, fat: 18, price: 35 }
      ],
      '素食': [
        { name: '素食拼盘', calories: 420, protein: 18, carbs: 65, fat: 8, price: 38 },
        { name: '豆腐煲', calories: 380, protein: 22, carbs: 45, fat: 12, price: 32 },
        { name: '蔬菜炒饭', calories: 520, protein: 15, carbs: 80, fat: 10, price: 28 }
      ]
    };
    return dishMap[type] || [
      { name: '推荐套餐', calories: 600, protein: 30, carbs: 60, fat: 20, price: 35 }
    ];
  },

  // 使用模拟数据搜索（原有逻辑）
  searchMockRestaurants() {
    wx.showLoading({ title: '搜索餐厅中...' });

    setTimeout(() => {
      const { restaurantDatabase, caloriesBudget, location, searchRadius, filterType } = this.data;
      
      if (!location) {
        wx.hideLoading();
        wx.showToast({
          title: '请先获取位置',
          icon: 'none'
        });
        return;
      }

      // 计算每个餐厅的实际距离
      let restaurants = restaurantDatabase.map(r => {
        const distance = this.calculateDistance(
          location.latitude,
          location.longitude,
          location.latitude + r.lat,
          location.longitude + r.lng
        );
        
        return {
          ...r,
          distance: distance,
          actualLat: location.latitude + r.lat,
          actualLng: location.longitude + r.lng
        };
      });

      // 筛选：在搜索半径内
      restaurants = restaurants.filter(r => r.distance <= searchRadius);

      // 筛选：按类型
      if (filterType !== 'all') {
        restaurants = restaurants.filter(r => r.type === filterType);
      }

      // 计算推荐分数
      restaurants = restaurants.map(r => ({
        ...r,
        score: this.calculateRestaurantScore(r, caloriesBudget)
      }));

      // 排序
      restaurants = this.sortRestaurants(restaurants);

      wx.hideLoading();
      
      if (restaurants.length === 0) {
        wx.showModal({
          title: '未找到餐厅',
          content: `附近${searchRadius}公里内没有找到符合条件的餐厅\n\n建议：\n1. 扩大搜索范围\n2. 更改筛选条件`,
          showCancel: false
        });
      } else {
        wx.showToast({
          title: `找到${restaurants.length}家餐厅`,
          icon: 'success'
        });
      }
      
      this.setData({
        restaurants
      });
    }, 1500);
  },

  // 计算两点之间的距离（公里）
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // 地球半径（公里）
    const dLat = this.deg2rad(lat2 - lat1);
    const dLng = this.deg2rad(lng2 - lng1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return Math.round(distance * 10) / 10; // 保留一位小数
  },

  deg2rad(deg) {
    return deg * (Math.PI / 180);
  },

  // 排序餐厅
  sortRestaurants(restaurants) {
    const { sortBy } = this.data;
    
    switch (sortBy) {
      case 'distance':
        return restaurants.sort((a, b) => a.distance - b.distance);
      case 'health':
        return restaurants.sort((a, b) => b.healthScore - a.healthScore);
      case 'rating':
        return restaurants.sort((a, b) => b.rating - a.rating);
      case 'recommend':
      default:
        return restaurants.sort((a, b) => b.score - a.score);
    }
  },

  // 更改搜索半径
  changeSearchRadius(e) {
    const radius = parseFloat(e.detail.value);
    this.setData({
      searchRadius: radius
    });
    
    if (this.data.location) {
      this.searchNearbyRestaurants();
    }
  },

  // 更改餐厅类型筛选
  changeFilterType(e) {
    const type = e.detail.value;
    this.setData({
      filterType: type
    });
    
    if (this.data.location) {
      this.searchNearbyRestaurants();
    }
  },

  // 更改排序方式
  changeSortBy(e) {
    const sortBy = e.detail.value;
    this.setData({
      sortBy: sortBy
    });
    
    if (this.data.restaurants.length > 0) {
      const sorted = this.sortRestaurants([...this.data.restaurants]);
      this.setData({
        restaurants: sorted
      });
    }
  },

  // 计算餐厅推荐分数
  calculateRestaurantScore(restaurant, budget) {
    let score = 0;

    // 健康分数（40分）
    score += restaurant.healthScore * 0.4;

    // 距离分数（30分）- 越近越好
    const distanceScore = Math.max(0, 30 - restaurant.distance * 10);
    score += distanceScore;

    // 卡路里匹配度（20分）
    if (budget > 0) {
      const calorieDiff = Math.abs(restaurant.avgCalories - budget);
      const calorieScore = Math.max(0, 20 - calorieDiff / 50);
      score += calorieScore;
    } else {
      score += 10; // 预算不足时降低分数
    }

    // 评分（10分）
    score += restaurant.rating * 2;

    return Math.round(score);
  },

  // 选择餐厅
  selectRestaurant(e) {
    const restaurant = e.currentTarget.dataset.restaurant;
    
    this.setData({
      selectedRestaurant: restaurant
    });

    wx.showModal({
      title: restaurant.name,
      content: `类型：${restaurant.type}\n距离：${restaurant.distance}km\n评分：${restaurant.rating}⭐\n平均热量：${restaurant.avgCalories}卡\n健康指数：${restaurant.healthScore}分\n\n推荐理由：${this.getRecommendationReason(restaurant)}`,
      confirmText: '查看菜品',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          this.showDishes(restaurant);
        }
      }
    });
  },

  // 获取推荐理由
  getRecommendationReason(restaurant) {
    const reasons = [];
    
    if (restaurant.healthScore >= 85) {
      reasons.push('健康指数高');
    }
    if (restaurant.distance < 1) {
      reasons.push('距离近');
    }
    if (restaurant.avgCalories < 600) {
      reasons.push('低卡路里');
    }
    if (restaurant.rating >= 4.5) {
      reasons.push('评分高');
    }

    return reasons.join('、') || '综合推荐';
  },

  // 显示菜品
  showDishes(restaurant) {
    const { caloriesBudget } = this.data;
    const dishes = restaurant.dishes.map(d => ({
      ...d,
      suitable: d.calories <= caloriesBudget
    }));

    let content = '推荐菜品：\n\n';
    dishes.forEach((dish, index) => {
      const mark = dish.suitable ? '✅' : '⚠️';
      content += `${mark} ${dish.name}\n`;
      content += `   ${dish.calories}卡 | 蛋白${dish.protein}g\n\n`;
    });

    if (caloriesBudget > 0) {
      content += `\n💡 今日剩余预算：${caloriesBudget}卡`;
    } else {
      content += `\n⚠️ 今日预算已用完，建议选择低卡菜品`;
    }

    wx.showModal({
      title: '菜品推荐',
      content: content,
      confirmText: '获取建议',
      cancelText: '返回',
      success: (res) => {
        if (res.confirm) {
          this.generatePreAdvice(restaurant);
        }
      }
    });
  },

  // 生成餐前建议
  generatePreAdvice(restaurant) {
    const { caloriesBudget, mealTypes, mealType } = this.data;
    const userData = app.getData();
    
    const advice = {
      restaurant: restaurant.name,
      mealType: mealTypes[mealType],
      budget: caloriesBudget,
      tips: [],
      dishRecommendations: [],
      avoidItems: []
    };

    // 基于餐厅类型的建议
    if (restaurant.type === '火锅') {
      advice.tips.push('选择清汤锅底，避免麻辣锅底');
      advice.tips.push('多点蔬菜和菌菇类');
      advice.tips.push('肉类选择瘦肉，避免肥牛肥羊');
      advice.tips.push('少蘸酱料，可用醋和葱花代替');
      advice.avoidItems.push('麻辣锅底', '肥牛', '午餐肉', '油条', '芝麻酱');
    } else if (restaurant.type === '快餐') {
      advice.tips.push('避免油炸食品');
      advice.tips.push('选择烤制而非炸制');
      advice.tips.push('不要点套餐，单点更健康');
      advice.tips.push('饮料选择无糖或水');
      advice.avoidItems.push('炸鸡', '薯条', '可乐', '奶昔');
    } else if (restaurant.type === '日料') {
      advice.tips.push('刺身是很好的选择');
      advice.tips.push('寿司适量，注意米饭量');
      advice.tips.push('避免天妇罗等油炸类');
      advice.tips.push('味增汤可以增加饱腹感');
      advice.avoidItems.push('天妇罗', '炸虾', '甜味寿司');
    } else {
      advice.tips.push('选择清淡烹饪方式');
      advice.tips.push('多吃蔬菜和蛋白质');
      advice.tips.push('控制主食量');
      advice.tips.push('细嚼慢咽，吃到7分饱');
    }

    // 推荐菜品
    const suitableDishes = restaurant.dishes
      .filter(d => d.calories <= caloriesBudget + 100)
      .sort((a, b) => a.calories - b.calories);
    
    advice.dishRecommendations = suitableDishes.slice(0, 3);

    // 餐前准备
    advice.preparation = [
      '餐前30分钟喝一杯水',
      '如果很饿，可以先吃点水果垫底',
      '提前查看菜单，做好选择',
      '告诉自己吃到7-8分饱就停'
    ];

    this.setData({
      preAdvice: advice,
      showPreAdvice: true
    });

    this.showPreAdviceModal(advice);
  },

  // 显示餐前建议弹窗
  showPreAdviceModal(advice) {
    let content = `🍽️ 餐前准备：\n`;
    advice.preparation.forEach((tip, i) => {
      content += `${i + 1}. ${tip}\n`;
    });
    
    content += `\n💡 用餐建议：\n`;
    advice.tips.forEach((tip, i) => {
      content += `${i + 1}. ${tip}\n`;
    });

    if (advice.avoidItems.length > 0) {
      content += `\n⚠️ 避免：${advice.avoidItems.join('、')}`;
    }

    wx.showModal({
      title: '餐前建议',
      content: content,
      confirmText: '知道了',
      showCancel: false
    });
  },

  // 餐后记录
  recordMeal() {
    const { selectedRestaurant } = this.data;
    
    if (!selectedRestaurant) {
      wx.showToast({
        title: '请先选择餐厅',
        icon: 'none'
      });
      return;
    }

    wx.showModal({
      title: '餐后记录',
      content: '请选择你吃的菜品，以便记录卡路里',
      confirmText: '去记录',
      success: (res) => {
        if (res.confirm) {
          this.showDishSelection();
        }
      }
    });
  },

  // 显示菜品选择
  showDishSelection() {
    const { selectedRestaurant } = this.data;
    const items = selectedRestaurant.dishes.map(d => d.name);
    
    wx.showActionSheet({
      itemList: items,
      success: (res) => {
        const dish = selectedRestaurant.dishes[res.tapIndex];
        this.confirmMealRecord(dish);
      }
    });
  },

  // 确认餐食记录
  confirmMealRecord(dish) {
    wx.showModal({
      title: '确认记录',
      content: `${dish.name}\n卡路里：${dish.calories}卡\n蛋白质：${dish.protein}g\n碳水：${dish.carbs}g\n脂肪：${dish.fat}g`,
      confirmText: '确认',
      success: (res) => {
        if (res.confirm) {
          // 添加到饮食记录
          app.addFoodLog({
            name: dish.name,
            calories: dish.calories,
            protein: dish.protein,
            carbs: dish.carbs,
            fat: dish.fat,
            source: 'dining-assistant'
          });

          wx.showToast({
            title: '记录成功',
            icon: 'success'
          });

          // 生成餐后建议
          this.generatePostAdvice(dish);
        }
      }
    });
  },

  // 生成餐后建议
  generatePostAdvice(dish) {
    const userData = app.getData();
    const todayCalories = app.getTodayCalories();
    const target = userData.settings.dailyCalorieTarget || 1500;
    const remaining = target - todayCalories;

    const advice = {
      dish: dish.name,
      calories: dish.calories,
      remaining: remaining,
      tips: [],
      exercise: null
    };

    // 基于剩余预算的建议
    if (remaining < 0) {
      advice.tips.push('⚠️ 今日已超出预算，建议增加运动');
      advice.tips.push('晚餐选择清淡食物或减少分量');
      advice.tips.push('多喝水，促进代谢');
      
      // 推荐运动
      const excess = Math.abs(remaining);
      advice.exercise = {
        type: '快走',
        duration: Math.ceil(excess / 5), // 约5卡/分钟
        calories: excess
      };
    } else if (remaining < 300) {
      advice.tips.push('今日预算所剩不多');
      advice.tips.push('下一餐选择低卡食物');
      advice.tips.push('可以吃些蔬菜和水果');
    } else {
      advice.tips.push('✅ 预算控制良好');
      advice.tips.push('继续保持健康饮食');
      advice.tips.push('适量运动更佳');
    }

    // 消化建议
    advice.tips.push('餐后不要立即坐下或躺下');
    advice.tips.push('可以散步15-30分钟助消化');
    advice.tips.push('2小时内避免剧烈运动');

    this.setData({
      postAdvice: advice,
      showPostAdvice: true
    });

    this.showPostAdviceModal(advice);
  },

  // 显示餐后建议弹窗
  showPostAdviceModal(advice) {
    let content = `📊 本餐摄入：${advice.calories}卡\n`;
    content += `💰 剩余预算：${advice.remaining > 0 ? advice.remaining : 0}卡\n\n`;
    
    content += `💡 餐后建议：\n`;
    advice.tips.forEach((tip, i) => {
      content += `${i + 1}. ${tip}\n`;
    });

    if (advice.exercise) {
      content += `\n🏃 建议运动：\n`;
      content += `${advice.exercise.type} ${advice.exercise.duration}分钟\n`;
      content += `可消耗约${advice.exercise.calories}卡`;
    }

    wx.showModal({
      title: '餐后建议',
      content: content,
      confirmText: '知道了',
      showCancel: false
    });
  },

  // 餐次选择
  onMealTypeChange(e) {
    this.setData({
      mealType: e.detail.value
    });
  },

  // 打开地图导航
  openMap(e) {
    const restaurant = e.currentTarget.dataset.restaurant;
    
    if (!restaurant) {
      wx.showToast({
        title: '餐厅信息错误',
        icon: 'none'
      });
      return;
    }

    // 使用餐厅的实际坐标打开微信内置地图
    wx.openLocation({
      latitude: restaurant.actualLat || restaurant.lat,
      longitude: restaurant.actualLng || restaurant.lng,
      name: restaurant.name,
      address: restaurant.address || `${restaurant.type} | 距离${restaurant.distance}km`,
      scale: 15,
      success: () => {
        console.log('导航打开成功');
      },
      fail: (err) => {
        console.error('导航打开失败:', err);
        wx.showToast({
          title: '导航打开失败',
          icon: 'none'
        });
      }
    });
  },

  // 检查是否已收藏
  checkIsFavorite(restaurantId) {
    return this.data.favoriteRestaurants.some(r => r.id === restaurantId);
  },

  // 切换收藏状态
  toggleFavorite(e) {
    const restaurant = e.currentTarget.dataset.restaurant;
    const favorites = [...this.data.favoriteRestaurants];
    const index = favorites.findIndex(r => r.id === restaurant.id);
    
    if (index > -1) {
      // 取消收藏
      favorites.splice(index, 1);
      wx.showToast({
        title: '已取消收藏',
        icon: 'success'
      });
    } else {
      // 添加收藏
      favorites.push({
        id: restaurant.id,
        name: restaurant.name,
        address: restaurant.address,
        type: restaurant.type,
        distance: restaurant.distance,
        time: Date.now()
      });
      wx.showToast({
        title: '收藏成功',
        icon: 'success'
      });
    }
    
    // 保存到本地
    try {
      wx.setStorageSync('favorite_restaurants', favorites);
      this.setData({ favoriteRestaurants: favorites });
      
      // 更新餐馆列表的收藏状态
      const updatedRestaurants = this.data.restaurants.map(r => ({
        ...r,
        isFavorite: favorites.some(f => f.id === r.id)
      }));
      this.setData({ restaurants: updatedRestaurants });
    } catch (e) {
      console.error('保存收藏失败:', e);
      wx.showToast({
        title: '保存失败',
        icon: 'none'
      });
    }
  },

  // 查看收藏列表
  viewFavorites() {
    const favorites = this.data.favoriteRestaurants;
    
    if (favorites.length === 0) {
      wx.showToast({
        title: '暂无收藏',
        icon: 'none'
      });
      return;
    }
    
    const items = favorites.map(r => `${r.name} (${r.type})`);
    
    wx.showActionSheet({
      itemList: items,
      success: (res) => {
        const favorite = favorites[res.tapIndex];
        wx.showModal({
          title: favorite.name,
          content: `类型：${favorite.type}\n地址：${favorite.address || '未知'}\n距离：${favorite.distance}km`,
          confirmText: '取消收藏',
          cancelText: '关闭',
          success: (modalRes) => {
            if (modalRes.confirm) {
              this.removeFavorite(favorite.id);
            }
          }
        });
      }
    });
  },

  // 移除收藏
  removeFavorite(restaurantId) {
    const favorites = this.data.favoriteRestaurants.filter(r => r.id !== restaurantId);
    
    try {
      wx.setStorageSync('favorite_restaurants', favorites);
      this.setData({ favoriteRestaurants: favorites });
      
      // 更新餐馆列表的收藏状态
      const updatedRestaurants = this.data.restaurants.map(r => ({
        ...r,
        isFavorite: favorites.some(f => f.id === r.id)
      }));
      this.setData({ restaurants: updatedRestaurants });
      
      wx.showToast({
        title: '已取消收藏',
        icon: 'success'
      });
    } catch (e) {
      console.error('移除收藏失败:', e);
    }
  },

  // 拨打电话
  callRestaurant(e) {
    const restaurant = e.currentTarget.dataset.restaurant;
    
    if (!restaurant.tel) {
      wx.showToast({
        title: '暂无电话信息',
        icon: 'none'
      });
      return;
    }

    wx.makePhoneCall({
      phoneNumber: restaurant.tel,
      success: () => {
        console.log('拨打电话成功');
      },
      fail: (err) => {
        console.error('拨打电话失败:', err);
      }
    });
  }
});
