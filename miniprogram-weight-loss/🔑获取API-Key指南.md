# 🔑 获取通义千问API Key指南

## 📝 简介

要使用真实的AI食物识别功能，你需要获取通义千问的API Key。

## 🎯 快速步骤

### 步骤1：访问阿里云百炼平台
打开浏览器，访问：
```
https://bailian.console.aliyun.com/
```

### 步骤2：登录/注册
- 如果已有阿里云账号，直接登录
- 如果没有，点击"免费注册"创建账号

### 步骤3：进入API-KEY管理
1. 登录后，在左侧菜单找到"API-KEY管理"
2. 或直接访问：https://bailian.console.aliyun.com/#/api-key

### 步骤4：创建API Key
1. 点击"创建新的API-KEY"按钮
2. 输入API Key名称（如：weight-loss-app）
3. 点击"确定"创建

### 步骤5：复制API Key
1. 创建成功后会显示API Key
2. 格式类似：`sk-xxxxxxxxxxxxxxxxxxxxxxxx`
3. 点击"复制"按钮
4. ⚠️ **重要**：API Key只显示一次，请妥善保存！

### 步骤6：配置到小程序
1. 打开文件：`utils/config.js`
2. 找到这一行：
   ```javascript
   const QWEN_API_KEY = 'YOUR_API_KEY_HERE';
   ```
3. 替换为你的API Key：
   ```javascript
   const QWEN_API_KEY = 'sk-your-actual-api-key-here';
   ```
4. 保存文件

### 步骤7：重新编译
1. 在微信开发者工具中按 `Ctrl + B`
2. 或点击菜单：项目 → 重新编译

### 步骤8：测试
1. 打开食物识别页面
2. 拍照识别食物
3. 查看控制台，应该看到"AI识别响应"
4. 识别成功！

## 💰 费用说明

### 免费额度
- 新用户通常有免费额度
- 具体额度以阿里云官网为准

### 计费方式
- **qwen-vl-plus模型**：
  - 输入：0.008元/千tokens
  - 输出：0.008元/千tokens
- 每次识别约：0.01-0.02元

### 成本控制
1. 使用识别历史快速添加
2. 熟悉的食物手动选择
3. 只对不确定的食物用AI
4. 监控使用量

## 🔐 安全提示

### API Key安全
- ⚠️ 不要分享给他人
- ⚠️ 不要上传到公开仓库
- ⚠️ 定期更换
- ⚠️ 监控使用量

### 如果泄露
1. 立即在阿里云控制台删除该API Key
2. 创建新的API Key
3. 更新到小程序配置

## 🐛 常见问题

### Q1：找不到API-KEY管理
**解决**：
1. 确保已登录阿里云
2. 访问：https://bailian.console.aliyun.com/
3. 在左侧菜单中查找

### Q2：创建API Key失败
**解决**：
1. 检查账号是否已实名认证
2. 检查是否有权限
3. 联系阿里云客服

### Q3：API Key不工作
**解决**：
1. 检查是否正确复制（包括sk-前缀）
2. 检查config.js中是否正确配置
3. 检查是否重新编译
4. 查看控制台错误信息

### Q4：提示余额不足
**解决**：
1. 在阿里云控制台充值
2. 或使用模拟识别功能

## 📱 配置示例

### 正确的配置
```javascript
// utils/config.js
const QWEN_API_KEY = 'sk-1234567890abcdefghijklmnopqrstuvwxyz';
```

### 错误的配置
```javascript
// ❌ 忘记替换
const QWEN_API_KEY = 'YOUR_API_KEY_HERE';

// ❌ 缺少sk-前缀
const QWEN_API_KEY = '1234567890abcdefghijklmnopqrstuvwxyz';

// ❌ 多余的空格
const QWEN_API_KEY = ' sk-1234567890abcdefghijklmnopqrstuvwxyz ';

// ❌ 引号错误
const QWEN_API_KEY = "sk-1234567890abcdefghijklmnopqrstuvwxyz";
```

## ✅ 验证配置

### 方法1：查看控制台
1. 打开微信开发者工具
2. 打开控制台（Console）
3. 拍照识别食物
4. 查看是否有"AI识别响应"日志

### 方法2：查看识别结果
1. 拍照识别
2. 查看置信度
3. AI识别的置信度通常更准确（85-98%）
4. 模拟识别的置信度是随机的（75-100%）

## 📚 相关链接

- [阿里云百炼平台](https://bailian.console.aliyun.com/)
- [通义千问API文档](https://help.aliyun.com/zh/dashscope/)
- [视觉模型文档](https://help.aliyun.com/zh/dashscope/developer-reference/vl-plus-quick-start)
- [API定价说明](https://help.aliyun.com/zh/dashscope/developer-reference/tongyi-qianwen-metering-and-billing)

## 🎯 快速检查清单

配置完成后，检查以下项目：

- [ ] 已获取API Key
- [ ] API Key格式正确（sk-开头）
- [ ] 已配置到config.js
- [ ] 已保存文件
- [ ] 已重新编译
- [ ] 测试识别功能
- [ ] 查看控制台日志
- [ ] 识别结果正常

## 💡 提示

### 不想配置API Key？
没关系！系统会自动使用模拟识别功能：
- ✅ 无需配置
- ✅ 完全免费
- ✅ 功能正常
- ❌ 识别结果是模拟的

### 想要最佳体验？
配置API Key后：
- ✅ 真实AI识别
- ✅ 高准确度
- ✅ 智能估算
- ✅ 个性化建议

---

**准备好了吗？**
按照上面的步骤获取API Key，开启真实的AI食物识别体验！🎉
