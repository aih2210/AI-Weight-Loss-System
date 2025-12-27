// pages/recipe-generator/recipe-generator.js
const app = getApp();
const RecipePersonalizer = require('../../utils/recipePersonalizer.js');

Page({
  data: {
    preferences: '',
    calories: '',
    mealType: 0,
    mealTypes: ['早餐', '午餐', '晚餐', '加餐'],
    generating: false,
    recipes: [],
    personalizer: null,
    // 食谱数据库
    recipeDatabase: [
      {
        name: '烤鸡胸肉沙拉',
        calories: 380,
        protein: 45,
        carbs: 20,
        fat: 12,
        time: 25,
        difficulty: '简单',
        servings: 1,
        ingredients: [
          { name: '鸡胸肉', amount: '200g', note: '去皮' },
          { name: '生菜', amount: '100g', note: '洗净撕碎' },
          { name: '番茄', amount: '50g', note: '切块' },
          { name: '黄瓜', amount: '50g', note: '切片' },
          { name: '橄榄油', amount: '10ml', note: '特级初榨' },
          { name: '柠檬汁', amount: '适量', note: '新鲜柠檬' },
          { name: '黑胡椒', amount: '适量', note: '现磨' },
          { name: '盐', amount: '2g', note: '' }
        ],
        steps: [
          {
            step: 1,
            title: '腌制鸡胸肉',
            content: '鸡胸肉洗净擦干，用刀背轻轻拍打使其松软。撒上盐和黑胡椒，用手按摩均匀，腌制10分钟。',
            time: '10分钟',
            tips: '拍打可以让鸡肉更嫩，腌制时间不要太长'
          },
          {
            step: 2,
            title: '烤制鸡胸肉',
            content: '烤箱预热至200度。将腌好的鸡胸肉放在烤盘上，刷一层薄薄的橄榄油。烤15分钟，中途翻面一次。',
            time: '15分钟',
            tips: '用筷子戳一下，流出清汁即熟透'
          },
          {
            step: 3,
            title: '准备蔬菜',
            content: '生菜撕成小块，番茄切块，黄瓜切薄片。所有蔬菜用冷水冲洗，沥干水分。',
            time: '5分钟',
            tips: '蔬菜要彻底沥干，否则影响口感'
          },
          {
            step: 4,
            title: '切片摆盘',
            content: '鸡胸肉稍微放凉后，斜刀切成薄片。将蔬菜铺在盘底，鸡肉片摆在上面。',
            time: '3分钟',
            tips: '斜切可以让鸡肉看起来更多'
          },
          {
            step: 5,
            title: '调味完成',
            content: '淋上橄榄油和新鲜柠檬汁，撒少许黑胡椒和盐。轻轻拌匀即可享用。',
            time: '2分钟',
            tips: '柠檬汁要现挤，味道更鲜美'
          }
        ],
        tags: ['高蛋白', '低脂', '减脂'],
        mealType: '午餐',
        cookingTips: [
          '鸡胸肉不要烤太久，否则会变柴',
          '可以用空气炸锅代替烤箱，180度15分钟',
          '蔬菜可以根据喜好替换，如紫甘蓝、彩椒等'
        ],
        nutritionHighlights: [
          '高蛋白低脂，非常适合减脂期',
          '富含维生素和膳食纤维',
          '饱腹感强，不易饿'
        ]
      },
      {
        name: '燕麦香蕉早餐碗',
        calories: 320,
        protein: 12,
        carbs: 55,
        fat: 8,
        time: 10,
        difficulty: '简单',
        servings: 1,
        ingredients: [
          { name: '即食燕麦', amount: '50g', note: '或快熟燕麦' },
          { name: '香蕉', amount: '1根', note: '中等大小' },
          { name: '牛奶', amount: '200ml', note: '可用脱脂奶' },
          { name: '蜂蜜', amount: '10g', note: '约1小勺' },
          { name: '坚果碎', amount: '20g', note: '杏仁或核桃' },
          { name: '蓝莓', amount: '适量', note: '可选装饰' }
        ],
        steps: [
          {
            step: 1,
            title: '煮燕麦',
            content: '小锅中倒入牛奶，中火加热至微沸。加入燕麦，转小火煮5分钟，期间不断搅拌防止粘锅。',
            time: '5分钟',
            tips: '即食燕麦煮3分钟即可，快熟燕麦需要5分钟'
          },
          {
            step: 2,
            title: '准备配料',
            content: '香蕉去皮切成薄片。坚果用刀背压碎或切碎。如果有蓝莓，洗净备用。',
            time: '2分钟',
            tips: '香蕉不要切太厚，薄片更容易入味'
          },
          {
            step: 3,
            title: '盛碗摆盘',
            content: '将煮好的燕麦盛入碗中，稍微放凉1分钟。在表面整齐地摆上香蕉片。',
            time: '1分钟',
            tips: '可以摆成花朵或螺旋形状，更美观'
          },
          {
            step: 4,
            title: '添加配料',
            content: '在香蕉片周围撒上坚果碎，点缀几颗蓝莓。最后淋上蜂蜜。',
            time: '1分钟',
            tips: '蜂蜜可以画圈淋，更有艺术感'
          },
          {
            step: 5,
            title: '完成享用',
            content: '趁温热享用，口感最佳。可以用勺子从底部舀起，每口都有燕麦、香蕉和坚果。',
            time: '1分钟',
            tips: '不要放太久，燕麦会吸收水分变稠'
          }
        ],
        tags: ['高纤维', '饱腹', '营养'],
        mealType: '早餐',
        cookingTips: [
          '可以前一晚泡好燕麦，早上加热更快',
          '牛奶可以替换成豆奶、杏仁奶',
          '不喜欢甜可以不加蜂蜜，香蕉本身就有甜味'
        ],
        nutritionHighlights: [
          '富含膳食纤维，促进肠道健康',
          '香蕉提供钾元素，预防抽筋',
          '坚果提供优质脂肪，增加饱腹感'
        ]
      },
      {
        name: '清蒸鲈鱼配西兰花',
        calories: 280,
        protein: 38,
        carbs: 15,
        fat: 8,
        time: 20,
        difficulty: '中等',
        servings: 1,
        ingredients: [
          { name: '鲈鱼', amount: '1条', note: '约300g' },
          { name: '西兰花', amount: '150g', note: '切小朵' },
          { name: '姜', amount: '3片', note: '切丝' },
          { name: '葱', amount: '2根', note: '切段' },
          { name: '蒸鱼豉油', amount: '20ml', note: '约2勺' },
          { name: '料酒', amount: '10ml', note: '去腥' },
          { name: '食用油', amount: '5ml', note: '热油浇汁用' }
        ],
        steps: [
          {
            step: 1,
            title: '处理鲈鱼',
            content: '鲈鱼去鳞去内脏洗净，用厨房纸擦干水分。在鱼身两面各斜切3刀（约1cm深），这样更容易入味和蒸熟。',
            time: '5分钟',
            tips: '刀口不要切太深，避免鱼肉散开'
          },
          {
            step: 2,
            title: '腌制去腥',
            content: '在鱼身内外均匀抹上料酒和少许盐，腌制5分钟。在鱼肚子里和刀口处塞入姜片和葱段。',
            time: '5分钟',
            tips: '料酒可以有效去除鱼腥味'
          },
          {
            step: 3,
            title: '蒸鱼',
            content: '蒸锅水烧开后，将鱼放入蒸盘，大火蒸8-10分钟（根据鱼的大小调整）。用筷子能轻松插入鱼肉即熟透。',
            time: '10分钟',
            tips: '水一定要烧开后再放鱼，这样鱼肉更嫩'
          },
          {
            step: 4,
            title: '焯西兰花',
            content: '趁蒸鱼的时间，烧一锅水，加少许盐和油。水开后放入西兰花焯2分钟，捞出沥干。',
            time: '3分钟',
            tips: '加油可以让西兰花保持翠绿色'
          },
          {
            step: 5,
            title: '调味摆盘',
            content: '鱼蒸好后倒掉盘中的水，去掉姜葱。摆上西兰花，淋上蒸鱼豉油。烧热5ml油，浇在鱼身上激发香味。',
            time: '2分钟',
            tips: '热油一定要烧到冒烟，浇上去才会滋滋作响'
          }
        ],
        tags: ['高蛋白', '低脂', '清淡'],
        mealType: '晚餐',
        cookingTips: [
          '选择新鲜的鲈鱼，眼睛明亮、鱼鳃鲜红',
          '蒸鱼时间不要太长，否则肉质会老',
          '可以用微波炉蒸，高火8分钟'
        ],
        nutritionHighlights: [
          '鲈鱼富含优质蛋白质和DHA',
          '西兰花含丰富维生素C和膳食纤维',
          '低脂低卡，非常适合晚餐'
        ]
      },
      {
        name: '牛油果鸡蛋三明治',
        calories: 420,
        protein: 22,
        carbs: 38,
        fat: 20,
        time: 15,
        difficulty: '简单',
        ingredients: ['全麦面包2片', '牛油果半个', '鸡蛋2个', '番茄1个', '生菜适量'],
        steps: ['1. 鸡蛋煎至半熟', '2. 牛油果捣成泥', '3. 面包烤至微黄', '4. 依次铺上牛油果、鸡蛋、番茄、生菜', '5. 盖上另一片面包'],
        tags: ['营养均衡', '饱腹', '美味'],
        mealType: '早餐'
      },
      {
        name: '虾仁豆腐汤',
        calories: 180,
        protein: 25,
        carbs: 8,
        fat: 5,
        time: 15,
        difficulty: '简单',
        ingredients: ['虾仁150g', '嫩豆腐200g', '香菇50g', '葱花适量', '盐适量'],
        steps: ['1. 虾仁去虾线洗净', '2. 豆腐切块，香菇切片', '3. 水烧开后放入豆腐和香菇', '4. 煮5分钟后加入虾仁', '5. 调味撒葱花'],
        tags: ['低卡', '高蛋白', '清淡'],
        mealType: '晚餐'
      },
      {
        name: '希腊酸奶水果杯',
        calories: 220,
        protein: 15,
        carbs: 30,
        fat: 6,
        time: 5,
        difficulty: '简单',
        ingredients: ['希腊酸奶200g', '蓝莓50g', '草莓50g', '燕麦片20g', '蜂蜜10g'],
        steps: ['1. 酸奶倒入杯中', '2. 水果洗净切块', '3. 铺上水果', '4. 撒上燕麦片', '5. 淋上蜂蜜'],
        tags: ['低脂', '高蛋白', '快手'],
        mealType: '加餐'
      },
      {
        name: '糙米鸡肉饭团',
        calories: 350,
        protein: 28,
        carbs: 45,
        fat: 8,
        time: 30,
        difficulty: '中等',
        ingredients: ['糙米100g', '鸡胸肉100g', '胡萝卜50g', '海苔2片', '酱油适量'],
        steps: ['1. 糙米煮熟', '2. 鸡肉切丁炒熟', '3. 胡萝卜切丁焯水', '4. 所有材料混合', '5. 用海苔包成饭团'],
        tags: ['便携', '营养', '饱腹'],
        mealType: '午餐'
      },
      {
        name: '蔬菜蛋白奶昔',
        calories: 200,
        protein: 20,
        carbs: 25,
        fat: 4,
        time: 5,
        difficulty: '简单',
        ingredients: ['菠菜50g', '香蕉1根', '蛋白粉30g', '杏仁奶250ml', '冰块适量'],
        steps: ['1. 所有材料放入搅拌机', '2. 高速搅拌1分钟', '3. 倒入杯中即可'],
        tags: ['高蛋白', '快手', '营养'],
        mealType: '加餐'
      }
    ]
  },

  onLoad() {
    this.data.personalizer = new RecipePersonalizer();
    this.loadRecipes();
  },

  loadRecipes() {
    const userData = app.getData();
    this.setData({
      recipes: userData.recipes || []
    });
  },

  onPreferencesInput(e) {
    this.setData({
      preferences: e.detail.value
    });
  },

  onCaloriesInput(e) {
    this.setData({
      calories: e.detail.value
    });
  },

  onMealTypeChange(e) {
    this.setData({
      mealType: e.detail.value
    });
  },

  generateRecipe() {
    const { calories, mealTypes, mealType, recipeDatabase, personalizer } = this.data;
    
    this.setData({
      generating: true
    });

    wx.showLoading({
      title: 'AI个性化生成中...'
    });

    // 使用个性化推荐系统
    setTimeout(() => {
      const targetCalories = calories ? parseInt(calories) : null;
      const mealTypeName = mealTypes[mealType];
      
      // 获取个性化推荐
      let personalizedRecipes = personalizer.getPersonalizedRecipes(
        recipeDatabase,
        mealTypeName,
        targetCalories
      );

      // 选择前2个最佳推荐
      const selectedRecipes = personalizedRecipes.slice(0, 2).map((recipe, index) => ({
        ...recipe,
        id: Date.now() + index,
        generatedAt: new Date().toLocaleString(),
        isPersonalized: true
      }));

      wx.hideLoading();
      
      if (selectedRecipes.length === 0) {
        wx.showToast({
          title: '暂无合适食谱',
          icon: 'none'
        });
        this.setData({ generating: false });
        return;
      }

      this.setData({
        generating: false,
        recipes: [...selectedRecipes, ...this.data.recipes]
      });

      // 保存到本地
      const userData = app.getData();
      userData.recipes = this.data.recipes;
      app.saveData(userData);

      // 显示个性化提示
      const topRecipe = selectedRecipes[0];
      wx.showModal({
        title: '🎯 为你推荐',
        content: `${topRecipe.name}\n\n推荐理由：${topRecipe.reason}\n\n匹配度：${Math.round(topRecipe.score)}分`,
        confirmText: '查看详情',
        cancelText: '知道了',
        success: (res) => {
          if (res.confirm) {
            this.viewRecipeDetail({ currentTarget: { dataset: { recipe: topRecipe } } });
          }
        }
      });
    }, 2000);
  },

  viewRecipeDetail(e) {
    const recipe = e.currentTarget.dataset.recipe;
    
    // 导航到详情页面，传递食谱数据
    wx.navigateTo({
      url: `/pages/recipe-detail/recipe-detail?recipe=${encodeURIComponent(JSON.stringify(recipe))}`
    });
  },

  deleteRecipe(e) {
    const index = e.currentTarget.dataset.index;
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个食谱吗？',
      success: (res) => {
        if (res.confirm) {
          const recipes = this.data.recipes;
          recipes.splice(index, 1);
          this.setData({ recipes });
          
          // 保存到本地
          const userData = app.getData();
          userData.recipes = recipes;
          app.saveData(userData);
          
          wx.showToast({
            title: '已删除',
            icon: 'success'
          });
        }
      }
    });
  }
});
