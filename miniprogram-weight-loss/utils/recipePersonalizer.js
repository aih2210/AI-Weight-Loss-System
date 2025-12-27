// utils/recipePersonalizer.js
// 个性化食谱推荐系统

class RecipePersonalizer {
  constructor() {
    this.app = getApp();
  }

  /**
   * 基于用户历史生成个性化食谱推荐
   * @param {Array} recipeDatabase - 食谱数据库
   * @param {String} mealType - 餐次类型
   * @param {Number} targetCalories - 目标卡路里
   * @returns {Array} 推荐的食谱列表
   */
  getPersonalizedRecipes(recipeDatabase, mealType, targetCalories) {
    const userData = this.app.getData();
    
    // 1. 分析用户偏好
    const preferences = this.analyzeUserPreferences(userData);
    
    // 2. 筛选合适的食谱
    let candidates = recipeDatabase.filter(recipe => {
      // 餐次匹配
      if (recipe.mealType !== mealType) return false;
      
      // 卡路里范围（±20%）
      if (targetCalories) {
        const calorieRange = targetCalories * 0.2;
        if (Math.abs(recipe.calories - targetCalories) > calorieRange) {
          return false;
        }
      }
      
      return true;
    });

    // 3. 计算每个食谱的推荐分数
    candidates = candidates.map(recipe => ({
      ...recipe,
      score: this.calculateRecipeScore(recipe, preferences, userData)
    }));

    // 4. 按分数排序
    candidates.sort((a, b) => b.score - a.score);

    // 5. 添加推荐理由
    candidates = candidates.map(recipe => ({
      ...recipe,
      reason: this.generateRecommendationReason(recipe, preferences)
    }));

    return candidates;
  }

  /**
   * 分析用户饮食偏好
   */
  analyzeUserPreferences(userData) {
    const foodLogs = userData.foodLogs || [];
    const preferences = {
      favoriteIngredients: {},
      avoidIngredients: {},
      preferredCalorieRange: { min: 0, max: 1000 },
      preferredProtein: 0,
      preferredCarbs: 0,
      preferredFat: 0,
      mealTypeFrequency: {},
      timePreferences: {}
    };

    if (foodLogs.length === 0) {
      return preferences;
    }

    // 分析食材偏好（从食物名称推断）
    foodLogs.forEach(log => {
      const name = log.name || '';
      
      // 简单的关键词提取
      const keywords = ['鸡', '鱼', '虾', '牛', '猪', '蛋', '豆腐', '蔬菜', '水果', '米饭', '面条'];
      keywords.forEach(keyword => {
        if (name.includes(keyword)) {
          preferences.favoriteIngredients[keyword] = 
            (preferences.favoriteIngredients[keyword] || 0) + 1;
        }
      });
    });

    // 分析营养偏好（平均值）
    const totalCalories = foodLogs.reduce((sum, log) => sum + (log.calories || 0), 0);
    const totalProtein = foodLogs.reduce((sum, log) => sum + (log.protein || 0), 0);
    const totalCarbs = foodLogs.reduce((sum, log) => sum + (log.carbs || 0), 0);
    const totalFat = foodLogs.reduce((sum, log) => sum + (log.fat || 0), 0);

    preferences.preferredCalorieRange = {
      min: Math.max(0, (totalCalories / foodLogs.length) - 100),
      max: (totalCalories / foodLogs.length) + 100
    };
    preferences.preferredProtein = totalProtein / foodLogs.length;
    preferences.preferredCarbs = totalCarbs / foodLogs.length;
    preferences.preferredFat = totalFat / foodLogs.length;

    return preferences;
  }

  /**
   * 计算食谱推荐分数
   */
  calculateRecipeScore(recipe, preferences, userData) {
    let score = 50; // 基础分

    // 1. 食材匹配度（30分）
    let ingredientScore = 0;
    const ingredients = recipe.ingredients || [];
    ingredients.forEach(ingredient => {
      Object.keys(preferences.favoriteIngredients).forEach(keyword => {
        if (ingredient.includes(keyword)) {
          ingredientScore += preferences.favoriteIngredients[keyword];
        }
      });
    });
    score += Math.min(30, ingredientScore * 3);

    // 2. 营养匹配度（20分）
    const calorieMatch = 1 - Math.abs(recipe.calories - preferences.preferredCalorieRange.min) / 500;
    score += Math.max(0, calorieMatch * 20);

    // 3. 难度偏好（10分）
    if (recipe.difficulty === '简单') score += 10;
    else if (recipe.difficulty === '中等') score += 5;

    // 4. 时间偏好（10分）
    if (recipe.time <= 20) score += 10;
    else if (recipe.time <= 30) score += 5;

    // 5. 新鲜度（10分）- 避免重复推荐
    const recentRecipes = userData.recipes || [];
    const wasRecentlyGenerated = recentRecipes.some(r => 
      r.name === recipe.name && 
      Date.now() - r.id < 7 * 24 * 60 * 60 * 1000 // 7天内
    );
    if (!wasRecentlyGenerated) score += 10;

    // 6. 标签匹配（10分）
    const healthyTags = ['高蛋白', '低脂', '低卡', '营养', '健康'];
    const matchingTags = recipe.tags.filter(tag => healthyTags.includes(tag));
    score += matchingTags.length * 2;

    return Math.min(100, Math.max(0, score));
  }

  /**
   * 生成推荐理由
   */
  generateRecommendationReason(recipe, preferences) {
    const reasons = [];

    // 营养优势
    if (recipe.protein >= 25) {
      reasons.push('高蛋白');
    }
    if (recipe.calories < 300) {
      reasons.push('低卡路里');
    }
    if (recipe.fat < 10) {
      reasons.push('低脂肪');
    }

    // 便利性
    if (recipe.time <= 15) {
      reasons.push('快手菜');
    }
    if (recipe.difficulty === '简单') {
      reasons.push('简单易做');
    }

    // 食材匹配
    const favoriteIngredients = Object.keys(preferences.favoriteIngredients);
    const matchingIngredients = recipe.ingredients.filter(ing => 
      favoriteIngredients.some(fav => ing.includes(fav))
    );
    if (matchingIngredients.length > 0) {
      reasons.push('符合口味');
    }

    // 健康标签
    const healthTags = recipe.tags.filter(tag => 
      ['减脂', '营养', '健康', '清淡'].includes(tag)
    );
    reasons.push(...healthTags);

    return reasons.slice(0, 3).join(' · ') || '营养均衡';
  }

  /**
   * 生成替代食谱建议
   * @param {Object} originalFood - 原始食物
   * @param {Array} recipeDatabase - 食谱数据库
   * @returns {Array} 替代食谱列表
   */
  generateAlternatives(originalFood, recipeDatabase) {
    const targetCalories = originalFood.calories;
    const alternatives = [];

    // 寻找卡路里更低但满足感高的替代品
    recipeDatabase.forEach(recipe => {
      if (recipe.calories < targetCalories * 0.7) { // 至少减少30%卡路里
        const satisfactionScore = this.calculateSatisfactionScore(recipe);
        if (satisfactionScore >= 70) {
          alternatives.push({
            ...recipe,
            caloriesSaved: targetCalories - recipe.calories,
            satisfactionScore,
            reason: `比${originalFood.name}少${Math.round(targetCalories - recipe.calories)}卡路里，但同样美味`
          });
        }
      }
    });

    // 按卡路里节省排序
    alternatives.sort((a, b) => b.caloriesSaved - a.caloriesSaved);

    return alternatives.slice(0, 3);
  }

  /**
   * 计算满足感分数
   */
  calculateSatisfactionScore(recipe) {
    let score = 50;

    // 蛋白质含量（高蛋白更有饱腹感）
    if (recipe.protein >= 20) score += 20;
    else if (recipe.protein >= 15) score += 10;

    // 纤维含量（通过食材推断）
    const fiberIngredients = ['燕麦', '全麦', '蔬菜', '豆', '菌'];
    const hasFiber = recipe.ingredients.some(ing => 
      fiberIngredients.some(fiber => ing.includes(fiber))
    );
    if (hasFiber) score += 15;

    // 美味度（通过标签推断）
    const tastyTags = ['美味', '香', '鲜'];
    const isTasty = recipe.tags.some(tag => tastyTags.includes(tag));
    if (isTasty) score += 15;

    return Math.min(100, score);
  }
}

module.exports = RecipePersonalizer;
