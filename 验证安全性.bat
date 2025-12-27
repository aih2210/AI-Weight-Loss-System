@echo off
chcp 65001 >nul
echo.
echo ========================================
echo    安全性验证工具
echo ========================================
echo.

echo 🔍 正在检查敏感信息...
echo.

REM 检查config.js中的占位符
echo [1/5] 检查API密钥配置...
findstr /C:"YOUR_API_KEY_HERE" "miniprogram-weight-loss\utils\config.js" >nul
if errorlevel 1 (
    echo ❌ 警告：config.js中可能包含真实的API密钥！
    echo    请检查：miniprogram-weight-loss\utils\config.js
    set has_error=1
) else (
    echo ✅ API密钥配置正常（使用占位符）
)
echo.

REM 检查AppSecret
echo [2/5] 检查微信AppSecret...
findstr /C:"YOUR_APP_SECRET_HERE" "miniprogram-weight-loss\utils\config.js" >nul
if errorlevel 1 (
    echo ❌ 警告：config.js中可能包含真实的AppSecret！
    echo    请检查：miniprogram-weight-loss\utils\config.js
    set has_error=1
) else (
    echo ✅ AppSecret配置正常（使用占位符）
)
echo.

REM 检查.gitignore是否存在
echo [3/5] 检查.gitignore文件...
if exist ".gitignore" (
    echo ✅ .gitignore文件存在
) else (
    echo ❌ 警告：.gitignore文件不存在！
    set has_error=1
)
echo.

REM 检查是否有.env文件
echo [4/5] 检查环境变量文件...
if exist ".env" (
    echo ⚠️  发现.env文件，请确认已添加到.gitignore
) else (
    echo ✅ 未发现.env文件
)
echo.

REM 检查是否有大型模型文件
echo [5/5] 检查大型文件...
dir /s /b *.pt *.pth *.onnx 2>nul | find /c /v "" >nul
if errorlevel 1 (
    echo ✅ 未发现大型模型文件
) else (
    echo ⚠️  发现模型文件，请确认已添加到.gitignore
)
echo.

echo ========================================
if defined has_error (
    echo    ❌ 发现安全问题！
    echo ========================================
    echo.
    echo 请修复上述问题后再上传到GitHub
    echo.
    echo 详细说明请查看：🔒上传前安全检查.md
) else (
    echo    ✅ 安全检查通过！
    echo ========================================
    echo.
    echo 你可以安全地上传项目到GitHub了
    echo.
    echo 下一步：
    echo 1. 运行 "初始化Git.bat"
    echo 2. 运行 "上传到GitHub.bat"
)
echo.
pause
