@echo off
chcp 65001 >nul
echo.
echo ========================================
echo    商品图片验证工具
echo ========================================
echo.

set "IMG_DIR=images\products"

echo 📁 检查图片目录...
if not exist "%IMG_DIR%" (
    echo ❌ 错误：图片目录不存在！
    echo    目录：%CD%\%IMG_DIR%
    echo.
    echo 💡 正在创建目录...
    mkdir "%IMG_DIR%"
    echo ✅ 目录已创建
    echo.
    goto :check_files
)
echo ✅ 图片目录存在
echo.

:check_files
echo 📋 检查图片文件...
echo.

set "count=0"
set "missing=0"

call :check_file "blood-pressure.jpg" "九安电子血压计"
call :check_file "glucose-meter.jpg" "九安血糖仪套装"
call :check_file "thermometer.jpg" "九安红外体温计"
call :check_file "body-scale.jpg" "九安智能体脂秤"
call :check_file "neck-massager.jpg" "九安颈椎按摩器"
call :check_file "wrist-monitor.jpg" "九安腕式血压计"
call :check_file "test-strips.jpg" "九安血糖试纸"
call :check_file "foot-massager.jpg" "九安足底按摩器"

echo.
echo ========================================
echo    验证结果
echo ========================================
echo.
echo 总计：8 张图片
echo 已保存：%count% 张
echo 缺失：%missing% 张
echo.

if %missing% equ 0 (
    echo ✅ 所有图片都已正确保存！
    echo.
    echo 📱 下一步操作：
    echo    1. 在微信开发者工具中按 Ctrl+B 重新编译
    echo    2. 清除缓存：工具 → 清除缓存 → 清除所有缓存
    echo    3. 打开健康商城页面查看效果
) else (
    echo ❌ 还有 %missing% 张图片未保存
    echo.
    echo 📝 请按照以下步骤操作：
    echo    1. 打开文件夹：%CD%\%IMG_DIR%
    echo    2. 保存缺失的图片到该文件夹
    echo    3. 确保文件名完全一致（包括扩展名）
    echo    4. 再次运行本脚本验证
)

echo.
echo 📂 图片目录位置：
echo    %CD%\%IMG_DIR%
echo.
pause
exit /b

:check_file
set "filename=%~1"
set "product=%~2"
if exist "%IMG_DIR%\%filename%" (
    for %%A in ("%IMG_DIR%\%filename%") do set "size=%%~zA"
    if !size! gtr 0 (
        echo ✅ %filename% - %product% ^(!size! 字节^)
        set /a count+=1
    ) else (
        echo ⚠️  %filename% - %product% ^(文件大小为0^)
        set /a missing+=1
    )
) else (
    echo ❌ %filename% - %product% ^(文件不存在^)
    set /a missing+=1
)
exit /b
