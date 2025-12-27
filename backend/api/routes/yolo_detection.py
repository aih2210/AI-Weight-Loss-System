"""
YOLO食物检测API路由
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import sys
import os

# 添加父目录到路径
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from yolo_food_detector import create_yolo_detector
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/yolo", tags=["YOLO检测"])

# 全局YOLO检测器实例
yolo_detector = None


class DetectionRequest(BaseModel):
    """检测请求模型"""
    image: str  # Base64编码的图片
    

class DetectionResponse(BaseModel):
    """检测响应模型"""
    success: bool
    message: str
    primary_food: Optional[dict] = None
    all_detections: list = []
    detection_count: int = 0


@router.on_event("startup")
async def startup_event():
    """启动时初始化YOLO检测器"""
    global yolo_detector
    try:
        yolo_detector = create_yolo_detector()
        if yolo_detector:
            logger.info("YOLO检测器初始化成功")
        else:
            logger.warning("YOLO检测器初始化失败，将使用降级方案")
    except Exception as e:
        logger.error(f"YOLO检测器初始化异常: {e}")


@router.post("/detect", response_model=DetectionResponse)
async def detect_food(request: DetectionRequest):
    """
    检测食物
    
    Args:
        request: 包含Base64图片的请求
        
    Returns:
        检测结果
    """
    global yolo_detector
    
    if not yolo_detector:
        raise HTTPException(
            status_code=503,
            detail="YOLO检测服务不可用"
        )
    
    try:
        # 移除Base64前缀（如果有）
        image_data = request.image
        if ',' in image_data:
            image_data = image_data.split(',')[1]
        
        # 执行检测
        result = yolo_detector.detect_from_base64(image_data)
        
        return DetectionResponse(**result)
        
    except Exception as e:
        logger.error(f"检测失败: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"检测失败: {str(e)}"
        )


@router.get("/health")
async def health_check():
    """健康检查"""
    global yolo_detector
    
    return {
        "status": "healthy" if yolo_detector else "degraded",
        "yolo_available": yolo_detector is not None,
        "supported_foods": list(yolo_detector.food_classes.values()) if yolo_detector else []
    }


@router.get("/info")
async def get_info():
    """获取检测器信息"""
    global yolo_detector
    
    if not yolo_detector:
        return {
            "available": False,
            "message": "YOLO检测器不可用"
        }
    
    return {
        "available": True,
        "model": "YOLOv8",
        "supported_classes": len(yolo_detector.food_classes),
        "food_list": list(yolo_detector.food_classes.values()),
        "nutrition_db_size": len(yolo_detector.nutrition_db)
    }
