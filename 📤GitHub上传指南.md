# 📤 GitHub上传指南

## 🎯 快速上传步骤

### 方法1：使用Git命令行（推荐）

#### 步骤1：初始化Git仓库

```bash
cd "E:\项目测试"
git init
```

#### 步骤2：添加所有文件

```bash
git add .
```

#### 步骤3：提交更改

```bash
git commit -m "Initial commit: AI智能减重系统完整项目"
```

#### 步骤4：在GitHub创建仓库

1. 访问：https://github.com/new
2. 填写仓库信息：
   - **Repository name**: `AI-Weight-Loss-System`
   - **Description**: `AI智能减重系统 - 基于多模型AI的全栈健康管理平台`
   - **Public** 或 **Private**（根据需要选择）
   - **不要**勾选"Initialize this repository with a README"
3. 点击"Create repository"

#### 步骤5：关联远程仓库

```bash
git remote add origin https://github.com/your-username/AI-Weight-Loss-System.git
```

将 `your-username` 替换为你的GitHub用户名。

#### 步骤6：推送到GitHub

```bash
git branch -M main
git push -u origin main
```

如果需要输入用户名和密码：
- **用户名**：你的GitHub用户名
- **密码**：使用Personal Access Token（不是GitHub密码）

#### 步骤7：验证上传

访问你的GitHub仓库页面，确认文件已上传。

---

### 方法2：使用GitHub Desktop（图形界面）

#### 步骤1：安装GitHub Desktop

下载：https://desktop.github.com/

#### 步骤2：登录GitHub账号

打开GitHub Desktop，登录你的GitHub账号。

#### 步骤3：添加本地仓库

1. 点击"File" → "Add local repository"
2. 选择项目目录：`E:\项目测试`
3. 如果提示"This directory does not appear to be a Git repository"，点击"create a repository"

#### 步骤4：创建仓库

1. 填写仓库信息
2. 点击"Create repository"

#### 步骤5：提交更改

1. 在左侧看到所有更改的文件
2. 在底部填写提交信息：`Initial commit: AI智能减重系统完整项目`
3. 点击"Commit to main"

#### 步骤6：发布到GitHub

1. 点击"Publish repository"
2. 填写仓库名称和描述
3. 选择Public或Private
4. 点击"Publish repository"

---

### 方法3：使用VS Code（如果你使用VS Code）

#### 步骤1：打开项目

在VS Code中打开项目目录。

#### 步骤2：初始化Git

1. 点击左侧的"Source Control"图标
2. 点击"Initialize Repository"

#### 步骤3：暂存所有文件

点击"+"号暂存所有更改。

#### 步骤4：提交

1. 在消息框输入：`Initial commit: AI智能减重系统完整项目`
2. 点击"✓"提交

#### 步骤5：发布到GitHub

1. 点击"Publish to GitHub"
2. 选择仓库名称和可见性
3. 点击"Publish"

---

## 🔑 获取Personal Access Token

如果使用命令行推送，需要Personal Access Token：

### 步骤1：访问GitHub设置

https://github.com/settings/tokens

### 步骤2：生成新Token

1. 点击"Generate new token" → "Generate new token (classic)"
2. 填写Note：`AI Weight Loss System`
3. 选择Expiration：`No expiration`（或自定义）
4. 勾选权限：
   - ✅ repo（所有）
   - ✅ workflow
5. 点击"Generate token"

### 步骤3：保存Token

**重要**：复制Token并保存，它只显示一次！

### 步骤4：使用Token

推送时，使用Token作为密码：
```bash
Username: your-username
Password: ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 📋 上传前检查清单

### 必须检查

- [ ] 已创建`.gitignore`文件
- [ ] 已移除敏感信息（API密钥、密码等）
- [ ] 已创建README.md
- [ ] 已创建LICENSE文件
- [ ] 已测试代码可以正常运行

### 敏感信息检查

确保以下文件不包含真实的API密钥：

```bash
# 检查config.js
grep -r "YOUR_API_KEY_HERE" miniprogram-weight-loss/utils/config.js

# 检查是否有.env文件
find . -name ".env*"
```

如果发现真实密钥，请替换为占位符：
```javascript
const BAIDU_API_KEY = 'YOUR_API_KEY_HERE';
const BAIDU_SECRET_KEY = 'YOUR_SECRET_KEY_HERE';
```

### 文件大小检查

GitHub单个文件限制100MB，仓库建议<1GB。

检查大文件：
```bash
find . -type f -size +50M
```

如果有大文件（如模型文件），添加到`.gitignore`。

---

## 🚀 上传后的操作

### 1. 添加仓库描述

在GitHub仓库页面：
1. 点击"About"旁的设置图标
2. 添加描述和标签
3. 添加网站链接（如果有）

### 2. 添加Topics

添加相关标签，方便其他人发现：
- `ai`
- `weight-loss`
- `health`
- `wechat-miniprogram`
- `fastapi`
- `yolo`
- `food-recognition`
- `nutrition`

### 3. 创建Release

1. 点击"Releases" → "Create a new release"
2. 填写版本号：`v1.0.0`
3. 填写标题：`AI智能减重系统 v1.0.0`
4. 填写说明：列出主要功能
5. 点击"Publish release"

### 4. 启用GitHub Pages（可选）

如果想展示项目文档：
1. Settings → Pages
2. Source选择main分支
3. 选择docs文件夹或根目录
4. 保存

### 5. 添加README徽章

在README.md顶部添加：
```markdown
[![GitHub stars](https://img.shields.io/github/stars/your-username/AI-Weight-Loss-System.svg)](https://github.com/your-username/AI-Weight-Loss-System/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/your-username/AI-Weight-Loss-System.svg)](https://github.com/your-username/AI-Weight-Loss-System/network)
[![GitHub issues](https://img.shields.io/github/issues/your-username/AI-Weight-Loss-System.svg)](https://github.com/your-username/AI-Weight-Loss-System/issues)
```

---

## 🐛 常见问题

### Q1：推送失败，提示"Permission denied"

**解决**：
1. 检查Personal Access Token是否正确
2. 检查Token权限是否包含repo
3. 尝试重新生成Token

### Q2：推送失败，提示"Large files detected"

**解决**：
1. 找到大文件：`git ls-files -s | awk '$4 > 100000000'`
2. 添加到`.gitignore`
3. 从Git历史中移除：`git rm --cached large-file.pt`
4. 重新提交

### Q3：推送很慢

**解决**：
1. 检查网络连接
2. 使用代理（如果在国内）
3. 分批推送大文件

### Q4：忘记添加.gitignore，已经提交了敏感信息

**解决**：
```bash
# 从Git历史中移除文件
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch path/to/sensitive-file" \
  --prune-empty --tag-name-filter cat -- --all

# 强制推送
git push origin --force --all
```

**重要**：如果已经推送到GitHub，立即：
1. 删除仓库或设为私有
2. 更换所有泄露的密钥
3. 重新创建仓库

---

## 📚 Git常用命令

### 基础命令

```bash
# 查看状态
git status

# 查看提交历史
git log

# 查看远程仓库
git remote -v

# 拉取最新代码
git pull

# 推送到远程
git push
```

### 分支管理

```bash
# 创建分支
git branch feature-name

# 切换分支
git checkout feature-name

# 创建并切换
git checkout -b feature-name

# 合并分支
git merge feature-name

# 删除分支
git branch -d feature-name
```

### 撤销操作

```bash
# 撤销工作区修改
git checkout -- file.txt

# 撤销暂存
git reset HEAD file.txt

# 撤销提交
git reset --soft HEAD^

# 修改最后一次提交
git commit --amend
```

---

## 🎉 完成！

恭喜！你的项目已经成功上传到GitHub。

现在你可以：
- ✅ 分享项目链接
- ✅ 邀请其他人协作
- ✅ 接收Issue和PR
- ✅ 展示你的作品

**项目地址**：
```
https://github.com/your-username/AI-Weight-Loss-System
```

---

**需要帮助？**
如果上传过程中遇到问题，请查看[GitHub文档](https://docs.github.com/)或提Issue。
