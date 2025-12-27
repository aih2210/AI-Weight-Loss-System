// pages/ai-assistant/ai-assistant.js
const app = getApp();

Page({
  data: {
    messages: [],
    inputText: '',
    isTyping: false,
    useRealAI: true, // 是否使用真实AI（通义千问）
    apiKey: '', // 通义千问API Key
    quickQuestions: [
      '如何快速减重？',
      '推荐低卡食谱',
      '运动计划建议',
      '如何控制食欲？',
      '减重遇到平台期怎么办？',
      '如何保持动力？'
    ],
    // AI知识库
    knowledgeBase: {
      '减重': {
        keywords: ['减重', '减肥', '瘦身', '降体重'],
        responses: [
          '健康减重的关键是：\n1️⃣ 控制热量摄入（每日减少300-500卡）\n2️⃣ 增加运动消耗\n3️⃣ 保证充足睡眠\n4️⃣ 多喝水（每天2L以上）\n5️⃣ 减少精制碳水摄入',
          '科学减重建议：\n• 每周减重0.5-1kg为宜\n• 不要节食，保证基础代谢\n• 多吃蛋白质和蔬菜\n• 规律运动，有氧+力量结合\n• 记录饮食和体重变化'
        ]
      },
      '饮食': {
        keywords: ['吃什么', '食谱', '饮食', '食物', '营养'],
        responses: [
          '减脂期推荐食物：\n🥩 蛋白质：鸡胸肉、鱼肉、鸡蛋、豆腐\n🥦 蔬菜：西兰花、菠菜、番茄、黄瓜\n🍚 碳水：糙米、燕麦、红薯、玉米\n🥑 健康脂肪：牛油果、坚果、橄榄油',
          '一日三餐建议：\n早餐：燕麦+鸡蛋+牛奶\n午餐：糙米+鸡胸肉+蔬菜\n晚餐：鱼肉+蔬菜沙拉\n加餐：水果、酸奶、坚果'
        ]
      },
      '运动': {
        keywords: ['运动', '锻炼', '健身', '训练'],
        responses: [
          '减脂运动计划：\n🏃 有氧运动（每周4-5次）：\n• 跑步30-45分钟\n• 快走45-60分钟\n• 游泳30-40分钟\n\n💪 力量训练（每周2-3次）：\n• 深蹲、俯卧撑、卷腹\n• 每个动作3组，每组12-15次',
          '新手运动建议：\n第1-2周：快走30分钟/天\n第3-4周：慢跑20分钟+快走10分钟\n第5-6周：慢跑30分钟\n第7-8周：慢跑30分钟+力量训练\n循序渐进，避免受伤'
        ]
      },
      '平台期': {
        keywords: ['平台期', '不掉秤', '体重不变'],
        responses: [
          '突破平台期的方法：\n1️⃣ 调整饮食结构，增加蛋白质\n2️⃣ 改变运动方式，增加强度\n3️⃣ 检查是否有隐藏热量\n4️⃣ 保证充足睡眠\n5️⃣ 减少压力，放松心情\n6️⃣ 坚持2-3周，身体会适应',
          '平台期很正常！\n• 身体在适应新的体重\n• 继续保持健康习惯\n• 不要过度节食\n• 可以尝试间歇性断食\n• 增加HIIT训练\n• 保持耐心，坚持就是胜利'
        ]
      },
      '食欲': {
        keywords: ['食欲', '饿', '想吃', '控制不住'],
        responses: [
          '控制食欲的技巧：\n1️⃣ 多喝水，餐前喝一杯\n2️⃣ 增加蛋白质和纤维摄入\n3️⃣ 少食多餐，避免过度饥饿\n4️⃣ 充足睡眠，减少饥饿激素\n5️⃣ 转移注意力，做其他事情\n6️⃣ 准备健康零食（水果、坚果）',
          '应对饥饿感：\n• 真饿还是假饿？先喝水等10分钟\n• 吃高饱腹感食物：燕麦、鸡蛋、红薯\n• 细嚼慢咽，每口咀嚼20次\n• 用小盘子，视觉上更满足\n• 饭前吃蔬菜，增加饱腹感'
        ]
      },
      '动力': {
        keywords: ['动力', '坚持', '放弃', '懒'],
        responses: [
          '保持减重动力：\n🎯 设定小目标，每周0.5kg\n📸 拍对比照，看到变化\n👥 找减重伙伴，互相鼓励\n🎁 达成目标给自己奖励\n📝 记录进步，看到成果\n💪 关注健康，不只是体重',
          '克服懒惰的方法：\n• 把运动服放在显眼位置\n• 设定固定运动时间\n• 从5分钟开始，逐步增加\n• 找喜欢的运动方式\n• 听音乐或播客\n• 记住：开始最难，坚持就赢了'
        ]
      }
    }
  },

  onLoad() {
    // 从本地存储加载API Key
    const apiKey = wx.getStorageSync('qianwen_api_key') || '';
    this.setData({ apiKey });
    
    const welcomeMsg = this.data.useRealAI && apiKey 
      ? '你好！我是通义千问AI助手🤖\n\n我可以帮你：\n• 制定个性化减重计划\n• 推荐健康食谱\n• 设计运动方案\n• 解答减重疑问\n• 提供心理支持\n\n有什么想问的吗？'
      : '你好！我是你的AI减重助手🤖\n\n💡 提示：点击右上角设置API Key可启用通义千问AI\n\n我可以帮你：\n• 制定减重计划\n• 推荐健康食谱\n• 设计运动方案\n• 解答减重疑问\n• 提供心理支持\n\n有什么想问的吗？';
    
    this.addMessage('AI', welcomeMsg);
  },

  onInputChange(e) {
    this.setData({
      inputText: e.detail.value
    });
  },

  async sendMessage() {
    const { inputText, useRealAI, apiKey } = this.data;
    if (!inputText.trim()) return;

    // 添加用户消息
    this.addMessage('user', inputText);
    const userQuestion = inputText;
    
    // 清空输入框
    this.setData({
      inputText: '',
      isTyping: true
    });

    // 使用真实AI或本地知识库
    if (useRealAI && apiKey) {
      await this.callQianwenAPI(userQuestion);
    } else {
      // 本地知识库回复
      setTimeout(() => {
        const response = this.generateResponse(userQuestion);
        this.addMessage('AI', response);
        this.setData({ isTyping: false });
      }, 1000);
    }
  },

  // 调用通义千问API
  async callQianwenAPI(question) {
    const { apiKey } = this.data;
    const userData = app.getData();
    
    // 构建系统提示词
    const systemPrompt = `你是一个专业的AI减重助手。用户信息：
- 姓名：${userData.user.name}
- 当前体重：${userData.user.currentWeight}kg
- 目标体重：${userData.user.targetWeight}kg
- 起始体重：${userData.user.startWeight}kg
- 已减重：${(userData.user.startWeight - userData.user.currentWeight).toFixed(1)}kg

请提供专业、友好、个性化的减重建议。回答要简洁实用，使用emoji让回答更生动。`;

    try {
      const response = await new Promise((resolve, reject) => {
        wx.request({
          url: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
          method: 'POST',
          header: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          data: {
            model: 'qwen-turbo',
            input: {
              messages: [
                {
                  role: 'system',
                  content: systemPrompt
                },
                {
                  role: 'user',
                  content: question
                }
              ]
            },
            parameters: {
              result_format: 'message',
              max_tokens: 800,
              temperature: 0.7
            }
          },
          success: (res) => {
            if (res.statusCode === 200 && res.data.output) {
              resolve(res.data.output.choices[0].message.content);
            } else {
              reject(new Error('API调用失败'));
            }
          },
          fail: reject
        });
      });

      this.addMessage('AI', response);
      this.setData({ isTyping: false });
      
    } catch (error) {
      console.error('通义千问API调用失败:', error);
      
      // API失败时使用本地知识库
      wx.showToast({
        title: 'API调用失败，使用本地回复',
        icon: 'none',
        duration: 2000
      });
      
      const fallbackResponse = this.generateResponse(question);
      this.addMessage('AI', fallbackResponse);
      this.setData({ isTyping: false });
    }
  },

  quickAsk(e) {
    const question = e.currentTarget.dataset.question;
    this.setData({
      inputText: question
    });
    this.sendMessage();
  },

  addMessage(role, content) {
    const messages = this.data.messages;
    messages.push({
      id: Date.now(),
      role,
      content,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    });
    
    this.setData({
      messages
    });

    // 滚动到底部
    setTimeout(() => {
      wx.pageScrollTo({
        scrollTop: 10000,
        duration: 300
      });
    }, 100);
  },

  generateResponse(question) {
    const { knowledgeBase } = this.data;
    const userData = app.getData();
    
    // 个性化问候
    if (question.includes('你好') || question.includes('在吗')) {
      return `你好${userData.user.name}！我一直在这里😊\n\n你目前的进度：\n• 当前体重：${userData.user.currentWeight}kg\n• 目标体重：${userData.user.targetWeight}kg\n• 已减重：${(userData.user.startWeight - userData.user.currentWeight).toFixed(1)}kg\n\n继续加油！有什么需要帮助的吗？`;
    }

    // 查询进度
    if (question.includes('进度') || question.includes('情况')) {
      const weightLost = (userData.user.startWeight - userData.user.currentWeight).toFixed(1);
      const remaining = (userData.user.currentWeight - userData.user.targetWeight).toFixed(1);
      const progress = ((weightLost / (userData.user.startWeight - userData.user.targetWeight)) * 100).toFixed(1);
      
      return `📊 你的减重进度：\n\n起始体重：${userData.user.startWeight}kg\n当前体重：${userData.user.currentWeight}kg\n目标体重：${userData.user.targetWeight}kg\n\n✅ 已减重：${weightLost}kg\n📍 还需减：${remaining}kg\n📈 完成度：${progress}%\n\n${progress > 50 ? '太棒了！已经完成一半以上了！' : '继续努力，你一定可以的！'}`;
    }

    // 今日数据
    if (question.includes('今天') || question.includes('今日')) {
      const todayCalories = app.getTodayCalories();
      const todayExercise = app.getTodayExerciseCalories();
      const target = userData.settings.dailyCalorieTarget;
      
      return `📅 今日数据：\n\n🍽️ 饮食摄入：${todayCalories} kcal\n🎯 目标摄入：${target} kcal\n🏃 运动消耗：${todayExercise} kcal\n\n净摄入：${todayCalories - todayExercise} kcal\n\n${todayCalories < target ? '✅ 控制得很好！' : '⚠️ 今天摄入有点多，晚餐要控制哦'}`;
    }

    // 匹配知识库
    for (const [category, data] of Object.entries(knowledgeBase)) {
      for (const keyword of data.keywords) {
        if (question.includes(keyword)) {
          const responses = data.responses;
          return responses[Math.floor(Math.random() * responses.length)];
        }
      }
    }

    // 默认回复
    const defaultResponses = [
      '这是个好问题！让我想想...\n\n建议你：\n1. 保持规律的饮食和运动\n2. 记录每天的进展\n3. 不要过度节食\n4. 保持积极心态\n\n还有其他想了解的吗？',
      '关于这个问题，我的建议是：\n\n• 循序渐进，不要急于求成\n• 找到适合自己的方法\n• 坚持比完美更重要\n• 享受过程，不只关注结果\n\n需要更具体的建议吗？',
      '很高兴你问这个！\n\n每个人的情况不同，但基本原则是：\n✅ 健康第一\n✅ 科学方法\n✅ 持之以恒\n\n你可以试试我们的食物识别和食谱生成功能哦！'
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  },

  clearHistory() {
    wx.showModal({
      title: '清空聊天记录',
      content: '确定要清空所有聊天记录吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            messages: []
          });
          this.addMessage('AI', '聊天记录已清空。有什么新问题吗？😊');
        }
      }
    });
  },

  // 设置API Key
  setApiKey() {
    const { apiKey } = this.data;
    wx.showModal({
      title: '设置通义千问API Key',
      editable: true,
      placeholderText: '请输入API Key',
      content: apiKey || '',
      success: (res) => {
        if (res.confirm && res.content) {
          const newApiKey = res.content.trim();
          this.setData({ 
            apiKey: newApiKey,
            useRealAI: true 
          });
          wx.setStorageSync('qianwen_api_key', newApiKey);
          wx.showToast({
            title: 'API Key已保存',
            icon: 'success'
          });
          
          // 重新加载欢迎消息
          this.setData({ messages: [] });
          this.addMessage('AI', '你好！我是通义千问AI助手🤖\n\n已启用真实AI对话，我可以为你提供更智能、更个性化的减重建议！\n\n有什么想问的吗？');
        }
      }
    });
  },

  // 切换AI模式
  toggleAIMode() {
    const { useRealAI, apiKey } = this.data;
    
    if (!apiKey && !useRealAI) {
      wx.showModal({
        title: '提示',
        content: '请先设置通义千问API Key',
        confirmText: '去设置',
        success: (res) => {
          if (res.confirm) {
            this.setApiKey();
          }
        }
      });
      return;
    }
    
    this.setData({
      useRealAI: !useRealAI
    });
    
    wx.showToast({
      title: useRealAI ? '已切换到本地模式' : '已切换到AI模式',
      icon: 'success'
    });
  },

  // 获取API Key指南
  showApiGuide() {
    wx.showModal({
      title: '📖 如何获取API Key',
      content: '1. 访问阿里云官网\n2. 搜索"通义千问"\n3. 开通服务并创建API Key\n4. 复制Key到这里\n\n💡 新用户有免费额度可用',
      confirmText: '知道了',
      showCancel: false
    });
  }
});
