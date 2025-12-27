// pages/emotion-log/emotion-log.js
const app = getApp();
const EmotionAnalyzer = require('../../utils/emotionAnalyzer.js');

Page({
  data: {
    selectedMood: '',
    moodIndex: -1,
    moods: [
      { icon: '😊', label: '开心', value: 'happy' },
      { icon: '😢', label: '难过', value: 'sad' },
      { icon: '😰', label: '压力', value: 'stressed' },
      { icon: '😟', label: '焦虑', value: 'anxious' },
      { icon: '😑', label: '无聊', value: 'bored' },
      { icon: '😴', label: '疲惫', value: 'tired' },
      { icon: '😠', label: '生气', value: 'angry' },
      { icon: '😌', label: '平静', value: 'calm' }
    ],
    notes: '',
    emotionHistory: [],
    analyzer: null,
    showAnalysis: false,
    analysisResult: null,
    intervention: null
  },

  onLoad() {
    this.data.analyzer = new EmotionAnalyzer();
    this.loadHistory();
    this.checkForIntervention();
  },

  onShow() {
    this.loadHistory();
    this.checkForIntervention();
  },

  loadHistory() {
    const userData = app.getData();
    this.setData({
      emotionHistory: userData.emotionLogs || []
    });
  },

  selectMood(e) {
    const index = e.currentTarget.dataset.index;
    const mood = this.data.moods[index];
    
    this.setData({
      selectedMood: mood.value,
      moodIndex: index
    });
  },

  onNotesInput(e) {
    this.setData({
      notes: e.detail.value
    });
  },

  saveEmotion() {
    const { selectedMood, moodIndex, moods, notes } = this.data;
    
    if (!selectedMood) {
      wx.showToast({
        title: '请选择情绪',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({
      title: 'AI分析中...'
    });

    // 模拟AI分析
    setTimeout(() => {
      const mood = moods[moodIndex];
      const analysis = this.generateAnalysis(mood.value, notes);
      
      // 保存情绪记录
      app.addEmotionLog({
        mood: mood.label,
        moodValue: mood.value,
        icon: mood.icon,
        notes: notes,
        analysis: analysis
      });

      wx.hideLoading();
      
      wx.showModal({
        title: '情绪记录已保存',
        content: `AI分析：\n\n${analysis}`,
        showCancel: false,
        success: () => {
          // 重置表单
          this.setData({
            selectedMood: '',
            moodIndex: -1,
            notes: ''
          });
          this.loadHistory();
        }
      });
    }, 1500);
  },

  generateAnalysis(mood, notes) {
    const analyses = {
      'happy': [
        '太好了！保持这种积极的心态，继续坚持健康的生活方式。',
        '开心的情绪有助于减重！建议今天奖励自己一个健康的美食。',
        '情绪愉悦时，身体代谢更好。继续保持运动和健康饮食！'
      ],
      'sad': [
        '难过时容易情绪性进食。建议：\n1. 深呼吸5分钟\n2. 听舒缓音乐\n3. 避免高糖食物\n4. 可以适量运动释放情绪',
        '理解你的感受。建议用运动代替进食来缓解情绪，散步30分钟会有帮助。',
        '情绪低落时要特别注意饮食。推荐吃一些富含色氨酸的食物如香蕉、牛奶。'
      ],
      'stressed': [
        '压力大时容易暴饮暴食。建议：\n1. 做10分钟冥想\n2. 喝一杯温水\n3. 避免咖啡因\n4. 早点休息',
        '压力会影响代谢。建议进行瑜伽或拉伸运动，帮助放松身心。',
        '注意！压力激素会促进脂肪储存。今天要特别控制饮食，多吃蔬菜和蛋白质。'
      ],
      'anxious': [
        '焦虑时建议：\n1. 腹式呼吸练习\n2. 避免刺激性食物\n3. 适量运动\n4. 保证充足睡眠',
        '焦虑会影响食欲和代谢。建议喝洋甘菊茶，做轻度有氧运动。',
        '理解你的焦虑。建议写下担心的事情，然后去散步，让大脑放松。'
      ],
      'bored': [
        '无聊时最容易乱吃！建议：\n1. 找点事做（看书、听音乐）\n2. 喝水代替零食\n3. 出门走走\n4. 联系朋友聊天',
        '无聊≠饿！建议做一些有趣的活动，转移注意力，避免无意识进食。',
        '无聊时建议做一些轻松的运动，如瑜伽、拉伸，既打发时间又有益健康。'
      ],
      'tired': [
        '疲惫时容易选择高热量食物。建议：\n1. 小睡20分钟\n2. 喝咖啡/茶\n3. 吃点坚果\n4. 今晚早点睡',
        '疲劳会降低意志力。今天要特别注意饮食控制，避免高糖高脂食物。',
        '疲惫时建议补充维生素B和蛋白质，如鸡蛋、牛奶，避免甜食。'
      ],
      'angry': [
        '生气时建议：\n1. 深呼吸10次\n2. 出去跑步发泄\n3. 避免冲动进食\n4. 听音乐平复心情',
        '愤怒时容易暴饮暴食。建议用运动发泄情绪，跑步或打拳击都很好。',
        '生气会影响消化。建议先平复情绪再进食，可以喝点温水。'
      ],
      'calm': [
        '平静的心态最有利于减重！保持这种状态，继续坚持健康生活。',
        '很好的状态！平静时做决定更理智，今天的饮食计划会执行得很好。',
        '平和的心态有助于身心健康。建议今天做一些舒缓的运动如瑜伽。'
      ]
    };

    const moodAnalyses = analyses[mood] || ['继续保持健康的生活方式！'];
    return moodAnalyses[Math.floor(Math.random() * moodAnalyses.length)];
  },

  deleteEmotion(e) {
    const index = e.currentTarget.dataset.index;
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条情绪记录吗？',
      success: (res) => {
        if (res.confirm) {
          const userData = app.getData();
          userData.emotionLogs.splice(index, 1);
          app.saveData(userData);
          
          this.loadHistory();
          
          wx.showToast({
            title: '已删除',
            icon: 'success'
          });
        }
      }
    });
  },

  // 检查是否需要干预
  checkForIntervention() {
    const intervention = this.data.analyzer.checkTriggerMoment();
    if (intervention) {
      this.setData({ intervention });
      
      // 显示干预提示
      setTimeout(() => {
        wx.showModal({
          title: intervention.title,
          content: `建议尝试：\n\n${intervention.actions.map((a, i) => `${i + 1}. ${a}`).join('\n')}\n\n⚠️ ${intervention.avoidFood}`,
          confirmText: '我会试试',
          cancelText: '稍后再说'
        });
      }, 500);
    }
  },

  // 查看情绪模式分析
  viewPatternAnalysis() {
    wx.showLoading({ title: '分析中...' });

    setTimeout(() => {
      const result = this.data.analyzer.analyzePatterns();
      wx.hideLoading();

      if (!result.hasEnoughData) {
        wx.showToast({
          title: result.message,
          icon: 'none',
          duration: 2000
        });
        return;
      }

      this.setData({
        showAnalysis: true,
        analysisResult: result
      });

      // 显示分析摘要
      const { moodFrequency, riskLevel, emotionalEating } = result;
      const summary = `📊 情绪分析报告\n\n` +
        `最常见情绪：${moodFrequency.mostCommon.mood} (${moodFrequency.mostCommon.percentage}%)\n\n` +
        `情绪性进食：${emotionalEating.count}次 (${emotionalEating.percentage}%)\n\n` +
        `风险等级：${riskLevel.description}`;

      wx.showModal({
        title: '🧠 情绪模式分析',
        content: summary,
        confirmText: '查看详情',
        cancelText: '知道了',
        success: (res) => {
          if (res.confirm) {
            this.showDetailedAnalysis(result);
          }
        }
      });
    }, 1500);
  },

  // 显示详细分析
  showDetailedAnalysis(result) {
    const { timePatterns, triggers, recommendations } = result;
    
    let content = `⏰ 时间模式\n`;
    content += `高发时段：${timePatterns.peakHour.label}\n`;
    content += `高发日期：${timePatterns.peakDay.label}\n\n`;
    
    if (triggers.length > 0) {
      content += `🎯 触发因素\n`;
      triggers.forEach(t => {
        content += `• ${t.description}\n`;
      });
      content += `\n`;
    }
    
    if (recommendations.length > 0) {
      content += `💡 建议\n${recommendations[0].content}`;
    }

    wx.showModal({
      title: '详细分析',
      content: content,
      showCancel: false,
      confirmText: '知道了'
    });
  },

  // 关闭分析面板
  closeAnalysis() {
    this.setData({
      showAnalysis: false
    });
  },

  // 关闭干预提示
  closeIntervention() {
    this.setData({
      intervention: null
    });
  }
});
