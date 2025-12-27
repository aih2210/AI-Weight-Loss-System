# 🚀 快速上传到GitHub

## ⚡ 3分钟快速上传

### 步骤1：运行初始化脚本

双击运行：`初始化Git.bat`

按提示输入：
- GitHub用户名
- GitHub邮箱
- 仓库URL（需要先在GitHub创建）

### 步骤2：运行上传脚本

双击运行：`上传到GitHub.bat`

按提示输入：
- 提交信息（可选，直接回车使用默认）

### 步骤3：完成！

访问你的GitHub仓库查看上传的文件。

---

## 📋 详细步骤

### 1. 在GitHub创建仓库

1. 访问：https://github.com/new
2. 填写信息：
   - **Repository name**: `AI-Weight-Loss-System`
   - **Description**: `AI智能减重系统 - 基于多模型AI的全栈健康管理平台`
   - 选择 **Public** 或 **Private**
   - **不要**勾选任何初始化选项
3. 点击"Create repository"
4. 复制仓库URL（例如：`https://github.com/username/AI-Weight-Loss-System.git`）

### 2. 配置Git（首次使用）

如果是第一次使用Git，需要配置：

```bash
git config --global user.name "你的GitHub用户名"
git config --global user.email "你的GitHub邮箱"
```

或运行 `初始化Git.bat` 自动配置。

### 3. 初始化并上传

#### 方法A：使用脚本（推荐）

1. 双击 `初始化Git.bat`
2. 双击 `上传到GitHub.bat`

#### 方法B：手动命令

```bash
# 进入项目目录
cd "E:\项目测试"

# 初始化Git
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: AI智能减重系统完整项目"

# 关联远程仓库
git remote add origin https://github.com/your-username/AI-Weight-Loss-System.git

# 推送
git branch -M main
git push -u origin main
```

### 4. 输入认证信息

推送时需要输入：
- **Username**: 你的GitHub用户名
- **Password**: Personal Access Token（不是GitHub密码！）

#### 获取Personal Access Token

1. 访问：https://github.com/settings/tokens
2. 点击"Generate new token" → "Generate new token (classic)"
3. 填写Note：`AI Weight Loss System`
4. 勾选权限：`repo`（所有）
5. 点击"Generate token"
6. **复制Token**（只显示一次！）

---

## ✅ 上传成功后

### 1. 验证上传

访问你的GitHub仓库，确认文件已上传。

### 2. 完善仓库信息

#### 添加描述和标签

1. 点击仓库页面的"About"设置图标
2. 添加描述
3. 添加Topics标签：
   - `ai`
   - `weight-loss`
   - `health`
   - `wechat-miniprogram`
   - `fastapi`
   - `yolo`
   - `food-recognition`

#### 创建Release

1. 点击"Releases" → "Create a new release"
2. Tag version: `v1.0.0`
3. Release title: `AI智能减重系统 v1.0.0`
4. 描述主要功能
5. 点击"Publish release"

### 3. 分享项目

你的项目地址：
```
https://github.com/your-username/AI-Weight-Loss-System
```

---

## 🔒 安全检查

### 上传前必须检查

- [ ] 已移除所有真实的API密钥
- [ ] 已移除所有密码和敏感信息
- [ ] 已创建`.gitignore`文件
- [ ] 已检查`utils/config.js`中的配置

### 检查命令

```bash
# 搜索可能的API密钥
grep -r "sk-" .
grep -r "API_KEY" . | grep -v "YOUR_API_KEY_HERE"

# 检查.gitignore是否生效
git status --ignored
```

### 如果不小心上传了敏感信息

**立即**：
1. 删除仓库或设为私有
2. 更换所有泄露的密钥
3. 清理Git历史
4. 重新上传

---

## 🐛 常见问题

### Q1：推送失败，提示"Permission denied"

**原因**：认证失败

**解决**：
1. 确认使用Personal Access Token而不是密码
2. 检查Token权限是否包含`repo`
3. 重新生成Token

### Q2：推送很慢或超时

**原因**：网络问题

**解决**：
1. 检查网络连接
2. 使用代理（如果在国内）
3. 尝试使用GitHub Desktop

### Q3：提示"Large files detected"

**原因**：文件超过100MB

**解决**：
1. 找到大文件：`git ls-files -s | awk '$4 > 100000000'`
2. 添加到`.gitignore`
3. 使用Git LFS（大文件存储）

### Q4：提示"Repository not found"

**原因**：仓库URL错误或不存在

**解决**：
1. 检查仓库URL是否正确
2. 确认仓库已创建
3. 检查是否有访问权限

---

## 📚 后续操作

### 更新代码

```bash
# 修改代码后
git add .
git commit -m "描述你的更改"
git push
```

或运行 `上传到GitHub.bat`

### 拉取最新代码

```bash
git pull
```

### 查看状态

```bash
git status
git log
```

---

## 🎉 完成！

恭喜！你的项目已成功上传到GitHub。

现在你可以：
- ✅ 在GitHub上展示你的项目
- ✅ 与他人协作开发
- ✅ 接收反馈和贡献
- ✅ 版本控制和备份

**项目链接**：
```
https://github.com/your-username/AI-Weight-Loss-System
```

---

**需要更多帮助？**
查看详细文档：`📤GitHub上传指南.md`
