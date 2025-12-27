"""
YOLO食物检测服务
基于YOLOv8的食物识别和检测系统
"""

import cv2
import numpy as np
from ultralytics import YOLO
from PIL import Image
import base64
from io import BytesIO
from typing import Dict, List, Tuple
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class YOLOFoodDetector:
    """YOLO食物检测器"""
    
    def __init__(self, model_path: str = 'yolov8n.pt'):
        """
        初始化YOLO检测器
        
        Args:
            model_path: YOLO模型路径
        """
        try:
            self.model = YOLO(model_path)
            logger.info(f"YOLO模型加载成功: {model_path}")
        except Exception as e:
            logger.error(f"YOLO模型加载失败: {e}")
            raise
        
        # 食物类别映射（COCO数据集中的食物类别）
        self.food_classes = {
            46: '香蕉',
            47: '苹果',
            48: '三明治',
            49: '橙子',
            50: '西兰花',
            51: '胡萝卜',
            52: '热狗',
            53: '披萨',
            54: '甜甜圈',
            55: '蛋糕'
        }
        
        # 扩展的食物营养数据库
        self.nutrition_db = {
            '香蕉': {'calories': 89, 'protein': 1.1, 'carbs': 22.8, 'fat': 0.3, 'category': '水果'},
            '苹果': {'calories': 52, 'protein': 0.3, 'carbs': 13.8, 'fat': 0.2, 'category': '水果'},
            '三明治': {'calories': 250, 'protein': 12, 'carbs': 35, 'fat': 8, 'category': '快餐'},
            '橙子': {'calories': 47, 'protein': 0.9, 'carbs': 11.8, 'fat': 0.1, 'category': '水果'},
            '西兰花': {'calories': 34, 'protein': 2.8, 'carbs': 7, 'fat': 0.4, 'category': '蔬菜'},
            '胡萝卜': {'calories': 39, 'protein': 1, 'carbs': 9, 'fat': 0.2, 'category': '蔬菜'},
            '热狗': {'calories': 290, 'protein': 10, 'carbs': 24, 'fat': 17, 'category': '快餐'},
            '披萨': {'calories': 266, 'protein': 11, 'carbs': 33, 'fat': 10, 'category': '快餐'},
            '甜甜圈': {'calories': 452, 'protein': 5, 'carbs': 51, 'fat': 25, 'category': '快餐'},
            '蛋糕': {'calories': 257, 'protein': 4, 'carbs': 42, 'fat': 9, 'category': '快餐'},
            # 添加更多中文食物
            '米饭': {'calories': 116, 'protein': 2.6, 'carbs': 25.9, 'fat': 0.3, 'category': '主食'},
            '面条': {'calories': 137, 'protein': 4.5, 'carbs': 28.2, 'fat': 0.5, 'category': '主食'},
            '鸡胸肉': {'calories': 165, 'protein': 31, 'carbs': 0, 'fat': 3.6, 'category': '肉类'},
            '牛肉': {'calories': 250, 'protein': 26, 'carbs': 0, 'fat': 15, 'category': '肉类'},
            '鸡蛋': {'calories': 147, 'protein': 12.6, 'carbs': 1.1, 'fat': 9.9, 'category': '蛋奶'},
            '豆腐': {'calories': 76, 'protein': 8.1, 'carbs': 4.3, 'fat': 3.7, 'category': '豆制品'},
        }
    
    def detect_from_base64(self, base64_image: str) -> Dict:
        """
        从Base64图片检测食物
        
        Args:
            base64_image: Base64编码的图片
            
        Returns:
            检测结果字典
        """
        try:
            # 解码Base64图片
            image_data = base64.b64decode(base64_image)
            image = Image.open(BytesIO(image_data))
            
            # 转换为numpy数组
            image_np = np.array(image)
            
            # 如果是RGBA，转换为RGB
            if image_np.shape[-1] == 4:
                image_np = cv2.cvtColor(image_np, cv2.COLOR_RGBA2RGB)
            
            # 执行检测
            results = self.model(image_np, conf=0.5)
            
            # 处理检测结果
            detections = self._process_results(results[0])
            
            if not detections:
                return {
                    'success': False,
                    'message': '未检测到食物',
                    'detections': []
                }
            
            # 选择置信度最高的检测结果
            best_detection = max(detections, key=lambda x: x['confidence'])
            
            return {
                'success': True,
                'message': '检测成功',
                'primary_food': best_detection,
                'all_detections': detections,
                'detection_count': len(detections)
            }
            
        except Exception as e:
            logger.error(f"检测失败: {e}")
            return {
                'success': False,
                'message': f'检测失败: {str(e)}',
                'detections': []
            }
    
    def _process_results(self, result) -> List[Dict]:
        """
        处理YOLO检测结果
        
        Args:
            result: YOLO检测结果
            
        Returns:
            处理后的检测列表
        """
        detections = []
        
        if result.boxes is None or len(result.boxes) == 0:
            return detections
        
        for box in result.boxes:
            class_id = int(box.cls[0])
            confidence = float(box.conf[0])
            
            # 只处理食物类别
            if class_id in self.food_classes:
                food_name = self.food_classes[class_id]
                
                # 获取营养信息
                nutrition = self.nutrition_db.get(food_name, {
                    'calories': 150,
                    'protein': 10,
                    'carbs': 20,
                    'fat': 5,
                    'category': '其他'
                })
                
                # 估算份量（基于边界框大小）
                bbox = box.xyxy[0].tolist()
                area = (bbox[2] - bbox[0]) * (bbox[3] - bbox[1])
                portion = self._estimate_portion(area, food_name)
                
                # 计算实际营养成分
                ratio = portion / 100
                
                detection = {
                    'name': food_name,
                    'confidence': round(confidence * 100, 1),
                    'category': nutrition['category'],
                    'portion': portion,
                    'calories': round(nutrition['calories'] * ratio),
                    'protein': round(nutrition['protein'] * ratio, 1),
                    'carbs': round(nutrition['carbs'] * ratio, 1),
                    'fat': round(nutrition['fat'] * ratio, 1),
                    'bbox': bbox,
                    'suggestions': self._generate_suggestions(food_name, nutrition, portion)
                }
                
                detections.append(detection)
        
        return detections
    
    def _estimate_portion(self, area: float, food_name: str) -> int:
        """
        根据边界框面积估算份量
        
        Args:
            area: 边界框面积
            food_name: 食物名称
            
        Returns:
            估算的份量（克）
        """
        # 基础份量映射
        base_portions = {
            '水果': 150,
            '蔬菜': 100,
            '主食': 150,
            '肉类': 100,
            '快餐': 200,
            '蛋奶': 50,
            '豆制品': 100
        }
        
        # 获取食物类别
        nutrition = self.nutrition_db.get(food_name, {})
        category = nutrition.get('category', '其他')
        base_portion = base_portions.get(category, 150)
        
        # 根据面积调整份量（简化算法）
        # 假设标准面积为100000像素
        area_ratio = min(area / 100000, 2.0)
        estimated_portion = int(base_portion * area_ratio)
        
        # 限制范围
        return max(50, min(estimated_portion, 500))
    
    def _generate_suggestions(self, food_name: str, nutrition: Dict, portion: int) -> List[str]:
        """
        生成营养建议
        
        Args:
            food_name: 食物名称
            nutrition: 营养信息
            portion: 份量
            
        Returns:
            建议列表
        """
        suggestions = []
        
        # 根据营养成分生成建议
        if nutrition.get('protein', 0) > 20:
            suggestions.append('💪 高蛋白食物，适合增肌减脂')
        
        if nutrition.get('carbs', 0) > 40:
            suggestions.append('🍚 碳水含量较高，建议控制份量')
        
        if nutrition.get('fat', 0) < 3:
            suggestions.append('✨ 低脂食物，减脂期推荐')
        elif nutrition.get('fat', 0) > 15:
            suggestions.append('⚠️ 脂肪含量较高，注意摄入量')
        
        if nutrition.get('calories', 0) < 50:
            suggestions.append('🌿 超低卡食物，可以多吃')
        elif nutrition.get('calories', 0) > 300:
            suggestions.append('🔥 高热量食物，建议少量食用')
        
        # 根据份量给建议
        if portion > 200:
            suggestions.append('📏 份量较大，建议适当减少')
        
        return suggestions


def create_yolo_detector():
    """创建YOLO检测器实例"""
    try:
        detector = YOLOFoodDetector()
        return detector
    except Exception as e:
        logger.error(f"创建YOLO检测器失败: {e}")
        return None


# 测试代码
if __name__ == '__main__':
    detector = create_yolo_detector()
    if detector:
        print("YOLO食物检测器初始化成功")
        print(f"支持的食物类别: {list(detector.food_classes.values())}")
