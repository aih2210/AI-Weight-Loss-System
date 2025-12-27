# ⚡ YOLO食物检测 - 快速部署指南

## 🎯 部署概述

本指南将帮助你在**5-10分钟**内部署YOLO食物检测服务。

## 📋 前置要求

### 硬件要求
- **CPU**：2核+
- **内存**：4GB+
- **磁盘**：5GB+
- **GPU**：可选（NVIDIA显卡，用于加速）

### 软件要求
- **Python**：3.8+
- **Docker**：可选（推荐）
- **操作系统**：Windows/Linux/macOS

## 🚀 方案选择

### 方案1：Docker部署（推荐⭐⭐⭐⭐⭐）
- ✅ 最简单
- ✅ 环境隔离
- ✅ 一键启动
- ❌ 需要安装Docker

### 方案2：本地部署（⭐⭐⭐⭐）
- ✅ 直接运行
- ✅ 易于调试
- ❌ 需要配置环境
- ❌ 可能有依赖冲突

### 方案3：云端部署（⭐⭐⭐）
- ✅ 高可用
- ✅ 易于扩展
- ❌ 需要服务器
- ❌ 有运营成本

## 📦 方案1：Docker部署（推荐）

### 步骤1：安装Docker

#### Windows
1. 下载Docker Desktop：https://www.docker.com/products/docker-desktop
2. 安装并启动Docker Desktop
3. 验证安装：
```bash
docker --version
```

#### Linux
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo systemctl start docker
```

#### macOS
1. 下载Docker Desktop for Mac
2. 安装并启动
3. 验证安装

### 步骤2：构建镜像

```bash
cd backend
docker build -f Dockerfile.yolo -t yolo-food-detector .
```

### 步骤3：启动服务

```bash
docker run -d \
  --name yolo-detector \
  -p 8000:8000 \
  yolo-food-detector
```

或使用docker-compose：
```bash
docker-compose -f docker-compose.yolo.yml up -d
```

### 步骤4：验证服务

```bash
curl http://localhost:8000/api/yolo/health
```

预期输出：
```json
{
  "status": "healthy",
  "yolo_available": true,
  "supported_foods": [...]
}
```

### 步骤5：配置小程序

在 `utils/config.js` 中添加：
```javascript
const YOLO_API_URL = 'http://localhost:8000/api/yolo';
```

## 🔧 方案2：本地部署

### 步骤1：安装Python

确保已安装Python 3.8+：
```bash
python --version
```

### 步骤2：创建虚拟环境

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/macOS
source venv/bin/activate
```

### 步骤3：安装依赖

```bash
pip install -r requirements.txt
```

这将安装：
- ultralytics（YOLO）
- opencv-python
- torch
- torchvision
- fastapi
- uvicorn
- 其他依赖

### 步骤4：下载模型

```bash
python -c "from ultralytics import YOLO; YOLO('yolov8n.pt')"
```

模型会自动下载到：
- Windows：`C:\Users\<用户名>\.cache\ultralytics\`
- Linux/macOS：`~/.cache/ultralytics/`

### 步骤5：启动服务

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 步骤6：验证服务

打开浏览器访问：
```
http://localhost:8000/docs
```

应该看到FastAPI的交互式文档。

### 步骤7：测试检测

```bash
curl -X POST http://localhost:8000/api/yolo/detect \
  -H "Content-Type: application/json" \
  -d '{"image": "base64_encoded_image"}'
```

## ☁️ 方案3：云端部署

### 选项A：阿里云ECS

#### 1. 创建ECS实例
- 规格：2核4GB
- 系统：Ubuntu 20.04
- 带宽：1Mbps+

#### 2. 连接服务器
```bash
ssh root@your-server-ip
```

#### 3. 安装Docker
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

#### 4. 上传代码
```bash
scp -r backend root@your-server-ip:/root/
```

#### 5. 部署服务
```bash
cd /root/backend
docker-compose -f docker-compose.yolo.yml up -d
```

#### 6. 配置防火墙
```bash
# 开放8000端口
sudo ufw allow 8000
```

#### 7. 配置Nginx（可选）
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location /api/yolo/ {
        proxy_pass http://localhost:8000/api/yolo/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 选项B：腾讯云SCF

#### 1. 创建云函数
- 运行环境：Python 3.9
- 内存：1024MB
- 超时时间：30秒

#### 2. 上传代码
```bash
zip -r function.zip .
```

#### 3. 配置触发器
- 类型：API网关
- 路径：/api/yolo/detect

#### 4. 测试函数
在控制台测试或使用API网关URL

### 选项C：Vercel/Railway

#### 1. 创建项目
```bash
# 安装CLI
npm install -g vercel

# 部署
vercel
```

#### 2. 配置环境变量
在Vercel控制台设置环境变量

#### 3. 部署
```bash
vercel --prod
```

## 🔍 验证部署

### 1. 健康检查
```bash
curl http://your-server:8000/api/yolo/health
```

### 2. 获取信息
```bash
curl http://your-server:8000/api/yolo/info
```

### 3. 测试检测
使用Postman或curl发送POST请求到 `/api/yolo/detect`

## 📱 小程序配置

### 1. 更新config.js
```javascript
// utils/config.js

// YOLO后端服务地址
const YOLO_API_URL = 'http://your-server:8000/api/yolo';
// 或使用域名
// const YOLO_API_URL = 'https://your-domain.com/api/yolo';

module.exports = {
  // ... 其他配置
  YOLO_API_URL,
};
```

### 2. 添加域名白名单
在微信小程序后台：
1. 开发 → 开发设置
2. 服务器域名
3. 添加：`https://your-domain.com`

### 3. 测试连接
在小程序中拍照识别，查看控制台日志

## 🎯 性能优化

### 1. 使用GPU加速

#### 安装CUDA
```bash
# Ubuntu
sudo apt-get install nvidia-cuda-toolkit
```

#### 安装GPU版PyTorch
```bash
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118
```

#### 验证GPU
```python
import torch
print(torch.cuda.is_available())  # 应该返回True
```

### 2. 使用更快的模型
```python
# 使用nano模型（最快）
model = YOLO('yolov8n.pt')

# 或使用量化模型
model = YOLO('yolov8n-int8.pt')
```

### 3. 启用缓存
```python
# 缓存检测结果
from functools import lru_cache

@lru_cache(maxsize=100)
def detect_cached(image_hash):
    return detector.detect(image)
```

## 🐛 常见问题

### Q1：Docker构建失败
**解决**：
```bash
# 清理Docker缓存
docker system prune -a

# 重新构建
docker build --no-cache -f Dockerfile.yolo -t yolo-food-detector .
```

### Q2：模型下载慢
**解决**：
```bash
# 使用国内镜像
pip install ultralytics -i https://pypi.tuna.tsinghua.edu.cn/simple

# 或手动下载模型
wget https://github.com/ultralytics/assets/releases/download/v0.0.0/yolov8n.pt
```

### Q3：内存不足
**解决**：
1. 使用更小的模型（yolov8n）
2. 减少batch size
3. 增加服务器内存

### Q4：检测速度慢
**解决**：
1. 使用GPU
2. 使用更小的模型
3. 减小输入图片尺寸
4. 启用模型量化

## 📊 性能基准

### CPU性能（Intel i5）
- yolov8n：1-2秒/张
- yolov8s：2-3秒/张
- yolov8m：3-5秒/张

### GPU性能（NVIDIA GTX 1060）
- yolov8n：0.3-0.5秒/张
- yolov8s：0.5-0.8秒/张
- yolov8m：0.8-1.2秒/张

### 内存占用
- yolov8n：~500MB
- yolov8s：~800MB
- yolov8m：~1.5GB

## ✅ 部署检查清单

- [ ] 已选择部署方案
- [ ] 已安装必要软件
- [ ] 已下载YOLO模型
- [ ] 已启动服务
- [ ] 健康检查通过
- [ ] 已配置小程序
- [ ] 已添加域名白名单
- [ ] 已测试检测功能
- [ ] 性能满足要求
- [ ] 已配置监控（可选）

## 🎉 部署完成

恭喜！你已经成功部署了YOLO食物检测服务。

现在你可以：
- ✅ 使用高精度的食物检测
- ✅ 实时识别多个食物
- ✅ 自动估算份量和营养
- ✅ 享受快速的检测速度

---

**需要帮助？**
如果部署过程中遇到问题，请查看"常见问题"部分或查阅详细文档。
