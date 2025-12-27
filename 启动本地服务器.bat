@echo off
echo ========================================
echo   AI减重系统 - 本地服务器启动
echo ========================================
echo.
echo 正在启动服务器...
echo.

cd /d "%~dp0"
python -m http.server 8080

pause
