"""
智能推荐API路由
"""
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from services.recommendation_engine import RecommendationEngine

router = APIRouter()
recommendation_engine = RecommendationEngine()

class UserProgressData(BaseModel):
    user_id: str
    current_weight: float
    target_weight: float
    start_weight: float
    days_on_diet: int
    today_calories: int
    today_exercise: int
    target_calories: int
    weight_history: List[float]
    streak: int

@router.post("/daily")
async def get_daily_recommendations(data: UserProgressData):
    """获取每日个性化建议"""
    recommendations = recommendation_engine.generate_daily_recommendations(data.dict())
    return {
        "success": True,
        "recommendations": recommendations
    }

@router.get("/meal-plan/{calorie_target}")
async def get_meal_plan(calorie_target: int):
    """获取膳食计划"""
    meal_plan = recommendation_engine.generate_meal_plan(calorie_target)
    return {
        "success": True,
        "meal_plan": meal_plan
    }

@router.post("/progress-report")
async def get_progress_report(data: UserProgressData):
    """获取进度报告"""
    report = recommendation_engine.analyze_user_progress(data.dict())
    return {
        "success": True,
        "report": report
    }
