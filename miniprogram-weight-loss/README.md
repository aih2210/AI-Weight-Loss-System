# AI减重助手 - 微信小程序版

## 🎉 项目简介

这是一个完整的微信小程序版本的AI减重助手，可以直接在微信中使用，无需安装额外应用。

## ✨ 核心功能

### 📊 首页
- 当前体重和减重进度
- 今日卡路里摄入/消耗统计
- 连续打卡天数
- AI智能建议

### 🍽️ 饮食管理
- 📸 拍照识别食物（调用微信相机）
- 👨‍🍳 AI食谱生成
- ✏️ 手动输入饮食
- 查看今日用餐记录

### 💪 运动管理
- 今日运动目标
- 运动计划列表
- 完成状态追踪
- 卡路里消耗统计

### 👤 个人中心
- 个人资料展示
- 成就统计
- 数据管理（导出/导入）
- 设置

## 🚀 快速开始

### 1. 准备工作

**需要的工具：**
- 微信开发者工具（[下载地址](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)）
- 微信小程序账号（[注册地址](https://mp.weixin.qq.com/)）

### 2. 导入项目

1. 打开微信开发者工具
2. 选择"导入项目"
3. 选择 `miniprogram-weight-loss` 文件夹
4. 填入你的AppID（测试可以使用测试号）
5. 点击"导入"

### 3. 运行项目

1. 在微信开发者工具中点击"编译"
2. 在模拟器中查看效果
3. 或扫码在真机上预览

### 4. 发布上线

1. 在微信开发者工具中点击"上传"
2. 填写版本号和项目备注
3. 登录微信公众平台
4. 提交审核
5. 审核通过后发布

## 📁 项目结构

```
miniprogram-weight-loss/
├── app.js                      # 小程序逻辑
├── app.json                    # 小程序配置
├── app.wxss                    # 小程序样式
├── sitemap.json                # 索引配置
├── pages/                      # 页面目录
│   ├── index/                  # 首页
│   │   ├── index.wxml         # 页面结构
│   │   ├── index.wxss         # 页面样式
│   │   ├── index.js           # 页面逻辑
│   │   └── index.json         # 页面配置
│   ├── diet/                   # 饮食页面
│   ├── exercise/               # 运动页面
│   ├── profile/                # 个人中心
│   ├── weight-update/          # 体重更新
│   ├── food-recognition/       # 食物识别
│   ├── recipe-generator/       # 食谱生成
│   ├── emotion-log/            # 情绪记录
│   └── data-management/        # 数据管理
├── images/                     # 图片资源
└── utils/                      # 工具函数
```

## 💾 数据存储

### 存储方式
使用微信小程序的 `wx.setStorageSync` 和 `wx.getStorageSync` API

### 存储内容
```javascript
{
  user: {
    name, age, gender, height,
    currentWeight, targetWeight, startWeight, startDate
  },
  weightHistory: [],      // 体重记录
  foodLogs: [],          // 饮食记录
  exerciseLogs: [],      // 运动记录
  emotionLogs: [],       // 情绪记录
  recipes: [],           // 收藏的食谱
  settings: {}           // 应用设置
}
```

### 数据限制
- 单个key存储上限：1MB
- 总存储上限：10MB
- 建议定期清理旧数据

## 🎨 界面设计

### 设计规范
- 主题色：清新绿色 (#a8d08d)
- 圆角：40rpx（卡片）、30rpx（按钮）
- 字体：微信默认字体
- 间距：30rpx（标准间距）

### 适配
- 支持iPhone、Android各种屏幕尺寸
- 使用rpx单位自动适配
- 底部TabBar固定

## 🔧 核心API

### 数据管理
```javascript
const app = getApp();

// 获取数据
const data = app.getData();

// 保存数据
app.saveData(data);

// 添加体重记录
app.addWeightRecord(weight, date);

// 添加饮食记录
app.addFoodLog(food);

// 添加运动记录
app.addExerciseLog(exercise);

// 添加情绪记录
app.addEmotionLog(emotion);

// 获取今日饮食
const todayFood = app.getTodayFoodLogs();

// 获取今日运动
const todayExercise = app.getTodayExerciseLogs();

// 获取连续打卡天数
const streak = app.getStreak();
```

### 微信API使用

**拍照/选择图片：**
```javascript
wx.chooseImage({
  count: 1,
  sizeType: ['compressed'],
  sourceType: ['camera', 'album'],
  success: (res) => {
    const tempFilePath = res.tempFilePaths[0];
    // 处理图片
  }
});
```

**显示提示：**
```javascript
wx.showToast({
  title: '保存成功',
  icon: 'success'
});
```

**页面跳转：**
```javascript
wx.navigateTo({
  url: '/pages/diet/diet'
});
```

## 📱 功能特性

### 1. 离线使用
- 所有数据存储在本地
- 无需网络连接即可使用
- 数据永久保存

### 2. 微信生态
- 可以分享给好友
- 支持微信支付（如需付费功能）
- 可以获取微信头像昵称

### 3. 原生体验
- 流畅的动画效果
- 原生组件支持
- 完美适配各种设备

## 🎯 开发计划

### 已完成 ✅
- [x] 项目架构搭建
- [x] 数据存储系统
- [x] 首页功能
- [x] 饮食管理基础功能
- [x] 底部TabBar导航

### 待完成 📝
- [ ] 拍照识别功能完善
- [ ] AI食谱生成
- [ ] 运动管理页面
- [ ] 情绪记录页面
- [ ] 个人中心页面
- [ ] 数据导出功能
- [ ] 图表可视化
- [ ] 分享功能

## 🔒 隐私说明

### 数据安全
- 所有数据存储在用户设备本地
- 不上传到任何服务器
- 用户完全控制自己的数据

### 权限申请
- 相机权限：用于拍照识别食物
- 相册权限：用于选择食物图片
- 位置权限：用于推荐附近健康餐厅（可选）

## 📚 开发文档

### 微信小程序官方文档
- [开发文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [API文档](https://developers.weixin.qq.com/miniprogram/dev/api/)
- [组件文档](https://developers.weixin.qq.com/miniprogram/dev/component/)

### 学习资源
- [微信小程序开发指南](https://developers.weixin.qq.com/ebook?action=get_post_info&docid=0008aeea9a8978ab0086a685851c0a)
- [小程序设计指南](https://developers.weixin.qq.com/miniprogram/design/)

## ❓ 常见问题

### Q: 如何获取AppID？
A: 登录[微信公众平台](https://mp.weixin.qq.com/)，在"开发"-"开发设置"中查看。

### Q: 可以使用测试号吗？
A: 可以！在微信开发者工具中选择"测试号"即可。

### Q: 数据会丢失吗？
A: 数据存储在微信本地存储中，除非用户清除微信缓存或卸载微信，否则不会丢失。

### Q: 如何发布小程序？
A: 需要注册企业或个人主体的小程序账号，通过微信审核后才能发布。

### Q: 可以添加后端服务吗？
A: 可以！在 `app.js` 中配置服务器域名，使用 `wx.request` 调用后端API。

## 🎊 总结

这是一个功能完整的微信小程序版AI减重助手，具备：

- ✅ 完整的数据管理系统
- ✅ 美观的界面设计
- ✅ 流畅的用户体验
- ✅ 离线使用能力
- ✅ 微信生态集成

可以直接在微信中使用，无需安装额外应用！

## 📞 技术支持

如有问题，请参考：
1. 微信小程序官方文档
2. 微信开发者社区
3. 项目README文档

---

**开始你的减重之旅！** 🏃‍♀️💪
