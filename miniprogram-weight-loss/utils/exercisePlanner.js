// utils/exercisePlanner.js
// 智能运动计划生成系统

class ExercisePlanner {
  constructor() {
    this.app = getApp();
    
    // 运动数据库
    this.exerciseDatabase = {
      // 有氧运动
      cardio: [
        { name: '快走', intensity: 'low', calories: 5, duration: [20, 30, 45, 60], equipment: 'none' },
        { name: '慢跑', intensity: 'medium', calories: 8, duration: [20, 30, 45], equipment: 'none' },
        { name: '跑步', intensity: 'high', calories: 12, duration: [15, 20, 30], equipment: 'none' },
        { name: '跳绳', intensity: 'high', calories: 13, duration: [10, 15, 20], equipment: 'rope' },
        { name: '游泳', intensity: 'medium', calories: 10, duration: [30, 45, 60], equipment: 'pool' },
        { name: '骑车', intensity: 'medium', calories: 7, duration: [30, 45, 60], equipment: 'bike' },
        { name: '爬楼梯', intensity: 'medium', calories: 9, duration: [10, 15, 20], equipment: 'none' },
        { name: '跳操', intensity: 'medium', calories: 8, duration: [20, 30, 45], equipment: 'none' }
      ],
      // 力量训练
      strength: [
        { name: '深蹲', intensity: 'medium', calories: 6, duration: [10, 15, 20], equipment: 'none', reps: [15, 20, 30] },
        { name: '俯卧撑', intensity: 'medium', calories: 7, duration: [10, 15, 20], equipment: 'none', reps: [10, 15, 20] },
        { name: '平板支撑', intensity: 'medium', calories: 5, duration: [5, 10, 15], equipment: 'none' },
        { name: '卷腹', intensity: 'low', calories: 4, duration: [10, 15, 20], equipment: 'none', reps: [20, 30, 40] },
        { name: '弓步蹲', intensity: 'medium', calories: 6, duration: [10, 15, 20], equipment: 'none', reps: [15, 20, 30] },
        { name: '臀桥', intensity: 'low', calories: 5, duration: [10, 15, 20], equipment: 'none', reps: [20, 30, 40] }
      ],
      // 拉伸放松
      stretch: [
        { name: '瑜伽', intensity: 'low', calories: 3, duration: [15, 20, 30], equipment: 'mat' },
        { name: '拉伸', intensity: 'low', calories: 2, duration: [10, 15, 20], equipment: 'none' },
        { name: '普拉提', intensity: 'low', calories: 4, duration: [20, 30, 45], equipment: 'mat' }
      ]
    };
  }

  /**
   * 生成个性化运动计划
   * @param {Object} userProfile - 用户档案
   * @returns {Object} 运动计划
   */
  generatePlan(userProfile) {
    const {
      fitnessLevel = 'beginner',  // beginner, intermediate, advanced
      preferences = [],            // 偏好的运动类型
      availableTime = 30,          // 可用时间（分钟）
      weightLossStage = 'initial', // initial, plateau, maintenance
      equipment = []               // 可用设备
    } = userProfile;

    // 1. 确定训练强度和频率
    const intensity = this.determineIntensity(fitnessLevel, weightLossStage);
    
    // 2. 选择合适的运动
    const exercises = this.selectExercises(
      fitnessLevel,
      preferences,
      availableTime,
      equipment,
      intensity
    );

    // 3. 生成周计划
    const weeklyPlan = this.generateWeeklyPlan(
      exercises,
      fitnessLevel,
      availableTime,
      weightLossStage
    );

    // 4. 计算预期效果
    const expectedResults = this.calculateExpectedResults(weeklyPlan);

    return {
      weeklyPlan,
      expectedResults,
      intensity,
      createdAt: Date.now(),
      nextAdjustment: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7天后调整
    };
  }

  /**
   * 确定训练强度
   */
  determineIntensity(fitnessLevel, weightLossStage) {
    const intensityMap = {
      beginner: {
        initial: { level: 'low', description: '轻度运动，建立习惯' },
        plateau: { level: 'medium', description: '中等强度，突破平台期' },
        maintenance: { level: 'low', description: '保持运动习惯' }
      },
      intermediate: {
        initial: { level: 'medium', description: '中等强度，稳步减重' },
        plateau: { level: 'high', description: '高强度，突破瓶颈' },
        maintenance: { level: 'medium', description: '维持体重' }
      },
      advanced: {
        initial: { level: 'high', description: '高强度训练' },
        plateau: { level: 'high', description: '变换训练方式' },
        maintenance: { level: 'medium', description: '保持体能' }
      }
    };

    return intensityMap[fitnessLevel][weightLossStage];
  }

  /**
   * 选择合适的运动
   */
  selectExercises(fitnessLevel, preferences, availableTime, equipment, intensity) {
    const selected = {
      cardio: [],
      strength: [],
      stretch: []
    };

    // 根据体能水平筛选
    const intensityFilter = (exercise) => {
      if (fitnessLevel === 'beginner') {
        return exercise.intensity !== 'high';
      } else if (fitnessLevel === 'intermediate') {
        return true;
      } else {
        return exercise.intensity !== 'low';
      }
    };

    // 根据设备筛选
    const equipmentFilter = (exercise) => {
      if (exercise.equipment === 'none') return true;
      return equipment.includes(exercise.equipment);
    };

    // 根据时间筛选
    const timeFilter = (exercise) => {
      return exercise.duration.some(d => d <= availableTime);
    };

    // 筛选有氧运动
    let cardioOptions = this.exerciseDatabase.cardio
      .filter(intensityFilter)
      .filter(equipmentFilter)
      .filter(timeFilter);

    // 如果有偏好，优先选择
    if (preferences.length > 0) {
      const preferred = cardioOptions.filter(e => 
        preferences.some(p => e.name.includes(p))
      );
      if (preferred.length > 0) {
        cardioOptions = preferred;
      }
    }

    selected.cardio = cardioOptions.slice(0, 3);

    // 筛选力量训练
    selected.strength = this.exerciseDatabase.strength
      .filter(intensityFilter)
      .filter(equipmentFilter)
      .filter(timeFilter)
      .slice(0, 4);

    // 筛选拉伸
    selected.stretch = this.exerciseDatabase.stretch
      .filter(equipmentFilter)
      .filter(timeFilter)
      .slice(0, 2);

    return selected;
  }

  /**
   * 生成周计划
   */
  generateWeeklyPlan(exercises, fitnessLevel, availableTime, weightLossStage) {
    const plan = [];
    const daysOfWeek = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

    // 根据体能水平确定训练天数
    const trainingDays = {
      beginner: 3,
      intermediate: 4,
      advanced: 5
    }[fitnessLevel];

    // 平台期增加训练天数
    const actualTrainingDays = weightLossStage === 'plateau' 
      ? Math.min(trainingDays + 1, 6) 
      : trainingDays;

    // 生成训练日
    const trainingDayIndices = this.selectTrainingDays(actualTrainingDays);

    for (let i = 0; i < 7; i++) {
      if (trainingDayIndices.includes(i)) {
        const dayPlan = this.generateDayPlan(
          exercises,
          fitnessLevel,
          availableTime,
          i % 2 === 0 ? 'cardio' : 'strength' // 交替有氧和力量
        );
        plan.push({
          day: daysOfWeek[i],
          dayIndex: i,
          isRestDay: false,
          ...dayPlan
        });
      } else {
        plan.push({
          day: daysOfWeek[i],
          dayIndex: i,
          isRestDay: true,
          activities: [{ name: '休息日', type: 'rest', description: '充分休息，恢复体能' }]
        });
      }
    }

    return plan;
  }

  /**
   * 选择训练日
   */
  selectTrainingDays(count) {
    // 避免连续3天训练
    const patterns = {
      3: [0, 2, 4],      // 周一、三、五
      4: [0, 2, 4, 6],   // 周一、三、五、日
      5: [0, 1, 3, 4, 6], // 周一、二、四、五、日
      6: [0, 1, 2, 4, 5, 6] // 周一到周三、周五到周日
    };

    return patterns[count] || patterns[3];
  }

  /**
   * 生成单日计划
   */
  generateDayPlan(exercises, fitnessLevel, availableTime, focus) {
    const activities = [];
    let totalTime = 0;
    let totalCalories = 0;

    // 热身（5分钟）
    activities.push({
      name: '热身',
      type: 'warmup',
      duration: 5,
      calories: 10,
      description: '动态拉伸，活动关节'
    });
    totalTime += 5;
    totalCalories += 10;

    // 主要训练
    const remainingTime = availableTime - 10; // 减去热身和放松时间

    if (focus === 'cardio' && exercises.cardio.length > 0) {
      // 有氧日
      const cardio = exercises.cardio[0];
      const duration = this.selectDuration(cardio.duration, remainingTime);
      activities.push({
        name: cardio.name,
        type: 'cardio',
        duration: duration,
        calories: cardio.calories * duration,
        intensity: cardio.intensity,
        description: this.getExerciseDescription(cardio, duration)
      });
      totalTime += duration;
      totalCalories += cardio.calories * duration;
    } else if (exercises.strength.length > 0) {
      // 力量日
      const timePerExercise = Math.floor(remainingTime / Math.min(3, exercises.strength.length));
      
      exercises.strength.slice(0, 3).forEach(exercise => {
        const duration = this.selectDuration(exercise.duration, timePerExercise);
        activities.push({
          name: exercise.name,
          type: 'strength',
          duration: duration,
          calories: exercise.calories * duration,
          intensity: exercise.intensity,
          reps: exercise.reps ? exercise.reps[1] : null,
          description: this.getExerciseDescription(exercise, duration)
        });
        totalTime += duration;
        totalCalories += exercise.calories * duration;
      });
    }

    // 放松（5分钟）
    if (exercises.stretch.length > 0) {
      const stretch = exercises.stretch[0];
      activities.push({
        name: '拉伸放松',
        type: 'cooldown',
        duration: 5,
        calories: 10,
        description: '静态拉伸，放松肌肉'
      });
      totalTime += 5;
      totalCalories += 10;
    }

    return {
      activities,
      totalTime,
      totalCalories,
      focus: focus === 'cardio' ? '有氧训练' : '力量训练'
    };
  }

  /**
   * 选择合适的时长
   */
  selectDuration(options, maxTime) {
    const suitable = options.filter(d => d <= maxTime);
    return suitable.length > 0 ? suitable[suitable.length - 1] : options[0];
  }

  /**
   * 获取运动描述
   */
  getExerciseDescription(exercise, duration) {
    const descriptions = {
      '快走': `保持中等速度，${duration}分钟`,
      '慢跑': `匀速慢跑，${duration}分钟`,
      '跑步': `中等配速，${duration}分钟`,
      '跳绳': `间歇跳绳，${duration}分钟`,
      '深蹲': `${exercise.reps ? exercise.reps[1] : 20}次 × 3组`,
      '俯卧撑': `${exercise.reps ? exercise.reps[1] : 15}次 × 3组`,
      '平板支撑': `${duration}秒 × 3组`,
      '卷腹': `${exercise.reps ? exercise.reps[1] : 30}次 × 3组`
    };

    return descriptions[exercise.name] || `${duration}分钟`;
  }

  /**
   * 计算预期效果
   */
  calculateExpectedResults(weeklyPlan) {
    const trainingDays = weeklyPlan.filter(d => !d.isRestDay).length;
    const totalCalories = weeklyPlan.reduce((sum, day) => 
      sum + (day.totalCalories || 0), 0
    );
    const avgCaloriesPerDay = Math.round(totalCalories / trainingDays);

    // 预期减重（1kg脂肪 ≈ 7700卡）
    const expectedWeightLoss = (totalCalories / 7700).toFixed(2);

    return {
      trainingDays,
      totalCalories,
      avgCaloriesPerDay,
      expectedWeightLoss: parseFloat(expectedWeightLoss),
      description: `每周训练${trainingDays}天，消耗约${totalCalories}卡，预计减重${expectedWeightLoss}kg`
    };
  }

  /**
   * 检测错过的训练
   */
  detectMissedWorkouts() {
    const userData = this.app.getData();
    const exerciseLogs = userData.exerciseLogs || [];
    const currentPlan = userData.exercisePlan;

    if (!currentPlan) return null;

    const today = new Date();
    const dayOfWeek = today.getDay(); // 0-6
    const last7Days = [];

    // 获取过去7天的日期
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      last7Days.push({
        date: this.app.formatDate(date),
        dayIndex: date.getDay()
      });
    }

    // 检查每天的完成情况
    const missedDays = [];
    last7Days.forEach(({ date, dayIndex }) => {
      const plannedDay = currentPlan.weeklyPlan.find(d => d.dayIndex === dayIndex);
      if (plannedDay && !plannedDay.isRestDay) {
        const hasLog = exerciseLogs.some(log => log.date === date);
        if (!hasLog) {
          missedDays.push({
            date,
            day: plannedDay.day,
            plan: plannedDay
          });
        }
      }
    });

    return {
      missedCount: missedDays.length,
      missedDays,
      consecutiveMissed: this.countConsecutiveMissed(missedDays, last7Days)
    };
  }

  /**
   * 计算连续错过天数
   */
  countConsecutiveMissed(missedDays, last7Days) {
    let count = 0;
    for (let i = last7Days.length - 1; i >= 0; i--) {
      const day = last7Days[i];
      if (missedDays.some(m => m.date === day.date)) {
        count++;
      } else {
        break;
      }
    }
    return count;
  }

  /**
   * 分析错过原因并生成最小可行方案
   */
  generateMinimalPlan(missedInfo) {
    const { missedCount, consecutiveMissed } = missedInfo;

    // 分析可能的原因
    const reasons = this.analyzeReasons(missedCount, consecutiveMissed);

    // 生成最小可行方案
    const minimalPlan = this.createMinimalPlan(consecutiveMissed);

    return {
      reasons,
      minimalPlan,
      encouragement: this.generateEncouragement(consecutiveMissed)
    };
  }

  /**
   * 分析错过原因
   */
  analyzeReasons(missedCount, consecutiveMissed) {
    const reasons = [];

    if (consecutiveMissed >= 3) {
      reasons.push({
        type: 'motivation',
        description: '可能缺乏动力',
        suggestion: '设定小目标，从5分钟开始'
      });
      reasons.push({
        type: 'difficulty',
        description: '计划可能太难',
        suggestion: '降低强度，选择更简单的运动'
      });
    }

    if (missedCount >= 4) {
      reasons.push({
        type: 'time',
        description: '时间安排可能不合理',
        suggestion: '调整训练时间，选择更灵活的时段'
      });
    }

    reasons.push({
      type: 'habit',
      description: '运动习惯尚未养成',
      suggestion: '从最小可行方案开始，建立习惯'
    });

    return reasons;
  }

  /**
   * 创建最小可行方案
   */
  createMinimalPlan(consecutiveMissed) {
    // 根据连续错过天数调整方案难度
    const plans = {
      0: {
        name: '标准5分钟方案',
        duration: 5,
        activities: [
          { name: '原地踏步', duration: 2, description: '热身' },
          { name: '深蹲', duration: 2, description: '10次' },
          { name: '拉伸', duration: 1, description: '放松' }
        ]
      },
      1: {
        name: '超简单3分钟方案',
        duration: 3,
        activities: [
          { name: '原地踏步', duration: 1, description: '热身' },
          { name: '深蹲', duration: 1, description: '5次' },
          { name: '拉伸', duration: 1, description: '放松' }
        ]
      },
      2: {
        name: '极简1分钟方案',
        duration: 1,
        activities: [
          { name: '深蹲', duration: 1, description: '5次，慢慢做' }
        ]
      }
    };

    const level = Math.min(Math.floor(consecutiveMissed / 2), 2);
    const plan = plans[level];

    return {
      ...plan,
      calories: plan.duration * 5,
      message: '不要求完美，只要开始就是胜利！',
      nextStep: '完成后可以继续，也可以就此结束'
    };
  }

  /**
   * 生成鼓励语
   */
  generateEncouragement(consecutiveMissed) {
    const messages = [
      {
        condition: consecutiveMissed === 0,
        text: '今天开始新的一天！即使只运动5分钟也很棒！'
      },
      {
        condition: consecutiveMissed === 1,
        text: '没关系，每个人都会有状态不好的时候。今天试试5分钟方案？'
      },
      {
        condition: consecutiveMissed === 2,
        text: '我理解坚持很难。要不要试试超简单的3分钟方案？'
      },
      {
        condition: consecutiveMissed >= 3,
        text: '重新开始永远不晚！1分钟的运动也比不运动强100倍！'
      }
    ];

    const message = messages.find(m => m.condition);
    return message ? message.text : messages[0].text;
  }

  /**
   * 周期性调整计划
   */
  adjustPlan(currentPlan, performanceData) {
    const {
      completionRate,    // 完成率
      avgCalories,       // 平均消耗
      weightChange,      // 体重变化
      feedback          // 用户反馈
    } = performanceData;

    const adjustments = [];

    // 根据完成率调整
    if (completionRate < 0.5) {
      adjustments.push({
        type: 'reduce_difficulty',
        description: '降低训练强度',
        reason: '完成率较低，可能计划太难'
      });
    } else if (completionRate > 0.9) {
      adjustments.push({
        type: 'increase_difficulty',
        description: '适当增加强度',
        reason: '完成率很高，可以挑战更高强度'
      });
    }

    // 根据体重变化调整
    if (weightChange >= 0) {
      adjustments.push({
        type: 'increase_intensity',
        description: '增加训练强度或频率',
        reason: '体重未下降，需要增加运动量'
      });
    }

    // 根据反馈调整
    if (feedback && feedback.tooHard) {
      adjustments.push({
        type: 'reduce_difficulty',
        description: '降低难度',
        reason: '用户反馈太难'
      });
    }

    return {
      needsAdjustment: adjustments.length > 0,
      adjustments,
      recommendation: this.generateAdjustmentRecommendation(adjustments)
    };
  }

  /**
   * 生成调整建议
   */
  generateAdjustmentRecommendation(adjustments) {
    if (adjustments.length === 0) {
      return '当前计划执行良好，继续保持！';
    }

    const recommendations = adjustments.map(a => a.description).join('；');
    return `建议：${recommendations}`;
  }
}

module.exports = ExercisePlanner;
