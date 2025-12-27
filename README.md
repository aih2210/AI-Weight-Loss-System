# 🏥 AI智能减重系统

一个基于AI的全栈智能减重管理系统，包含微信小程序、Web应用、移动应用和后端服务。

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/)
[![WeChat](https://img.shields.io/badge/WeChat-MiniProgram-green.svg)](https://developers.weixin.qq.com/miniprogram/dev/framework/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green.svg)](https://fastapi.tiangolo.com/)

## 📖 项目简介

AI智能减重系统是一个综合性的健康管理平台，集成了多种AI技术，帮助用户科学减重、健康生活。

### ✨ 核心特性

- 🤖 **多模型AI识别** - 支持百度AI、腾讯云AI、通义千问、YOLO等多种AI服务
- 📸 **智能食物识别** - 拍照识别食物，自动计算营养成分
- 🏃 **个性化运动计划** - 根据用户情况生成定制运动方案
- 🍽️ **智能饮食建议** - AI生成健康食谱和营养建议
- 💰 **健康币激励系统** - 通过打卡赚取健康币，兑换健康产品
- 📊 **数据可视化** - 体重趋势、营养分析、运动记录等
- 🎯 **目标管理** - 设定减重目标，跟踪进度
- 💝 **情感感知** - AI情感分析，提供心理支持

## 🏗️ 技术架构

```
┌─────────────────────────────────────────────────────────┐
│                      前端应用层                          │
├──────────────┬──────────────┬──────────────┬───────────┤
│ 微信小程序    │   Web应用    │  移动应用     │  桌面应用  │
│  (WeChat)    │  (React)     │ (React Native)│ (Electron)│
└──────────────┴──────────────┴──────────────┴───────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────┐
│                      API网关层                           │
│                    (FastAPI)                            │
└─────────────────────────────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────┐
│                      业务逻辑层                          │
├──────────────┬──────────────┬──────────────┬───────────┤
│  用户管理     │  饮食管理     │  运动管理     │  AI服务   │
└──────────────┴──────────────┴──────────────┴───────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────┐
│                      数据存储层                          │
├──────────────┬──────────────┬──────────────┬───────────┤
│  PostgreSQL  │    Redis     │   本地存储    │  文件存储  │
└──────────────┴──────────────┴──────────────┴───────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────┐
│                      AI服务层                            │
├──────────────┬──────────────┬──────────────┬───────────┤
│   百度AI     │  腾讯云AI     │  通义千问     │   YOLO    │
└──────────────┴──────────────┴──────────────┴───────────┘
```

## 📁 项目结构

```
AI-Weight-Loss-System/
├── backend/                    # 后端服务
│   ├── api/                   # API路由
│   ├── models/                # 数据模型
│   ├── services/              # 业务逻辑
│   ├── yolo_food_detector.py  # YOLO检测器
│   ├── requirements.txt       # Python依赖
│   └── main.py               # 主程序
│
├── miniprogram-weight-loss/   # 微信小程序
│   ├── pages/                # 页面
│   ├── utils/                # 工具函数
│   ├── images/               # 图片资源
│   └── app.json              # 小程序配置
│
├── frontend/                  # Web前端
│   ├── src/                  # 源代码
│   ├── public/               # 静态资源
│   └── package.json          # 依赖配置
│
├── mobile-app/               # 移动应用
│   ├── src/                  # 源代码
│   └── package.json          # 依赖配置
│
├── docs/                     # 文档
│   ├── API文档.md
│   ├── 部署指南.md
│   └── 开发指南.md
│
├── .gitignore               # Git忽略文件
├── README.md                # 项目说明
├── LICENSE                  # 开源协议
└── docker-compose.yml       # Docker配置
```

## 🚀 快速开始

### 环境要求

- **Python**: 3.8+
- **Node.js**: 14+
- **微信开发者工具**: 最新版
- **数据库**: PostgreSQL 12+ / SQLite

### 安装步骤

#### 1. 克隆项目

```bash
git clone https://github.com/your-username/AI-Weight-Loss-System.git
cd AI-Weight-Loss-System
```

#### 2. 后端部署

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

#### 3. 微信小程序

1. 使用微信开发者工具打开 `miniprogram-weight-loss` 目录
2. 配置 `utils/config.js` 中的API密钥
3. 编译运行

#### 4. Web前端

```bash
cd frontend
npm install
npm run dev
```

#### 5. 移动应用

```bash
cd mobile-app
npm install
npm start
```

## 📱 功能模块

### 1. 微信小程序

- ✅ 用户注册登录
- ✅ 体重记录与趋势分析
- ✅ 饮食记录与营养分析
- ✅ 运动记录与计划
- ✅ AI食物识别
- ✅ AI食谱生成
- ✅ 健康币激励系统
- ✅ 健康商城
- ✅ 聚餐助手
- ✅ 情感日记
- ✅ 社交分享

### 2. Web应用

- ✅ 数据可视化仪表板
- ✅ 详细的营养分析
- ✅ 运动计划管理
- ✅ 用户管理
- ✅ 数据导出

### 3. 移动应用

- ✅ 跨平台支持（iOS/Android）
- ✅ 离线数据同步
- ✅ 推送通知
- ✅ 健康数据集成

### 4. 后端服务

- ✅ RESTful API
- ✅ 用户认证（JWT）
- ✅ 数据持久化
- ✅ AI服务集成
- ✅ YOLO食物检测
- ✅ 实时数据分析

## 🤖 AI功能

### 1. 多模型食物识别

支持多种AI服务，自动选择最佳方案：

- **百度AI** - 专业食物识别，准确率95%+
- **腾讯云AI** - 通用图像识别
- **通义千问** - 视觉理解模型
- **YOLO** - 实时目标检测

### 2. 智能营养分析

- 自动计算热量、蛋白质、碳水、脂肪
- 智能估算食物份量
- 个性化营养建议
- 膳食平衡分析

### 3. 个性化运动计划

- 根据用户情况生成运动方案
- 考虑运动偏好和可用设备
- 动态调整运动强度
- 运动效果预测

### 4. AI情感感知

- 分析用户情绪状态
- 提供心理支持
- 个性化鼓励话语
- 压力管理建议

## 📊 数据统计

- **代码行数**: 50,000+
- **功能模块**: 30+
- **API接口**: 50+
- **支持食物**: 8,000+
- **AI模型**: 4个

## 🔧 配置说明

### API密钥配置

在 `miniprogram-weight-loss/utils/config.js` 中配置：

```javascript
// 百度AI
const BAIDU_API_KEY = 'your-api-key';
const BAIDU_SECRET_KEY = 'your-secret-key';

// 腾讯云AI
const TENCENT_SECRET_ID = 'your-secret-id';
const TENCENT_SECRET_KEY = 'your-secret-key';

// 通义千问
const QWEN_API_KEY = 'your-api-key';

// YOLO服务
const YOLO_API_URL = 'http://your-server:8000/api/yolo';
```

详细配置请参考：
- [百度AI快速配置](miniprogram-weight-loss/⚡百度AI快速配置.md)
- [多模型AI识别配置指南](miniprogram-weight-loss/🎯多模型AI识别-配置指南.md)
- [YOLO快速部署指南](miniprogram-weight-loss/⚡YOLO快速部署指南.md)

## 📚 文档

- [项目总览](项目总览.md)
- [快速开始](⚡快速开始.md)
- [API文档](docs/API文档.md)
- [部署指南](DEPLOYMENT.md)
- [开发指南](CONTRIBUTING.md)

## 🐛 问题反馈

如果你在使用过程中遇到问题，请：

1. 查看[常见问题](docs/FAQ.md)
2. 搜索[Issues](https://github.com/your-username/AI-Weight-Loss-System/issues)
3. 提交新的Issue

## 🤝 贡献指南

欢迎贡献代码！请查看[贡献指南](CONTRIBUTING.md)了解详情。

### 贡献者

感谢所有贡献者的付出！

## 📄 开源协议

本项目采用 [MIT License](LICENSE) 开源协议。

## 🙏 致谢

- [FastAPI](https://fastapi.tiangolo.com/) - 现代化的Python Web框架
- [Ultralytics](https://ultralytics.com/) - YOLO目标检测
- [百度AI](https://ai.baidu.com/) - 食物识别服务
- [腾讯云AI](https://cloud.tencent.com/) - 图像识别服务
- [通义千问](https://tongyi.aliyun.com/) - 大语言模型

## 📞 联系方式

- **项目主页**: https://github.com/your-username/AI-Weight-Loss-System
- **问题反馈**: https://github.com/your-username/AI-Weight-Loss-System/issues
- **邮箱**: your-email@example.com

## 🌟 Star History

如果这个项目对你有帮助，请给个Star⭐️支持一下！

---

**Made with ❤️ by Your Name**

**最后更新**: 2025-12-28
