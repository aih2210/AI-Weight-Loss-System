/**
 * 代谢率预测和平台期预警系统
 * 使用轻量级梯度提升树模型
 */

class MetabolismPredictor {
  constructor() {
    // 基础代谢率计算常量
    // 使用修正的Harris-Benedict公式（Mifflin-St Jeor公式更准确）
    this.BMR_CONSTANTS = {
      // Mifflin-St Jeor公式（更准确）
      male: { weight: 10, height: 6.25, age: 5, base: 5 },
      female: { weight: 10, height: 6.25, age: 5, base: -161 }
    };

    // Harris-Benedict公式（备用）
    this.BMR_CONSTANTS_HB = {
      male: { base: 88.362, weight: 13.397, height: 4.799, age: 5.677 },
      female: { base: 447.593, weight: 9.247, height: 3.098, age: 4.330 }
    };

    // 活动系数（基于科学研究）
    this.ACTIVITY_FACTORS = {
      sedentary: 1.2,      // 久坐（办公室工作，很少运动）
      light: 1.375,        // 轻度活动（每周1-3天轻度运动）
      moderate: 1.55,      // 中度活动（每周3-5天中等强度运动）
      active: 1.725,       // 高度活动（每周6-7天高强度运动）
      veryActive: 1.9      // 极高活动（体力劳动+每天高强度训练）
    };

    // 体脂率对代谢的影响系数
    this.BODY_FAT_FACTORS = {
      low: 1.05,      // 低体脂（男<15%，女<20%）
      normal: 1.0,    // 正常体脂（男15-20%，女20-25%）
      high: 0.95      // 高体脂（男>20%，女>25%）
    };

    // 平台期判定阈值（基于科学研究）
    this.PLATEAU_THRESHOLDS = {
      weightChangeRate: 0.002,  // 体重变化率 < 0.2%（每周）
      daysThreshold: 14,        // 持续14天
      bmrDecreaseRate: 0.05,    // BMR下降 > 5%
      weightStdThreshold: 0.5   // 体重标准差 < 0.5kg
    };

    // 健康减重速度（基于医学建议）
    this.HEALTHY_WEIGHT_LOSS = {
      minWeekly: 0.25,  // 最小：0.25kg/周
      maxWeekly: 1.0,   // 最大：1.0kg/周
      idealWeekly: 0.5  // 理想：0.5kg/周
    };

    // 能量转换常数
    this.ENERGY_CONSTANTS = {
      caloriesPerKgFat: 7700,    // 1kg脂肪 = 7700 kcal
      caloriesPerKgMuscle: 1100, // 1kg肌肉 = 1100 kcal
      waterWeightFactor: 0.3     // 水分重量波动因子
    };
  }

  /**
   * 计算基础代谢率 (BMR)
   * 使用Mifflin-St Jeor公式（比Harris-Benedict更准确）
   * 男性：BMR = 10 × 体重(kg) + 6.25 × 身高(cm) - 5 × 年龄 + 5
   * 女性：BMR = 10 × 体重(kg) + 6.25 × 身高(cm) - 5 × 年龄 - 161
   */
  calculateBMR(userData) {
    // 确保使用最新的体重数据
    const weight = userData.currentWeight || userData.weight || 60;
    const height = userData.height || 170;
    const age = userData.age || 25;
    const gender = userData.gender || 'female';
    
    const constants = this.BMR_CONSTANTS[gender] || this.BMR_CONSTANTS.female;
    
    // 使用Mifflin-St Jeor公式
    const bmr = (constants.weight * weight) + 
                (constants.height * height) - 
                (constants.age * age) + 
                constants.base;
    
    // 根据体脂率调整（如果有数据）
    let adjustedBMR = bmr;
    if (userData.bodyFat) {
      const bodyFatFactor = this.getBodyFatFactor(userData.bodyFat, gender);
      adjustedBMR = bmr * bodyFatFactor;
    }
    
    // 确保BMR在合理范围内（800-3000 kcal）
    const finalBMR = Math.max(800, Math.min(3000, Math.round(adjustedBMR)));
    
    return finalBMR;
  }

  /**
   * 获取体脂率影响因子
   */
  getBodyFatFactor(bodyFat, gender) {
    const thresholds = gender === 'male' ? 
      { low: 15, high: 20 } : 
      { low: 20, high: 25 };
    
    if (bodyFat < thresholds.low) {
      return this.BODY_FAT_FACTORS.low;
    } else if (bodyFat > thresholds.high) {
      return this.BODY_FAT_FACTORS.high;
    } else {
      return this.BODY_FAT_FACTORS.normal;
    }
  }

  /**
   * 计算总能量消耗 (TDEE)
   * TDEE = BMR × 活动系数
   */
  calculateTDEE(bmr, activityLevel = 'moderate') {
    const factor = this.ACTIVITY_FACTORS[activityLevel] || this.ACTIVITY_FACTORS.moderate;
    return Math.round(bmr * factor);
  }

  /**
   * 计算实际TDEE（基于真实数据）
   * 使用能量平衡方程反推：TDEE = 摄入 - (体重变化 × 7700 / 天数)
   */
  calculateActualTDEE(historyData) {
    if (!historyData || historyData.length < 7) {
      return null;
    }

    const recentData = historyData.slice(-14); // 最近14天
    const totalCalorieIntake = recentData.reduce((sum, d) => sum + (d.calories || 0), 0);
    const totalExerciseCalories = recentData.reduce((sum, d) => sum + (d.exerciseCalories || 0), 0);
    
    const startWeight = recentData[0].weight;
    const endWeight = recentData[recentData.length - 1].weight;
    const weightChange = endWeight - startWeight;
    const days = recentData.length;
    
    // 能量平衡方程：体重变化(kg) = (摄入 - TDEE) / 7700
    // 反推：TDEE = (摄入 - 体重变化 × 7700) / 天数
    const avgDailyIntake = totalCalorieIntake / days;
    const avgDailyExercise = totalExerciseCalories / days;
    const weightChangeCalories = weightChange * this.ENERGY_CONSTANTS.caloriesPerKgFat;
    const actualTDEE = avgDailyIntake + avgDailyExercise - (weightChangeCalories / days);
    
    return {
      tdee: Math.round(actualTDEE),
      avgIntake: Math.round(avgDailyIntake),
      avgExercise: Math.round(avgDailyExercise),
      weightChange: Math.round(weightChange * 10) / 10,
      days: days,
      confidence: this.calculateTDEEConfidence(recentData)
    };
  }

  /**
   * 计算TDEE置信度
   */
  calculateTDEEConfidence(data) {
    // 基于数据量和体重波动性
    const dataPoints = data.length;
    const weights = data.map(d => d.weight);
    const weightStd = this.calculateStd(weights);
    
    let confidence = 0.5;
    
    // 数据量越多，置信度越高
    if (dataPoints >= 14) confidence += 0.2;
    if (dataPoints >= 21) confidence += 0.1;
    
    // 体重波动小，置信度高
    if (weightStd < 0.5) confidence += 0.2;
    else if (weightStd < 1.0) confidence += 0.1;
    
    return Math.min(0.95, confidence);
  }

  /**
   * 预测代谢率变化
   * 基于历史数据使用简化的梯度提升模型
   */
  predictMetabolismChange(userData, historyData) {
    if (!historyData || historyData.length < 7) {
      return {
        currentBMR: this.calculateBMR(userData),
        predictedBMR: this.calculateBMR(userData),
        changeRate: 0,
        confidence: 0.5
      };
    }

    // 特征提取
    const features = this.extractFeatures(userData, historyData);
    
    // 使用决策树集成预测
    const predictions = this.ensemblePredict(features);
    
    const currentBMR = this.calculateBMR(userData);
    const predictedBMR = Math.round(currentBMR * (1 + predictions.changeRate));
    
    return {
      currentBMR,
      predictedBMR,
      changeRate: predictions.changeRate,
      confidence: predictions.confidence,
      factors: predictions.factors
    };
  }

  /**
   * 特征提取
   */
  extractFeatures(userData, historyData) {
    const recentData = historyData.slice(-30); // 最近30天
    
    // 确保使用最新的体重数据
    const currentWeight = userData.currentWeight || userData.weight || 60;
    const startWeight = userData.startWeight || currentWeight;
    
    // 1. 体重变化趋势
    const weightTrend = this.calculateTrend(recentData.map(d => d.weight));
    
    // 2. 热量摄入趋势
    const calorieTrend = this.calculateTrend(recentData.map(d => d.calories || 0));
    
    // 3. 运动消耗趋势
    const exerciseTrend = this.calculateTrend(recentData.map(d => d.exerciseCalories || 0));
    
    // 4. 体重变化速率
    const weightChangeRate = this.calculateChangeRate(recentData.map(d => d.weight));
    
    // 5. 热量赤字
    const avgCalorieDeficit = this.calculateAvgCalorieDeficit(userData, recentData);
    
    // 6. 减重持续时间
    const weightLossDuration = recentData.length;
    
    // 7. 体重波动性
    const weightVolatility = this.calculateVolatility(recentData.map(d => d.weight));
    
    // 8. 运动频率
    const exerciseFrequency = recentData.filter(d => (d.exerciseCalories || 0) > 0).length / recentData.length;
    
    return {
      weightTrend,
      calorieTrend,
      exerciseTrend,
      weightChangeRate,
      avgCalorieDeficit,
      weightLossDuration,
      weightVolatility,
      exerciseFrequency,
      currentWeight: currentWeight,
      startWeight: startWeight
    };
  }

  /**
   * 集成预测 - 简化的梯度提升树
   */
  ensemblePredict(features) {
    const trees = [
      this.tree1(features),
      this.tree2(features),
      this.tree3(features),
      this.tree4(features),
      this.tree5(features)
    ];

    // 加权平均
    const weights = [0.25, 0.20, 0.20, 0.20, 0.15];
    let changeRate = 0;
    let confidence = 0;

    trees.forEach((tree, i) => {
      changeRate += tree.changeRate * weights[i];
      confidence += tree.confidence * weights[i];
    });

    // 收集影响因素
    const factors = this.analyzeFactors(features);

    return { changeRate, confidence, factors };
  }

  /**
   * 决策树1: 基于体重变化趋势
   */
  tree1(features) {
    if (features.weightChangeRate < -0.01) {
      // 快速减重，代谢可能下降
      return { changeRate: -0.08, confidence: 0.8 };
    } else if (features.weightChangeRate < -0.005) {
      // 正常减重
      return { changeRate: -0.03, confidence: 0.7 };
    } else if (features.weightChangeRate < 0.002) {
      // 平台期
      return { changeRate: -0.05, confidence: 0.9 };
    } else {
      // 体重增加
      return { changeRate: 0.02, confidence: 0.6 };
    }
  }

  /**
   * 决策树2: 基于热量赤字
   */
  tree2(features) {
    if (features.avgCalorieDeficit > 800) {
      // 过大热量赤字
      return { changeRate: -0.10, confidence: 0.85 };
    } else if (features.avgCalorieDeficit > 500) {
      // 适中热量赤字
      return { changeRate: -0.04, confidence: 0.75 };
    } else if (features.avgCalorieDeficit > 200) {
      // 小热量赤字
      return { changeRate: -0.02, confidence: 0.7 };
    } else {
      // 无热量赤字
      return { changeRate: 0, confidence: 0.6 };
    }
  }

  /**
   * 决策树3: 基于减重持续时间
   */
  tree3(features) {
    const totalWeightLoss = features.startWeight - features.currentWeight;
    const lossRate = totalWeightLoss / features.startWeight;

    if (features.weightLossDuration > 60 && lossRate > 0.1) {
      // 长期大幅减重
      return { changeRate: -0.12, confidence: 0.9 };
    } else if (features.weightLossDuration > 30 && lossRate > 0.05) {
      // 中期减重
      return { changeRate: -0.06, confidence: 0.8 };
    } else if (features.weightLossDuration > 14) {
      // 短期减重
      return { changeRate: -0.03, confidence: 0.7 };
    } else {
      // 刚开始
      return { changeRate: 0, confidence: 0.5 };
    }
  }

  /**
   * 决策树4: 基于运动情况
   */
  tree4(features) {
    if (features.exerciseFrequency > 0.7 && features.exerciseTrend > 0) {
      // 高频运动且增加
      return { changeRate: 0.02, confidence: 0.8 };
    } else if (features.exerciseFrequency > 0.5) {
      // 中等运动
      return { changeRate: 0, confidence: 0.7 };
    } else if (features.exerciseFrequency > 0.2) {
      // 低频运动
      return { changeRate: -0.02, confidence: 0.6 };
    } else {
      // 几乎不运动
      return { changeRate: -0.05, confidence: 0.75 };
    }
  }

  /**
   * 决策树5: 基于体重波动性
   */
  tree5(features) {
    if (features.weightVolatility > 2) {
      // 高波动
      return { changeRate: -0.03, confidence: 0.5 };
    } else if (features.weightVolatility > 1) {
      // 中等波动
      return { changeRate: -0.02, confidence: 0.7 };
    } else if (features.weightVolatility < 0.3) {
      // 极低波动（可能平台期）
      return { changeRate: -0.06, confidence: 0.85 };
    } else {
      // 正常波动
      return { changeRate: -0.01, confidence: 0.8 };
    }
  }

  /**
   * 分析影响因素
   */
  analyzeFactors(features) {
    const factors = [];

    if (features.weightChangeRate < 0.002 && features.weightChangeRate > -0.002) {
      factors.push({ name: '体重停滞', impact: 'high', value: features.weightChangeRate });
    }

    if (features.avgCalorieDeficit > 700) {
      factors.push({ name: '热量赤字过大', impact: 'high', value: features.avgCalorieDeficit });
    }

    if (features.exerciseFrequency < 0.3) {
      factors.push({ name: '运动不足', impact: 'medium', value: features.exerciseFrequency });
    }

    if (features.weightLossDuration > 45) {
      factors.push({ name: '长期减重', impact: 'medium', value: features.weightLossDuration });
    }

    if (features.weightVolatility < 0.3) {
      factors.push({ name: '体重波动小', impact: 'medium', value: features.weightVolatility });
    }

    return factors;
  }

  /**
   * 平台期检测
   */
  detectPlateau(historyData) {
    if (!historyData || historyData.length < this.PLATEAU_THRESHOLDS.daysThreshold) {
      return {
        isPlateau: false,
        confidence: 0,
        duration: 0,
        recommendation: []
      };
    }

    const recentData = historyData.slice(-this.PLATEAU_THRESHOLDS.daysThreshold);
    const weights = recentData.map(d => d.weight);
    
    // 计算体重变化率
    const weightChangeRate = Math.abs(this.calculateChangeRate(weights));
    
    // 计算体重标准差
    const weightStd = this.calculateStd(weights);
    
    // 判定平台期
    const isPlateau = weightChangeRate < this.PLATEAU_THRESHOLDS.weightChangeRate && 
                      weightStd < 0.5;
    
    // 计算置信度
    let confidence = 0;
    if (isPlateau) {
      confidence = Math.min(0.95, 0.5 + (this.PLATEAU_THRESHOLDS.daysThreshold / recentData.length) * 0.5);
    }

    // 生成建议
    const recommendations = isPlateau ? this.generatePlateauRecommendations(historyData) : [];

    return {
      isPlateau,
      confidence,
      duration: isPlateau ? recentData.length : 0,
      weightChangeRate,
      recommendations
    };
  }

  /**
   * 生成平台期突破建议
   */
  generatePlateauRecommendations(historyData) {
    const recommendations = [];
    const recentData = historyData.slice(-14);
    
    // 分析热量摄入
    const avgCalories = recentData.reduce((sum, d) => sum + (d.calories || 0), 0) / recentData.length;
    if (avgCalories > 1800) {
      recommendations.push({
        type: 'diet',
        priority: 'high',
        title: '调整饮食结构',
        content: '当前热量摄入较高，建议减少100-200卡路里，增加蛋白质比例'
      });
    }

    // 分析运动情况
    const exerciseDays = recentData.filter(d => (d.exerciseCalories || 0) > 0).length;
    if (exerciseDays < 7) {
      recommendations.push({
        type: 'exercise',
        priority: 'high',
        title: '增加运动频率',
        content: '建议每周至少运动4-5次，尝试HIIT或力量训练'
      });
    }

    // 通用建议
    recommendations.push({
      type: 'general',
      priority: 'medium',
      title: '改变运动方式',
      content: '身体已适应当前运动，尝试新的运动类型或增加强度'
    });

    recommendations.push({
      type: 'general',
      priority: 'medium',
      title: '调整作息',
      content: '保证7-8小时睡眠，减少压力，有助于突破平台期'
    });

    recommendations.push({
      type: 'diet',
      priority: 'low',
      title: '尝试间歇性断食',
      content: '可以尝试16:8断食法，帮助重启代谢'
    });

    return recommendations;
  }

  /**
   * 计算趋势（线性回归斜率）
   */
  calculateTrend(data) {
    if (data.length < 2) return 0;
    
    const n = data.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const y = data;
    
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    return slope;
  }

  /**
   * 计算变化率
   */
  calculateChangeRate(data) {
    if (data.length < 2) return 0;
    const first = data[0];
    const last = data[data.length - 1];
    return (last - first) / first;
  }

  /**
   * 计算平均热量赤字
   */
  calculateAvgCalorieDeficit(userData, historyData) {
    const bmr = this.calculateBMR(userData);
    const tdee = this.calculateTDEE(bmr);
    
    const deficits = historyData.map(d => {
      const intake = d.calories || 0;
      const burn = d.exerciseCalories || 0;
      return tdee - intake + burn;
    });
    
    return deficits.reduce((a, b) => a + b, 0) / deficits.length;
  }

  /**
   * 计算波动性（标准差）
   */
  calculateVolatility(data) {
    return this.calculateStd(data);
  }

  /**
   * 计算标准差
   */
  calculateStd(data) {
    if (data.length < 2) return 0;
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
    return Math.sqrt(variance);
  }

  /**
   * 生成完整分析报告
   */
  generateReport(userData, historyData) {
    const metabolism = this.predictMetabolismChange(userData, historyData);
    const plateau = this.detectPlateau(historyData);
    const weightTrend = this.predictWeightTrend(userData, historyData, metabolism);
    const currentBMR = metabolism.currentBMR;
    const currentTDEE = this.calculateTDEE(currentBMR);

    return {
      metabolism: {
        currentBMR,
        currentTDEE,
        predictedBMR: metabolism.predictedBMR,
        changeRate: metabolism.changeRate,
        confidence: metabolism.confidence,
        factors: metabolism.factors
      },
      plateau: {
        detected: plateau.isPlateau,
        confidence: plateau.confidence,
        duration: plateau.duration,
        recommendations: plateau.recommendations
      },
      weightTrend: weightTrend,
      summary: this.generateSummary(metabolism, plateau, weightTrend),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * 预测未来体重趋势
   * 基于能量平衡方程：体重变化 = (摄入 - 消耗) / 7700 kcal
   */
  predictWeightTrend(userData, historyData, metabolism) {
    const predictions = [];
    
    // 确保使用最新的体重数据
    const currentWeight = userData.currentWeight || userData.weight || 60;
    const targetWeight = userData.targetWeight || currentWeight - 5;
    const currentBMR = metabolism.currentBMR;
    const predictedBMR = metabolism.predictedBMR;
    
    // 分析历史数据获取平均值
    const recentData = historyData.slice(-14); // 最近14天
    
    // 如果历史数据不足，使用默认值
    let avgCalorieIntake = 1500;
    let avgExerciseCalories = 200;
    
    if (recentData.length > 0) {
      const validCalories = recentData.filter(d => d.calories > 0);
      const validExercise = recentData.filter(d => d.exerciseCalories > 0);
      
      if (validCalories.length > 0) {
        avgCalorieIntake = this.calculateAverage(validCalories.map(d => d.calories));
      }
      if (validExercise.length > 0) {
        avgExerciseCalories = this.calculateAverage(validExercise.map(d => d.exerciseCalories));
      }
    }
    
    // 预测未来7天
    let predictedWeight = currentWeight;
    let currentDayBMR = currentBMR;
    const bmrDecayRate = (predictedBMR - currentBMR) / 7; // 每天的BMR变化
    
    for (let day = 1; day <= 7; day++) {
      // 更新当天的BMR（逐渐适应）
      currentDayBMR += bmrDecayRate;
      const tdee = this.calculateTDEE(currentDayBMR);
      
      // 计算能量平衡
      const energyBalance = avgCalorieIntake - tdee - avgExerciseCalories;
      
      // 体重变化（7700 kcal = 1 kg体重）
      const weightChange = energyBalance / this.ENERGY_CONSTANTS.caloriesPerKgFat;
      predictedWeight += weightChange;
      
      // 确保预测体重在合理范围内
      predictedWeight = Math.max(30, Math.min(200, predictedWeight));
      
      // 添加预测点
      predictions.push({
        day: day,
        date: this.getFutureDate(day),
        weight: Math.round(predictedWeight * 10) / 10,
        weightChange: Math.round(weightChange * 1000) / 1000,
        bmr: Math.round(currentDayBMR),
        tdee: Math.round(tdee),
        energyBalance: Math.round(energyBalance),
        confidence: this.calculatePredictionConfidence(day, historyData.length)
      });
    }
    
    // 生成趋势分析
    const totalChange = predictedWeight - currentWeight;
    const weeklyRate = (totalChange / currentWeight) * 100;
    
    return {
      predictions,
      summary: {
        currentWeight: Math.round(currentWeight * 10) / 10,
        predictedWeight: Math.round(predictedWeight * 10) / 10,
        totalChange: Math.round(totalChange * 10) / 10,
        weeklyRate: Math.round(weeklyRate * 10) / 10,
        avgDailyChange: Math.round((totalChange / 7) * 1000) / 1000
      },
      assumptions: {
        avgCalorieIntake: Math.round(avgCalorieIntake),
        avgExerciseCalories: Math.round(avgExerciseCalories),
        startBMR: Math.round(currentBMR),
        endBMR: Math.round(currentDayBMR)
      },
      recommendations: this.generateTrendRecommendations(predictions, userData)
    };
  }

  /**
   * 计算预测置信度
   */
  calculatePredictionConfidence(day, historyLength) {
    // 基础置信度
    let confidence = 0.9;
    
    // 根据预测天数衰减
    confidence -= (day - 1) * 0.08;
    
    // 根据历史数据量调整
    if (historyLength < 7) {
      confidence *= 0.6;
    } else if (historyLength < 14) {
      confidence *= 0.8;
    } else if (historyLength < 30) {
      confidence *= 0.9;
    }
    
    return Math.max(0.3, Math.min(0.95, confidence));
  }

  /**
   * 获取未来日期
   */
  getFutureDate(daysAhead) {
    const date = new Date();
    date.setDate(date.getDate() + daysAhead);
    return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' });
  }

  /**
   * 计算平均值
   */
  calculateAverage(arr) {
    if (arr.length === 0) return 0;
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  }

  /**
   * 生成趋势建议
   */
  generateTrendRecommendations(predictions, userData) {
    const recommendations = [];
    const lastPrediction = predictions[predictions.length - 1];
    
    // 确保使用最新的体重数据
    const currentWeight = userData.currentWeight || userData.weight || 60;
    const targetWeight = userData.targetWeight || currentWeight - 5;
    const totalChange = lastPrediction.weight - currentWeight;
    
    // 分析预测趋势
    if (totalChange > 0.5) {
      // 预测体重上升
      recommendations.push({
        type: 'warning',
        priority: 'high',
        title: '⚠️ 预测体重上升',
        content: `按当前计划，7天后体重可能增加${Math.abs(totalChange).toFixed(1)}kg。建议减少热量摄入或增加运动量。`,
        action: 'adjust_diet'
      });
    } else if (totalChange < -1.5) {
      // 预测体重下降过快
      recommendations.push({
        type: 'warning',
        priority: 'high',
        title: '⚠️ 减重速度过快',
        content: `预测7天减重${Math.abs(totalChange).toFixed(1)}kg，速度过快可能影响健康。建议适当增加热量摄入。`,
        action: 'slow_down'
      });
    } else if (totalChange >= -1.5 && totalChange <= -0.5) {
      // 理想减重速度
      recommendations.push({
        type: 'success',
        priority: 'medium',
        title: '✅ 减重速度理想',
        content: `预测7天减重${Math.abs(totalChange).toFixed(1)}kg，速度适中且健康。继续保持当前计划！`,
        action: 'maintain'
      });
    } else if (totalChange > -0.5 && totalChange <= 0) {
      // 减重缓慢
      recommendations.push({
        type: 'info',
        priority: 'medium',
        title: '📊 减重速度较慢',
        content: `预测7天减重${Math.abs(totalChange).toFixed(1)}kg。如需加快进度，可适当增加运动或减少热量摄入。`,
        action: 'speed_up'
      });
    }
    
    // 检查是否接近目标
    const remainingWeight = currentWeight - targetWeight;
    if (remainingWeight <= 2 && remainingWeight > 0) {
      recommendations.push({
        type: 'success',
        priority: 'high',
        title: '🎯 接近目标',
        content: `距离目标体重仅剩${remainingWeight.toFixed(1)}kg！建议放慢减重速度，逐步过渡到维持期。`,
        action: 'transition'
      });
    }
    
    // 能量平衡建议
    const avgEnergyBalance = this.calculateAverage(predictions.map(p => p.energyBalance));
    if (avgEnergyBalance > 200) {
      recommendations.push({
        type: 'diet',
        priority: 'medium',
        title: '🍽️ 调整饮食',
        content: `当前平均热量盈余${Math.round(avgEnergyBalance)} kcal/天。建议减少200-300 kcal摄入。`,
        action: 'reduce_calories'
      });
    } else if (avgEnergyBalance < -800) {
      recommendations.push({
        type: 'diet',
        priority: 'high',
        title: '🍽️ 增加摄入',
        content: `当前平均热量赤字${Math.abs(Math.round(avgEnergyBalance))} kcal/天，过大可能影响代谢。建议增加100-200 kcal。`,
        action: 'increase_calories'
      });
    }
    
    // 运动建议
    const avgExercise = this.calculateAverage(predictions.map(p => p.tdee)) * 0.2; // 假设运动占TDEE的20%
    if (predictions[0].energyBalance > 0 && avgExercise < 200) {
      recommendations.push({
        type: 'exercise',
        priority: 'medium',
        title: '🏃 增加运动',
        content: '当前运动量较少。建议每天增加30分钟中等强度运动，消耗200-300 kcal。',
        action: 'increase_exercise'
      });
    }
    
    return recommendations;
  }

  /**
   * 生成摘要
   */
  generateSummary(metabolism, plateau, weightTrend) {
    const summary = [];

    // 代谢状态
    if (metabolism.changeRate < -0.08) {
      summary.push('⚠️ 代谢率显著下降，建议调整减重策略');
    } else if (metabolism.changeRate < -0.04) {
      summary.push('📉 代谢率轻度下降，属于正常范围');
    } else if (metabolism.changeRate > 0) {
      summary.push('📈 代谢率保持良好');
    }

    // 平台期状态
    if (plateau.isPlateau) {
      summary.push(`🔴 检测到平台期（已持续${plateau.duration}天）`);
    } else {
      summary.push('✅ 减重进展正常');
    }

    // 体重趋势
    const trendChange = weightTrend.summary.totalChange;
    if (trendChange > 0.5) {
      summary.push(`⚠️ 预测7天后体重上升${trendChange.toFixed(1)}kg`);
    } else if (trendChange < -1.5) {
      summary.push(`⚠️ 预测减重速度过快（${Math.abs(trendChange).toFixed(1)}kg/周）`);
    } else if (trendChange >= -1.5 && trendChange <= -0.5) {
      summary.push(`✅ 预测减重速度理想（${Math.abs(trendChange).toFixed(1)}kg/周）`);
    } else {
      summary.push(`📊 预测减重较慢（${Math.abs(trendChange).toFixed(1)}kg/周）`);
    }

    // 置信度
    if (metabolism.confidence > 0.8) {
      summary.push('🎯 预测置信度高');
    }

    return summary;
  }
}

// 导出单例
const metabolismPredictor = new MetabolismPredictor();

module.exports = metabolismPredictor;
