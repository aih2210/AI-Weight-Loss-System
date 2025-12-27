@echo off
chcp 65001 >nul
echo.
echo ========================================
echo    Git初始化和配置工具
echo ========================================
echo.

REM 检查Git是否安装
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 未检测到Git
    echo.
    echo 请先安装Git：
    echo https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

echo ✅ Git已安装
git --version
echo.

REM 配置Git用户信息
echo 📝 配置Git用户信息
echo.
set /p git_name="请输入你的GitHub用户名: "
set /p git_email="请输入你的GitHub邮箱: "

git config --global user.name "%git_name%"
git config --global user.email "%git_email%"

echo.
echo ✅ Git配置完成
echo.
echo 用户名: %git_name%
echo 邮箱: %git_email%
echo.

REM 初始化仓库
if exist ".git" (
    echo ⚠️  Git仓库已存在
    echo.
    set /p reinit="是否重新初始化？(y/n): "
    if /i "%reinit%"=="y" (
        rmdir /s /q .git
        git init
        echo ✅ 重新初始化完成
    )
) else (
    git init
    echo ✅ Git仓库初始化完成
)

echo.

REM 配置远程仓库
echo 🔗 配置远程仓库
echo.
echo 请先在GitHub创建仓库：https://github.com/new
echo.
set /p repo_url="请输入仓库URL（例如：https://github.com/username/repo.git）: "

if not "%repo_url%"=="" (
    git remote add origin %repo_url%
    echo ✅ 远程仓库配置完成
) else (
    echo ⚠️  跳过远程仓库配置
    echo 稍后可以运行：git remote add origin <url>
)

echo.
echo ========================================
echo    ✅ 初始化完成！
echo ========================================
echo.
echo 下一步：
echo 1. 运行 "上传到GitHub.bat" 上传项目
echo 2. 或手动执行：
echo    git add .
echo    git commit -m "Initial commit"
echo    git push -u origin main
echo.
pause
