"""
代谢建模API路由
"""
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter()

class MetabolismData(BaseModel):
    user_id: str
    weight: float
    height: float
    age: int
    gender: str

@router.post("/predict-bmr")
async def predict_bmr(data: MetabolismData):
    """预测基础代谢率"""
    return {"bmr": 1500, "message": "BMR预测功能待实现"}

@router.post("/detect-plateau")
async def detect_plateau(user_id: str, weight_history: List[float]):
    """检测平台期"""
    return {"plateau_detected": False, "message": "平台期检测功能待实现"}

@router.post("/predict-weight")
async def predict_weight(user_id: str, days: int = 7):
    """预测未来体重变化"""
    return {"predictions": [], "message": "体重预测功能待实现"}
