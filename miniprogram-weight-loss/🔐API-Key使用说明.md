# 🔐 API Key 安全使用说明

## ⚠️ 重要安全提示

### 绝对不要做的事：
❌ 不要在聊天、邮件、社交媒体中分享API Key
❌ 不要截图包含API Key的界面
❌ 不要提交到Git仓库
❌ 不要写在公开的文档中
❌ 不要告诉任何人

### 应该做的事：
✅ 只在小程序中设置
✅ 定期更换API Key
✅ 发现泄露立即删除
✅ 使用环境变量（生产环境）
✅ 设置费用告警

## 📱 在小程序中设置API Key

### 方法1：通过界面设置（推荐）

1. 打开小程序
2. 进入"AI助手"页面
3. 点击右上角 ⚙️ 按钮
4. 在弹出的输入框中粘贴你的API Key
5. 点击确定

**这是最安全的方式！** API Key会保存在你的设备本地存储中。

### 方法2：通过代码预设（仅开发测试）

如果你想在开发时预设API Key，可以修改代码：

```javascript
// pages/ai-assistant/ai-assistant.js
// 在 onLoad 函数中添加：

onLoad() {
  // 仅用于开发测试，正式版本请删除
  const testApiKey = 'sk-your-api-key-here';
  if (testApiKey && !wx.getStorageSync('qianwen_api_key')) {
    wx.setStorageSync('qianwen_api_key', testApiKey);
  }
  
  // ... 其他代码
}
```

⚠️ **注意：** 正式发布前必须删除这段代码！

## 🔒 API Key 管理

### 获取新的API Key

1. 访问：https://dashscope.console.aliyun.com/apiKey
2. 登录你的阿里云账号
3. 点击"创建新的API-KEY"
4. 复制生成的Key
5. 在小程序中设置

### 删除泄露的API Key

如果你的API Key不小心泄露了：

1. 立即访问：https://dashscope.console.aliyun.com/apiKey
2. 找到泄露的Key
3. 点击"删除"按钮
4. 创建新的Key
5. 在小程序中更新

### 查看使用情况

1. 访问：https://dashscope.console.aliyun.com/
2. 查看"用量统计"
3. 检查是否有异常使用
4. 设置费用告警

## 💰 费用控制

### 设置费用告警

1. 进入阿里云控制台
2. 费用中心 → 费用账单
3. 设置预算告警
4. 建议设置：¥10/月

### 监控使用量

定期检查：
- 每日调用次数
- Token使用量
- 费用明细

### 节省费用的方法

1. **合理使用模式**
   - 简单问题用本地模式
   - 复杂问题用AI模式

2. **优化参数**
   - 减少max_tokens
   - 使用qwen-turbo模型

3. **避免浪费**
   - 不要频繁测试
   - 避免重复问题

## 🛡️ 安全最佳实践

### 开发阶段

```javascript
// 使用环境变量（推荐）
const API_KEY = process.env.QIANWEN_API_KEY;

// 或使用配置文件（不提交到Git）
// config.js (添加到.gitignore)
module.exports = {
  apiKey: 'sk-your-key-here'
};
```

### 生产环境

1. **使用服务器代理**
   - 小程序 → 你的服务器 → 通义千问
   - API Key保存在服务器
   - 更安全可控

2. **实现访问控制**
   - 用户认证
   - 请求频率限制
   - 使用量配额

3. **监控和告警**
   - 异常使用检测
   - 自动告警通知
   - 自动封禁机制

## 📋 安全检查清单

在发布前检查：

- [ ] 代码中没有硬编码API Key
- [ ] .gitignore包含配置文件
- [ ] 设置了费用告警
- [ ] 测试了API Key管理功能
- [ ] 文档中没有泄露Key
- [ ] 截图中没有显示Key

## 🆘 紧急情况处理

### 如果API Key泄露了

**立即行动（5分钟内）：**

1. ⚡ 访问阿里云控制台
2. ⚡ 删除泄露的Key
3. ⚡ 创建新的Key
4. ⚡ 在小程序中更新
5. ⚡ 检查账单是否有异常

**后续措施：**

1. 📊 监控使用情况
2. 🔍 检查是否有异常费用
3. 📝 记录泄露原因
4. 🛡️ 加强安全措施

### 如果发现异常使用

1. 立即删除API Key
2. 检查账单明细
3. 联系阿里云客服
4. 申请费用退款（如果是恶意使用）

## 💡 常见问题

**Q: API Key保存在哪里？**
A: 保存在微信小程序的本地存储中，只在你的设备上。

**Q: 换手机后需要重新设置吗？**
A: 是的，本地存储不会同步到其他设备。

**Q: 可以多个设备使用同一个Key吗？**
A: 可以，但要注意使用量和费用。

**Q: 如何知道Key是否泄露？**
A: 定期检查用量统计，如果有异常增长可能是泄露了。

**Q: 忘记Key了怎么办？**
A: 无法找回，只能创建新的Key。

## 📞 获取帮助

**阿里云客服：**
- 官网：https://www.aliyun.com
- 工单系统：https://workorder.console.aliyun.com

**DashScope文档：**
- https://help.aliyun.com/zh/dashscope/

---

**记住：API Key就像你的密码，绝对不要分享给任何人！** 🔐

保护好你的API Key，享受安全的AI服务！
