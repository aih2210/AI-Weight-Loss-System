# API文档

## 基础信息

- 基础URL: `http://localhost:8000/api`
- 所有请求和响应均为JSON格式

## 用户管理

### 注册用户
```
POST /users/register
```

### 获取用户档案
```
GET /users/{user_id}
```

## 代谢建模

### 预测基础代谢率
```
POST /metabolism/predict-bmr
```

### 检测平台期
```
POST /metabolism/detect-plateau
```

## 饮食管理

### 识别食物
```
POST /diet/recognize-food
```

### 记录饮食
```
POST /diet/log-food
```

### 生成替代食谱
```
POST /diet/generate-recipe
```

## 运动管理

### 生成运动计划
```
POST /exercise/generate-plan
```

### 记录运动
```
POST /exercise/log-exercise
```

### 分析依从性
```
GET /exercise/analyze-adherence/{user_id}
```
