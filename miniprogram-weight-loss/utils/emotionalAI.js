// utils/emotionalAI.js
// AI情感感知系统

class EmotionalAI {
  constructor() {
    this.app = getApp();
  }

  /**
   * 综合分析用户状态，生成情感化的反馈
   */
  analyzeUserState() {
    const userData = this.app.getData();
    const analysis = {
      mood: 'neutral',           // happy, encouraging, concerned, supportive
      message: '',
      emoji: '😊',
      suggestions: [],
      encouragement: '',
      tone: 'warm'               // warm, gentle, cheerful, caring
    };

    // 1. 分析体重变化
    const weightAnalysis = this.analyzeWeightProgress(userData);
    
    // 2. 分析运动情况
    const exerciseAnalysis = this.analyzeExercisePattern(userData);
    
    // 3. 分析情绪状态
    const emotionAnalysis = this.analyzeEmotionalState(userData);
    
    // 4. 分析饮食情况
    const dietAnalysis = this.analyzeDietPattern(userData);
    
    // 5. 综合评估
    const overallState = this.synthesizeAnalysis({
      weight: weightAnalysis,
      exercise: exerciseAnalysis,
      emotion: emotionAnalysis,
      diet: dietAnalysis
    });

    // 6. 生成情感化消息
    return this.generateEmotionalMessage(overallState);
  }

  /**
   * 分析体重进展
   */
  analyzeWeightProgress(userData) {
    const weightHistory = userData.weightHistory || [];
    
    if (weightHistory.length < 2) {
      return {
        status: 'new',
        message: '刚开始减重之旅',
        sentiment: 'encouraging'
      };
    }

    const recent = weightHistory.slice(-7); // 最近7天
    const currentWeight = userData.user.currentWeight;
    const targetWeight = userData.user.targetWeight;
    const startWeight = userData.user.startWeight;

    // 计算进展
    const totalLoss = startWeight - currentWeight;
    const totalGoal = startWeight - targetWeight;
    const progress = (totalLoss / totalGoal) * 100;

    // 最近趋势
    const recentChange = recent.length >= 2 
      ? recent[0].weight - recent[recent.length - 1].weight 
      : 0;

    let status, sentiment;
    
    if (recentChange > 0.5) {
      status = 'great_progress';
      sentiment = 'happy';
    } else if (recentChange > 0) {
      status = 'steady_progress';
      sentiment = 'encouraging';
    } else if (recentChange === 0) {
      status = 'plateau';
      sentiment = 'supportive';
    } else {
      status = 'slight_gain';
      sentiment = 'caring';
    }

    return {
      status,
      sentiment,
      totalLoss,
      progress,
      recentChange
    };
  }

  /**
   * 分析运动模式
   */
  analyzeExercisePattern(userData) {
    const exerciseLogs = userData.exerciseLogs || [];
    const last7Days = exerciseLogs.filter(log => {
      const logDate = new Date(log.timestamp);
      const now = new Date();
      const diff = now - logDate;
      return diff < 7 * 24 * 60 * 60 * 1000;
    });

    const streak = this.app.getStreak();
    const todayExercise = this.app.getTodayExerciseCalories();

    let status, sentiment;

    if (streak >= 7) {
      status = 'amazing_streak';
      sentiment = 'proud';
    } else if (streak >= 3) {
      status = 'good_streak';
      sentiment = 'encouraging';
    } else if (todayExercise > 0) {
      status = 'active_today';
      sentiment = 'happy';
    } else if (last7Days.length === 0) {
      status = 'inactive';
      sentiment = 'gentle';
    } else {
      status = 'moderate';
      sentiment = 'supportive';
    }

    return {
      status,
      sentiment,
      streak,
      last7DaysCount: last7Days.length,
      todayExercise
    };
  }

  /**
   * 分析情绪状态
   */
  analyzeEmotionalState(userData) {
    const emotionLogs = userData.emotionLogs || [];
    const recent = emotionLogs.slice(-5); // 最近5条

    if (recent.length === 0) {
      return {
        status: 'unknown',
        sentiment: 'neutral'
      };
    }

    const negativeEmotions = ['sad', 'stressed', 'anxious', 'angry'];
    const negativeCount = recent.filter(log => 
      negativeEmotions.includes(log.moodValue)
    ).length;

    const ratio = negativeCount / recent.length;

    let status, sentiment;

    if (ratio > 0.6) {
      status = 'struggling';
      sentiment = 'caring';
    } else if (ratio > 0.3) {
      status = 'mixed';
      sentiment = 'supportive';
    } else {
      status = 'positive';
      sentiment = 'happy';
    }

    return {
      status,
      sentiment,
      negativeRatio: ratio,
      recentMood: recent[recent.length - 1]?.mood
    };
  }

  /**
   * 分析饮食模式
   */
  analyzeDietPattern(userData) {
    const foodLogs = userData.foodLogs || [];
    const todayCalories = this.app.getTodayCalories();
    const target = userData.settings.dailyCalorieTarget || 1500;

    const last7Days = foodLogs.filter(log => {
      const logDate = new Date(log.timestamp);
      const now = new Date();
      const diff = now - logDate;
      return diff < 7 * 24 * 60 * 60 * 1000;
    });

    let status, sentiment;

    if (todayCalories > target * 1.2) {
      status = 'over_eating';
      sentiment = 'gentle';
    } else if (todayCalories > target) {
      status = 'slightly_over';
      sentiment = 'supportive';
    } else if (todayCalories < target * 0.5 && todayCalories > 0) {
      status = 'under_eating';
      sentiment = 'concerned';
    } else {
      status = 'balanced';
      sentiment = 'encouraging';
    }

    return {
      status,
      sentiment,
      todayCalories,
      target,
      last7DaysCount: last7Days.length
    };
  }

  /**
   * 综合分析
   */
  synthesizeAnalysis(analyses) {
    const { weight, exercise, emotion, diet } = analyses;

    // 计算整体情绪倾向
    const sentiments = [
      weight.sentiment,
      exercise.sentiment,
      emotion.sentiment,
      diet.sentiment
    ];

    const sentimentScore = {
      'happy': 5,
      'proud': 5,
      'encouraging': 4,
      'supportive': 3,
      'neutral': 3,
      'gentle': 2,
      'caring': 2,
      'concerned': 1
    };

    const avgScore = sentiments.reduce((sum, s) => sum + sentimentScore[s], 0) / sentiments.length;

    let overallMood;
    if (avgScore >= 4.5) overallMood = 'excellent';
    else if (avgScore >= 3.5) overallMood = 'good';
    else if (avgScore >= 2.5) overallMood = 'okay';
    else overallMood = 'needs_support';

    return {
      overallMood,
      weight,
      exercise,
      emotion,
      diet,
      avgScore
    };
  }

  /**
   * 生成情感化消息
   */
  generateEmotionalMessage(state) {
    const { overallMood, weight, exercise, emotion, diet } = state;

    let message = '';
    let emoji = '😊';
    let suggestions = [];
    let encouragement = '';
    let tone = 'warm';

    // 根据整体状态生成主消息
    switch (overallMood) {
      case 'excellent':
        emoji = '🎉';
        tone = 'cheerful';
        message = this.generateExcellentMessage(state);
        encouragement = '你做得太棒了！继续保持这个节奏！';
        break;

      case 'good':
        emoji = '😊';
        tone = 'warm';
        message = this.generateGoodMessage(state);
        encouragement = '很好的进展！我看到了你的努力！';
        break;

      case 'okay':
        emoji = '💪';
        tone = 'supportive';
        message = this.generateOkayMessage(state);
        encouragement = '每一步都算数，我们一起继续前进！';
        break;

      case 'needs_support':
        emoji = '🤗';
        tone = 'caring';
        message = this.generateSupportMessage(state);
        encouragement = '我理解你的感受，让我们一起找到适合你的方法';
        break;
    }

    // 生成具体建议
    suggestions = this.generateSuggestions(state);

    return {
      mood: overallMood,
      message,
      emoji,
      suggestions,
      encouragement,
      tone,
      details: {
        weight: this.getWeightMessage(weight),
        exercise: this.getExerciseMessage(exercise),
        emotion: this.getEmotionMessage(emotion),
        diet: this.getDietMessage(diet)
      }
    };
  }

  /**
   * 生成优秀状态消息
   */
  generateExcellentMessage(state) {
    const messages = [
      `太棒了！你已经减重${state.weight.totalLoss.toFixed(1)}kg，而且保持了${state.exercise.streak}天的运动习惯！`,
      `你真的很厉害！体重稳步下降，运动也坚持得很好，继续加油！`,
      `看到你的进步我真的很开心！你已经完成了${state.weight.progress.toFixed(0)}%的目标！`,
      `你的坚持让我印象深刻！${state.exercise.streak}天连续打卡，体重也在稳定下降！`
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  /**
   * 生成良好状态消息
   */
  generateGoodMessage(state) {
    const messages = [
      `进展不错！虽然偶尔会有波动，但整体趋势是向好的`,
      `你在正确的道路上！继续保持现在的节奏就很好`,
      `看得出你在努力，这些努力都会有回报的`,
      `稳扎稳打，你做得很好！`
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  /**
   * 生成一般状态消息
   */
  generateOkayMessage(state) {
    const messages = [
      `减重是一个过程，不要着急。你已经在路上了`,
      `我注意到你可能遇到了一些挑战，这很正常`,
      `每个人都会有起伏，重要的是不要放弃`,
      `让我们一起找到更适合你的方法`
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  /**
   * 生成需要支持状态消息
   */
  generateSupportMessage(state) {
    const messages = [
      `我看到你最近可能有些困难，这完全可以理解`,
      `减重不容易，但你不是一个人在战斗`,
      `让我们暂停一下，重新调整策略`,
      `我在这里陪着你，我们一起慢慢来`
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  /**
   * 生成建议
   */
  generateSuggestions(state) {
    const suggestions = [];

    // 体重相关建议
    if (state.weight.status === 'plateau') {
      suggestions.push({
        icon: '⚖️',
        text: '体重进入平台期了，试试增加运动强度或调整饮食',
        priority: 'high'
      });
    } else if (state.weight.status === 'slight_gain') {
      suggestions.push({
        icon: '💙',
        text: '体重有小幅上升，别担心，这可能是水分波动',
        priority: 'medium'
      });
    }

    // 运动相关建议
    if (state.exercise.status === 'inactive') {
      suggestions.push({
        icon: '🏃',
        text: '好久没运动了，要不要试试5分钟的简单运动？',
        priority: 'high'
      });
    } else if (state.exercise.status === 'amazing_streak') {
      suggestions.push({
        icon: '🏆',
        text: `${state.exercise.streak}天连续打卡！记得适当休息哦`,
        priority: 'low'
      });
    }

    // 情绪相关建议
    if (state.emotion.status === 'struggling') {
      suggestions.push({
        icon: '🤗',
        text: '最近情绪不太好，要不要记录一下感受？',
        priority: 'high'
      });
    }

    // 饮食相关建议
    if (state.diet.status === 'over_eating') {
      suggestions.push({
        icon: '🥗',
        text: '今天摄入有点多，晚餐可以选择清淡一些',
        priority: 'medium'
      });
    } else if (state.diet.status === 'under_eating') {
      suggestions.push({
        icon: '⚠️',
        text: '今天吃得有点少，记得补充营养哦',
        priority: 'high'
      });
    }

    // 按优先级排序
    return suggestions.sort((a, b) => {
      const priority = { high: 3, medium: 2, low: 1 };
      return priority[b.priority] - priority[a.priority];
    }).slice(0, 3);
  }

  /**
   * 获取体重消息
   */
  getWeightMessage(weight) {
    const messages = {
      'great_progress': `体重下降${Math.abs(weight.recentChange).toFixed(1)}kg，太棒了！`,
      'steady_progress': `体重稳步下降，保持这个节奏`,
      'plateau': `体重暂时稳定，这是正常的平台期`,
      'slight_gain': `体重有小幅波动，不用担心`,
      'new': `刚开始减重，加油！`
    };
    return messages[weight.status] || '';
  }

  /**
   * 获取运动消息
   */
  getExerciseMessage(exercise) {
    const messages = {
      'amazing_streak': `连续${exercise.streak}天运动，你太厉害了！`,
      'good_streak': `已经坚持${exercise.streak}天了，继续加油！`,
      'active_today': `今天运动了，很棒！`,
      'inactive': `最近没怎么运动，要不要动一动？`,
      'moderate': `运动频率还不错，继续保持`
    };
    return messages[exercise.status] || '';
  }

  /**
   * 获取情绪消息
   */
  getEmotionMessage(emotion) {
    const messages = {
      'struggling': `最近情绪不太好，我理解你`,
      'mixed': `情绪有起伏，这很正常`,
      'positive': `情绪状态不错，继续保持`,
      'unknown': `记录一下情绪会更好哦`
    };
    return messages[emotion.status] || '';
  }

  /**
   * 获取饮食消息
   */
  getDietMessage(diet) {
    const messages = {
      'over_eating': `今天吃得有点多，明天注意一下`,
      'slightly_over': `稍微超了一点，没关系`,
      'under_eating': `今天吃得有点少，注意营养`,
      'balanced': `饮食控制得很好！`
    };
    return messages[diet.status] || '';
  }
}

module.exports = EmotionalAI;
