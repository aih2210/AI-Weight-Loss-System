@echo off
chcp 65001 >nul
echo ========================================
echo    AI减重系统 - 服务器启动脚本
echo ========================================
echo.

echo [1/3] 检查Python环境...
python --version
if errorlevel 1 (
    echo 错误：未找到Python，请先安装Python 3.8+
    pause
    exit /b 1
)

echo.
echo [2/3] 安装依赖包...
pip install -r requirements.txt
if errorlevel 1 (
    echo 警告：部分依赖包安装失败，但将继续启动
)

echo.
echo [3/3] 启动服务器...
echo.
echo ========================================
echo    服务器信息
echo ========================================
echo    地址: http://localhost:8000
echo    API文档: http://localhost:8000/docs
echo    登录页面: http://localhost:8000/login.html
echo ========================================
echo.
echo 按 Ctrl+C 停止服务器
echo.

python main.py

pause
