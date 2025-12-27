@echo off
echo ========================================
echo   获取本机IP地址
echo ========================================
echo.

ipconfig | findstr /i "IPv4"

echo.
echo ========================================
echo 在手机浏览器中访问：
echo http://你的IP地址:8080/mobile-app-pwa.html
echo ========================================
echo.

pause
