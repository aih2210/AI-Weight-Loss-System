// utils/emotionAnalyzer.js
// 情绪模式分析工具

class EmotionAnalyzer {
  constructor() {
    this.app = getApp();
  }

  /**
   * 分析情绪模式
   * @returns {Object} 分析结果
   */
  analyzePatterns() {
    const data = this.app.getData();
    const emotionLogs = data.emotionLogs || [];
    const foodLogs = data.foodLogs || [];

    if (emotionLogs.length < 3) {
      return {
        hasEnoughData: false,
        message: '数据不足，至少需要3条情绪记录'
      };
    }

    // 1. 情绪频率分析
    const moodFrequency = this.analyzeMoodFrequency(emotionLogs);

    // 2. 时间模式分析
    const timePatterns = this.analyzeTimePatterns(emotionLogs);

    // 3. 情绪性进食分析
    const emotionalEating = this.analyzeEmotionalEating(emotionLogs, foodLogs);

    // 4. 触发因素识别
    const triggers = this.identifyTriggers(emotionLogs);

    // 5. 风险评估
    const riskLevel = this.assessRisk(emotionLogs, foodLogs);

    return {
      hasEnoughData: true,
      moodFrequency,
      timePatterns,
      emotionalEating,
      triggers,
      riskLevel,
      recommendations: this.generateRecommendations(riskLevel, triggers)
    };
  }

  /**
   * 分析情绪频率
   */
  analyzeMoodFrequency(logs) {
    const frequency = {};
    logs.forEach(log => {
      const mood = log.moodValue || log.mood;
      frequency[mood] = (frequency[mood] || 0) + 1;
    });

    // 找出最常见的情绪
    const sorted = Object.entries(frequency).sort((a, b) => b[1] - a[1]);
    const total = logs.length;

    return {
      mostCommon: sorted[0] ? {
        mood: sorted[0][0],
        count: sorted[0][1],
        percentage: Math.round((sorted[0][1] / total) * 100)
      } : null,
      distribution: sorted.map(([mood, count]) => ({
        mood,
        count,
        percentage: Math.round((count / total) * 100)
      }))
    };
  }

  /**
   * 分析时间模式
   */
  analyzeTimePatterns(logs) {
    const hourCounts = new Array(24).fill(0);
    const dayOfWeekCounts = new Array(7).fill(0);

    logs.forEach(log => {
      const date = new Date(log.timestamp);
      const hour = date.getHours();
      const dayOfWeek = date.getDay();
      
      hourCounts[hour]++;
      dayOfWeekCounts[dayOfWeek]++;
    });

    // 找出高发时段
    const peakHour = hourCounts.indexOf(Math.max(...hourCounts));
    const peakDay = dayOfWeekCounts.indexOf(Math.max(...dayOfWeekCounts));

    const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

    return {
      peakHour: {
        hour: peakHour,
        label: `${peakHour}:00-${peakHour + 1}:00`,
        count: hourCounts[peakHour]
      },
      peakDay: {
        day: peakDay,
        label: dayNames[peakDay],
        count: dayOfWeekCounts[peakDay]
      }
    };
  }

  /**
   * 分析情绪性进食
   */
  analyzeEmotionalEating(emotionLogs, foodLogs) {
    let emotionalEatingCount = 0;
    const correlations = [];

    // 检查情绪记录后2小时内的进食行为
    emotionLogs.forEach(emotion => {
      const negativeEmotions = ['sad', 'stressed', 'anxious', 'angry', 'bored'];
      if (!negativeEmotions.includes(emotion.moodValue)) return;

      const emotionTime = emotion.timestamp;
      const relatedFood = foodLogs.filter(food => {
        const timeDiff = food.timestamp - emotionTime;
        return timeDiff > 0 && timeDiff < 2 * 60 * 60 * 1000; // 2小时内
      });

      if (relatedFood.length > 0) {
        emotionalEatingCount++;
        correlations.push({
          emotion: emotion.mood,
          foods: relatedFood.map(f => f.name),
          time: new Date(emotionTime).toLocaleString()
        });
      }
    });

    return {
      count: emotionalEatingCount,
      percentage: emotionLogs.length > 0 
        ? Math.round((emotionalEatingCount / emotionLogs.length) * 100)
        : 0,
      correlations: correlations.slice(-5) // 最近5次
    };
  }

  /**
   * 识别触发因素
   */
  identifyTriggers(logs) {
    const triggers = [];
    const negativeEmotions = ['sad', 'stressed', 'anxious', 'angry', 'bored', 'tired'];

    // 分析关键词
    const keywords = {};
    logs.forEach(log => {
      if (!log.notes) return;
      
      const words = log.notes.split(/\s+/);
      words.forEach(word => {
        if (word.length > 1) {
          keywords[word] = (keywords[word] || 0) + 1;
        }
      });
    });

    // 找出高频关键词
    const sortedKeywords = Object.entries(keywords)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // 分析负面情绪的触发模式
    const negativeCount = logs.filter(log => 
      negativeEmotions.includes(log.moodValue)
    ).length;

    if (negativeCount > logs.length * 0.5) {
      triggers.push({
        type: 'high_negative_emotions',
        description: '负面情绪频繁出现',
        severity: 'high'
      });
    }

    // 添加关键词触发因素
    sortedKeywords.forEach(([word, count]) => {
      if (count >= 2) {
        triggers.push({
          type: 'keyword',
          description: `"${word}" 反复出现`,
          count,
          severity: count >= 3 ? 'medium' : 'low'
        });
      }
    });

    return triggers;
  }

  /**
   * 评估风险等级
   */
  assessRisk(emotionLogs, foodLogs) {
    let riskScore = 0;

    // 1. 负面情绪比例
    const negativeEmotions = ['sad', 'stressed', 'anxious', 'angry'];
    const negativeCount = emotionLogs.filter(log => 
      negativeEmotions.includes(log.moodValue)
    ).length;
    const negativeRatio = negativeCount / emotionLogs.length;
    
    if (negativeRatio > 0.6) riskScore += 3;
    else if (negativeRatio > 0.4) riskScore += 2;
    else if (negativeRatio > 0.2) riskScore += 1;

    // 2. 情绪性进食频率
    const emotionalEating = this.analyzeEmotionalEating(emotionLogs, foodLogs);
    if (emotionalEating.percentage > 50) riskScore += 3;
    else if (emotionalEating.percentage > 30) riskScore += 2;
    else if (emotionalEating.percentage > 10) riskScore += 1;

    // 3. 记录频率（过于频繁可能表示情绪不稳定）
    const recentLogs = emotionLogs.filter(log => 
      Date.now() - log.timestamp < 7 * 24 * 60 * 60 * 1000
    );
    if (recentLogs.length > 20) riskScore += 2;
    else if (recentLogs.length > 10) riskScore += 1;

    // 确定风险等级
    let level, color, description;
    if (riskScore >= 6) {
      level = 'high';
      color = '#ff4444';
      description = '高风险：情绪对饮食影响较大，建议寻求专业帮助';
    } else if (riskScore >= 3) {
      level = 'medium';
      color = '#ff9800';
      description = '中风险：需要注意情绪管理，建立健康应对机制';
    } else {
      level = 'low';
      color = '#4caf50';
      description = '低风险：情绪管理良好，继续保持';
    }

    return {
      level,
      score: riskScore,
      color,
      description
    };
  }

  /**
   * 生成个性化建议
   */
  generateRecommendations(riskLevel, triggers) {
    const recommendations = [];

    // 基于风险等级的建议
    if (riskLevel.level === 'high') {
      recommendations.push({
        title: '🚨 紧急建议',
        content: '情绪对饮食影响较大，建议：\n1. 考虑咨询心理健康专业人士\n2. 建立情绪日记习惯\n3. 学习正念冥想技巧\n4. 寻找非食物的情绪出口'
      });
    }

    // 基于触发因素的建议
    const hasStressTrigger = triggers.some(t => 
      t.description.includes('压力') || t.description.includes('焦虑')
    );
    
    if (hasStressTrigger) {
      recommendations.push({
        title: '😰 压力管理',
        content: '检测到压力相关触发：\n1. 每天练习5分钟深呼吸\n2. 尝试渐进式肌肉放松\n3. 保持规律运动\n4. 确保充足睡眠'
      });
    }

    // 通用建议
    recommendations.push({
      title: '💡 日常建议',
      content: '1. 在想吃东西前先喝一杯水\n2. 准备健康零食替代品\n3. 用运动代替进食\n4. 记录情绪和饮食的关联'
    });

    return recommendations;
  }

  /**
   * 检测当前是否为触发时刻
   */
  checkTriggerMoment() {
    const data = this.app.getData();
    const emotionLogs = data.emotionLogs || [];
    
    if (emotionLogs.length === 0) return null;

    // 获取最近的情绪记录
    const recentEmotion = emotionLogs[emotionLogs.length - 1];
    const timeSinceLog = Date.now() - recentEmotion.timestamp;

    // 如果是30分钟内的负面情绪，返回干预建议
    if (timeSinceLog < 30 * 60 * 1000) {
      const negativeEmotions = ['sad', 'stressed', 'anxious', 'angry', 'bored'];
      if (negativeEmotions.includes(recentEmotion.moodValue)) {
        return this.generateIntervention(recentEmotion.moodValue);
      }
    }

    return null;
  }

  /**
   * 生成干预建议
   */
  generateIntervention(mood) {
    const interventions = {
      'sad': {
        title: '💙 温柔提醒',
        actions: [
          '深呼吸5分钟，专注于呼吸',
          '听一首喜欢的音乐',
          '给朋友打个电话',
          '出门散步10分钟'
        ],
        avoidFood: '避免高糖食物，它们会让情绪更不稳定'
      },
      'stressed': {
        title: '🧘 压力释放',
        actions: [
          '做10分钟冥想或瑜伽',
          '写下3件让你感激的事',
          '做一些拉伸运动',
          '喝一杯温水，慢慢品味'
        ],
        avoidFood: '压力时避免咖啡因和高脂食物'
      },
      'anxious': {
        title: '🌸 平静心灵',
        actions: [
          '腹式呼吸：吸气4秒，呼气6秒',
          '用冷水洗脸，刺激迷走神经',
          '做一些简单的家务',
          '看一段轻松的视频'
        ],
        avoidFood: '焦虑时避免刺激性食物'
      },
      'angry': {
        title: '🔥 情绪疏导',
        actions: [
          '出去跑步或快走20分钟',
          '做一些力量训练',
          '写下愤怒的原因，然后撕掉',
          '听激昂的音乐发泄'
        ],
        avoidFood: '愤怒时避免冲动进食'
      },
      'bored': {
        title: '🎯 转移注意',
        actions: [
          '做一件一直想做的事',
          '学习新技能（5分钟即可）',
          '整理房间或工作区',
          '联系一个朋友聊天'
        ],
        avoidFood: '无聊≠饿，先喝水再决定'
      }
    };

    return interventions[mood] || null;
  }
}

module.exports = EmotionAnalyzer;
