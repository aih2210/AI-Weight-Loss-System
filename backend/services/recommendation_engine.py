"""
智能推荐引擎 - 整合所有AI模型提供个性化建议
"""
from typing import Dict, List
from datetime import datetime, timedelta
import random

class RecommendationEngine:
    """智能推荐引擎"""
    
    def __init__(self):
        self.tips_database = self._init_tips()
    
    def _init_tips(self) -> Dict:
        """初始化建议库"""
        return {
            'weight_loss': [
                "保持每日500-750卡路里的热量缺口，可以稳定减重",
                "充足的睡眠（7-9小时）有助于控制食欲激素",
                "多喝水，每天至少8杯，有助于代谢和减少饥饿感",
                "增加蛋白质摄入，有助于保持肌肉量和增加饱腹感",
            ],
            'plateau': [
                "尝试改变运动类型，给身体新的刺激",
                "检查是否有隐藏的热量摄入（调味料、饮料等）",
                "增加力量训练，提高基础代谢率",
                "考虑进行一次'欺骗餐'，重启代谢",
            ],
            'exercise': [
                "运动前30分钟吃点碳水，提供能量",
                "运动后补充蛋白质，帮助肌肉恢复",
                "每周至少3次有氧运动，每次30分钟以上",
                "力量训练和有氧运动结合效果最佳",
            ],
            'diet': [
                "用小盘子吃饭，视觉上增加满足感",
                "慢慢咀嚼，每口至少咀嚼20次",
                "餐前喝一杯水，增加饱腹感",
                "多吃高纤维食物，延长饱腹时间",
            ],
            'motivation': [
                "设定小目标，每次达成都奖励自己",
                "记录进步，看到变化会更有动力",
                "找个减重伙伴，互相监督鼓励",
                "关注健康而非体重数字，享受过程",
            ]
        }
    
    def generate_daily_recommendations(self, user_data: Dict) -> List[Dict]:
        """
        生成每日个性化建议
        
        Args:
            user_data: 用户数据
                - current_weight: 当前体重
                - target_weight: 目标体重
                - days_on_diet: 减重天数
                - weight_history: 体重历史
                - today_calories: 今日摄入
                - today_exercise: 今日运动
        """
        recommendations = []
        
        # 1. 体重进度分析
        weight_progress = user_data.get('current_weight', 70) - user_data.get('target_weight', 65)
        if weight_progress > 0:
            progress_pct = (1 - weight_progress / (user_data.get('start_weight', 75) - user_data.get('target_weight', 65))) * 100
            recommendations.append({
                'type': 'progress',
                'icon': '🎉',
                'title': '减重进度',
                'message': f'已完成{progress_pct:.1f}%的目标，继续保持！',
                'priority': 'high'
            })
        
        # 2. 今日饮食建议
        today_calories = user_data.get('today_calories', 0)
        target_calories = user_data.get('target_calories', 1500)
        remaining = target_calories - today_calories
        
        if remaining > 500:
            recommendations.append({
                'type': 'diet',
                'icon': '🍽️',
                'title': '饮食提醒',
                'message': f'今日还可摄入{remaining}卡路里，建议选择高蛋白低脂食物',
                'priority': 'medium'
            })
        elif remaining < 100:
            recommendations.append({
                'type': 'diet',
                'icon': '⚠️',
                'title': '饮食警告',
                'message': '今日热量接近上限，晚餐建议选择蔬菜沙拉',
                'priority': 'high'
            })
        
        # 3. 运动建议
        today_exercise = user_data.get('today_exercise', 0)
        if today_exercise < 200:
            recommendations.append({
                'type': 'exercise',
                'icon': '💪',
                'title': '运动提醒',
                'message': '今天还没有运动哦，来个30分钟快走吧！',
                'priority': 'medium'
            })
        
        # 4. 平台期检测
        weight_history = user_data.get('weight_history', [])
        if len(weight_history) >= 7:
            recent_change = weight_history[0] - weight_history[-1]
            if abs(recent_change) < 0.3:
                recommendations.append({
                    'type': 'plateau',
                    'icon': '📊',
                    'title': '平台期提示',
                    'message': '体重变化较小，建议调整运动强度或饮食结构',
                    'priority': 'high'
                })
        
        # 5. 随机健康小贴士
        tip_category = random.choice(list(self.tips_database.keys()))
        tip = random.choice(self.tips_database[tip_category])
        recommendations.append({
            'type': 'tip',
            'icon': '💡',
            'title': '健康小贴士',
            'message': tip,
            'priority': 'low'
        })
        
        return recommendations
    
    def generate_meal_plan(self, calorie_target: int, preferences: List[str] = None) -> Dict:
        """
        生成每日膳食计划
        
        Args:
            calorie_target: 目标卡路里
            preferences: 饮食偏好
        """
        # 三餐热量分配：早餐30%，午餐40%，晚餐30%
        breakfast_cal = calorie_target * 0.3
        lunch_cal = calorie_target * 0.4
        dinner_cal = calorie_target * 0.3
        
        meal_plan = {
            'breakfast': {
                'time': '07:00-09:00',
                'target_calories': round(breakfast_cal),
                'suggestions': [
                    '燕麦粥 + 鸡蛋 + 牛奶',
                    '全麦面包 + 鸡蛋 + 水果',
                    '豆浆 + 全麦馒头 + 鸡蛋'
                ]
            },
            'lunch': {
                'time': '11:30-13:00',
                'target_calories': round(lunch_cal),
                'suggestions': [
                    '鸡胸肉 + 糙米饭 + 西兰花',
                    '三文鱼 + 藜麦 + 蔬菜沙拉',
                    '豆腐 + 糙米饭 + 青菜'
                ]
            },
            'dinner': {
                'time': '18:00-19:30',
                'target_calories': round(dinner_cal),
                'suggestions': [
                    '蔬菜沙拉 + 鸡胸肉',
                    '清蒸鱼 + 蔬菜',
                    '豆腐汤 + 蔬菜'
                ]
            },
            'snacks': {
                'suggestions': [
                    '苹果（52卡）',
                    '香蕉（89卡）',
                    '无糖酸奶（60卡）',
                    '坚果10克（60卡）'
                ]
            }
        }
        
        return meal_plan
    
    def analyze_user_progress(self, user_data: Dict) -> Dict:
        """
        分析用户进度并生成报告
        
        Args:
            user_data: 用户数据
        """
        days_on_diet = user_data.get('days_on_diet', 0)
        start_weight = user_data.get('start_weight', 75)
        current_weight = user_data.get('current_weight', 70)
        target_weight = user_data.get('target_weight', 65)
        
        weight_lost = start_weight - current_weight
        weight_to_go = current_weight - target_weight
        progress_pct = (weight_lost / (start_weight - target_weight)) * 100 if start_weight != target_weight else 0
        
        # 预估达成时间
        if days_on_diet > 0 and weight_lost > 0:
            avg_loss_per_day = weight_lost / days_on_diet
            days_to_goal = weight_to_go / avg_loss_per_day if avg_loss_per_day > 0 else 0
            estimated_date = (datetime.now() + timedelta(days=int(days_to_goal))).strftime('%Y-%m-%d')
        else:
            estimated_date = '数据不足'
        
        # 评估进度
        if progress_pct >= 75:
            status = 'excellent'
            message = '太棒了！你已经接近目标，继续保持！'
        elif progress_pct >= 50:
            status = 'good'
            message = '进度良好，已经完成一半了！'
        elif progress_pct >= 25:
            status = 'fair'
            message = '稳步前进中，坚持就是胜利！'
        else:
            status = 'starting'
            message = '刚刚开始，相信自己一定能做到！'
        
        return {
            'days_on_diet': days_on_diet,
            'weight_lost': round(weight_lost, 1),
            'weight_to_go': round(weight_to_go, 1),
            'progress_percentage': round(progress_pct, 1),
            'estimated_completion_date': estimated_date,
            'status': status,
            'message': message,
            'achievements': self._generate_achievements(user_data)
        }
    
    def _generate_achievements(self, user_data: Dict) -> List[Dict]:
        """生成成就列表"""
        achievements = []
        
        days = user_data.get('days_on_diet', 0)
        weight_lost = user_data.get('start_weight', 75) - user_data.get('current_weight', 70)
        streak = user_data.get('streak', 0)
        
        if days >= 7:
            achievements.append({'icon': '🎖️', 'title': '坚持一周', 'unlocked': True})
        if days >= 30:
            achievements.append({'icon': '🏆', 'title': '坚持一月', 'unlocked': True})
        if weight_lost >= 1:
            achievements.append({'icon': '⭐', 'title': '减重1kg', 'unlocked': True})
        if weight_lost >= 5:
            achievements.append({'icon': '🌟', 'title': '减重5kg', 'unlocked': True})
        if streak >= 7:
            achievements.append({'icon': '🔥', 'title': '连续打卡7天', 'unlocked': True})
        
        return achievements
