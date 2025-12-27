@echo off
chcp 65001 >nul
echo.
echo ========================================
echo    AI智能减重系统 - GitHub上传工具
echo ========================================
echo.

REM 检查是否已初始化Git
if not exist ".git" (
    echo 📦 初始化Git仓库...
    git init
    echo ✅ Git仓库初始化完成
    echo.
)

REM 检查是否有远程仓库
git remote -v >nul 2>&1
if errorlevel 1 (
    echo ⚠️  未配置远程仓库
    echo.
    echo 请先在GitHub创建仓库，然后运行：
    echo git remote add origin https://github.com/your-username/AI-Weight-Loss-System.git
    echo.
    pause
    exit /b 1
)

echo 📋 检查文件状态...
git status
echo.

echo 📝 添加所有文件...
git add .
echo ✅ 文件添加完成
echo.

REM 获取提交信息
set /p commit_msg="请输入提交信息（直接回车使用默认）: "
if "%commit_msg%"=="" set commit_msg=Update: 更新项目文件

echo.
echo 💾 提交更改...
git commit -m "%commit_msg%"
echo ✅ 提交完成
echo.

echo 🚀 推送到GitHub...
git push -u origin main
if errorlevel 1 (
    echo.
    echo ⚠️  推送失败，尝试使用master分支...
    git push -u origin master
)

if errorlevel 1 (
    echo.
    echo ❌ 推送失败！
    echo.
    echo 可能的原因：
    echo 1. 未配置Personal Access Token
    echo 2. 网络连接问题
    echo 3. 远程仓库不存在
    echo.
    echo 请查看 📤GitHub上传指南.md 获取帮助
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo    ✅ 上传成功！
echo ========================================
echo.
echo 你的项目已成功上传到GitHub
echo.
echo 下一步：
echo 1. 访问你的GitHub仓库
echo 2. 添加仓库描述和标签
echo 3. 创建Release版本
echo.
pause
