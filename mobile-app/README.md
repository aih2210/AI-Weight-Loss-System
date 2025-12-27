# AI减重助手 - 移动应用

基于React Native和Expo开发的跨平台AI减重移动应用。

## 功能特性

### 📱 核心功能

1. **智能首页**
   - 体重趋势图表
   - 每日数据统计
   - AI个性化建议
   - 连续打卡记录

2. **饮食管理**
   - 📸 拍照识别食物（AI图像识别）
   - 📊 营养成分分析
   - 🍽️ 用餐记录
   - 👨‍🍳 AI食谱推荐

3. **运动计划**
   - 个性化运动计划
   - 运动打卡
   - 卡路里消耗统计
   - 强度分级

4. **个人中心**
   - 用户资料管理
   - 成就统计
   - 目标设置
   - 提醒设置

## 技术栈

- **框架**: React Native + Expo
- **UI组件**: React Native Paper
- **导航**: React Navigation
- **图表**: React Native Chart Kit
- **图标**: React Native Vector Icons
- **相机**: Expo Camera & Image Picker
- **网络请求**: Axios

## 快速开始

### 环境要求

- Node.js 16+
- npm 或 yarn
- Expo CLI

### 安装步骤

1. 安装依赖
```bash
cd mobile-app
npm install
```

2. 启动开发服务器
```bash
npm start
```

3. 运行应用

**在Android模拟器/设备上运行：**
```bash
npm run android
```

**在iOS模拟器上运行（仅Mac）：**
```bash
npm run ios
```

**在浏览器中运行：**
```bash
npm run web
```

### 使用Expo Go测试

1. 在手机上安装 Expo Go App
   - Android: [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)

2. 扫描终端显示的二维码

## 项目结构

```
mobile-app/
├── src/
│   ├── screens/          # 页面组件
│   │   ├── HomeScreen.tsx
│   │   ├── DietScreen.tsx
│   │   ├── ExerciseScreen.tsx
│   │   └── ProfileScreen.tsx
│   └── services/         # API服务
│       └── api.ts
├── App.tsx              # 应用入口
├── app.json            # Expo配置
└── package.json        # 依赖配置
```

## API集成

应用已集成后端API服务，确保后端服务运行在 `http://localhost:8000`

修改API地址：编辑 `src/services/api.ts` 中的 `API_BASE_URL`

## 构建发布

### Android APK
```bash
expo build:android
```

### iOS IPA
```bash
expo build:ios
```

## 截图预览

- 首页：体重趋势和AI建议
- 饮食：拍照识别和营养分析
- 运动：个性化计划和打卡
- 我的：个人资料和成就

## 许可证

MIT License
