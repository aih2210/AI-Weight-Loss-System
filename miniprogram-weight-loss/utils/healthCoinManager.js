// utils/healthCoinManager.js
// 健康币管理系统

class HealthCoinManager {
  constructor() {
    this.coinRules = {
      // 每日打卡奖励
      dailyCheckIn: 10,
      consecutiveCheckIn3: 20,  // 连续3天额外奖励
      consecutiveCheckIn7: 50,  // 连续7天额外奖励
      consecutiveCheckIn30: 200, // 连续30天额外奖励
      
      // 运动奖励
      exerciseComplete: 15,
      exerciseStreak3: 30,
      
      // 饮食记录奖励
      dietLog: 8,
      healthyMeal: 12,
      
      // 体重管理奖励
      weightUpdate: 5,
      weightGoalReached: 100,
      
      // 社交互动奖励
      shareProgress: 10,
      helpOthers: 15,
      
      // 学习奖励
      readArticle: 5,
      completeQuiz: 20
    };
  }

  // 获取用户健康币余额
  getBalance(userData) {
    return userData.healthCoins || 0;
  }

  // 添加健康币
  addCoins(userData, amount, reason) {
    if (!userData.healthCoins) {
      userData.healthCoins = 0;
    }
    
    userData.healthCoins += amount;
    
    // 记录交易历史
    if (!userData.coinHistory) {
      userData.coinHistory = [];
    }
    
    userData.coinHistory.unshift({
      type: 'earn',
      amount: amount,
      reason: reason,
      balance: userData.healthCoins,
      timestamp: new Date().toISOString()
    });
    
    // 只保留最近100条记录
    if (userData.coinHistory.length > 100) {
      userData.coinHistory = userData.coinHistory.slice(0, 100);
    }
    
    return userData.healthCoins;
  }

  // 扣除健康币
  deductCoins(userData, amount, reason) {
    if (!userData.healthCoins || userData.healthCoins < amount) {
      return false;
    }
    
    userData.healthCoins -= amount;
    
    if (!userData.coinHistory) {
      userData.coinHistory = [];
    }
    
    userData.coinHistory.unshift({
      type: 'spend',
      amount: amount,
      reason: reason,
      balance: userData.healthCoins,
      timestamp: new Date().toISOString()
    });
    
    if (userData.coinHistory.length > 100) {
      userData.coinHistory = userData.coinHistory.slice(0, 100);
    }
    
    return true;
  }

  // 每日签到
  dailyCheckIn(userData) {
    const today = new Date().toDateString();
    
    if (!userData.checkInHistory) {
      userData.checkInHistory = [];
    }
    
    // 检查今天是否已签到
    const lastCheckIn = userData.checkInHistory[0];
    if (lastCheckIn && new Date(lastCheckIn.date).toDateString() === today) {
      return {
        success: false,
        message: '今天已经签到过了'
      };
    }
    
    // 计算连续签到天数
    const consecutiveDays = this.getConsecutiveCheckInDays(userData);
    
    // 基础签到奖励
    let totalCoins = this.coinRules.dailyCheckIn;
    let bonusMessages = [];
    
    // 连续签到奖励
    if (consecutiveDays + 1 >= 30) {
      totalCoins += this.coinRules.consecutiveCheckIn30;
      bonusMessages.push('连续30天签到奖励');
    } else if (consecutiveDays + 1 >= 7) {
      totalCoins += this.coinRules.consecutiveCheckIn7;
      bonusMessages.push('连续7天签到奖励');
    } else if (consecutiveDays + 1 >= 3) {
      totalCoins += this.coinRules.consecutiveCheckIn3;
      bonusMessages.push('连续3天签到奖励');
    }
    
    // 记录签到
    userData.checkInHistory.unshift({
      date: new Date().toISOString(),
      coins: totalCoins,
      consecutiveDays: consecutiveDays + 1
    });
    
    // 只保留最近90天记录
    if (userData.checkInHistory.length > 90) {
      userData.checkInHistory = userData.checkInHistory.slice(0, 90);
    }
    
    // 添加健康币
    this.addCoins(userData, totalCoins, `每日签到 (连续${consecutiveDays + 1}天)`);
    
    return {
      success: true,
      coins: totalCoins,
      consecutiveDays: consecutiveDays + 1,
      bonusMessages: bonusMessages,
      message: `签到成功！获得${totalCoins}健康币`
    };
  }

  // 获取连续签到天数
  getConsecutiveCheckInDays(userData) {
    if (!userData.checkInHistory || userData.checkInHistory.length === 0) {
      return 0;
    }
    
    let consecutive = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < userData.checkInHistory.length; i++) {
      const checkInDate = new Date(userData.checkInHistory[i].date);
      checkInDate.setHours(0, 0, 0, 0);
      
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      
      if (checkInDate.getTime() === expectedDate.getTime()) {
        consecutive++;
      } else {
        break;
      }
    }
    
    return consecutive;
  }

  // 运动完成奖励
  rewardExercise(userData) {
    const coins = this.coinRules.exerciseComplete;
    this.addCoins(userData, coins, '完成运动');
    return coins;
  }

  // 饮食记录奖励
  rewardDietLog(userData, isHealthy = false) {
    const coins = isHealthy ? this.coinRules.healthyMeal : this.coinRules.dietLog;
    this.addCoins(userData, coins, isHealthy ? '健康饮食记录' : '饮食记录');
    return coins;
  }

  // 体重更新奖励
  rewardWeightUpdate(userData) {
    const coins = this.coinRules.weightUpdate;
    this.addCoins(userData, coins, '体重记录');
    return coins;
  }

  // 获取今日可获得的任务
  getDailyTasks(userData) {
    const today = new Date().toDateString();
    
    // 检查今日完成情况
    const todayCheckIn = userData.checkInHistory && 
      userData.checkInHistory[0] && 
      new Date(userData.checkInHistory[0].date).toDateString() === today;
    
    const todayExercise = userData.exerciseLogs && 
      userData.exerciseLogs.some(log => 
        new Date(log.timestamp).toDateString() === today
      );
    
    const todayDiet = userData.dietLogs && 
      userData.dietLogs.some(log => 
        new Date(log.timestamp).toDateString() === today
      );
    
    const todayWeight = userData.weightHistory && 
      userData.weightHistory.some(log => 
        new Date(log.timestamp).toDateString() === today
      );
    
    return [
      {
        id: 'checkIn',
        name: '每日签到',
        coins: this.coinRules.dailyCheckIn,
        completed: todayCheckIn,
        icon: '📅'
      },
      {
        id: 'exercise',
        name: '完成运动',
        coins: this.coinRules.exerciseComplete,
        completed: todayExercise,
        icon: '🏃'
      },
      {
        id: 'diet',
        name: '记录饮食',
        coins: this.coinRules.dietLog,
        completed: todayDiet,
        icon: '🍽️'
      },
      {
        id: 'weight',
        name: '记录体重',
        coins: this.coinRules.weightUpdate,
        completed: todayWeight,
        icon: '⚖️'
      }
    ];
  }

  // 获取统计数据
  getStatistics(userData) {
    const totalEarned = userData.coinHistory
      ? userData.coinHistory
          .filter(h => h.type === 'earn')
          .reduce((sum, h) => sum + h.amount, 0)
      : 0;
    
    const totalSpent = userData.coinHistory
      ? userData.coinHistory
          .filter(h => h.type === 'spend')
          .reduce((sum, h) => sum + h.amount, 0)
      : 0;
    
    const consecutiveDays = this.getConsecutiveCheckInDays(userData);
    
    return {
      balance: this.getBalance(userData),
      totalEarned,
      totalSpent,
      consecutiveDays,
      checkInCount: userData.checkInHistory ? userData.checkInHistory.length : 0
    };
  }
}

module.exports = HealthCoinManager;
