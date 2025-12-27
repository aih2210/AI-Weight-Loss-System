@echo off
chcp 65001 >nul
echo ========================================
echo    图片显示问题诊断和修复
echo ========================================
echo.

set "imgDir=E:\重要重要！！！\AI减重系统-项目测试\miniprogram-weight-loss\images\products"

echo 1. 检查图片文件...
echo.

cd /d "%imgDir%"

set count=0
set /a missing=0

if exist "blood-pressure.jpg" (
    echo ✓ blood-pressure.jpg
    set /a count+=1
) else (
    echo ✗ blood-pressure.jpg [缺失]
    set /a missing+=1
)

if exist "glucose-meter.jpg" (
    echo ✓ glucose-meter.jpg
    set /a count+=1
) else (
    echo ✗ glucose-meter.jpg [缺失]
    set /a missing+=1
)

if exist "thermometer.jpg" (
    echo ✓ thermometer.jpg
    set /a count+=1
) else (
    echo ✗ thermometer.jpg [缺失]
    set /a missing+=1
)

if exist "body-scale.jpg" (
    echo ✓ body-scale.jpg
    set /a count+=1
) else (
    echo ✗ body-scale.jpg [缺失]
    set /a missing+=1
)

if exist "neck-massager.jpg" (
    echo ✓ neck-massager.jpg
    set /a count+=1
) else (
    echo ✗ neck-massager.jpg [缺失]
    set /a missing+=1
)

if exist "wrist-monitor.jpg" (
    echo ✓ wrist-monitor.jpg
    set /a count+=1
) else (
    echo ✗ wrist-monitor.jpg [缺失]
    set /a missing+=1
)

if exist "test-strips.jpg" (
    echo ✓ test-strips.jpg
    set /a count+=1
) else (
    echo ✗ test-strips.jpg [缺失]
    set /a missing+=1
)

if exist "foot-massager.jpg" (
    echo ✓ foot-massager.jpg
    set /a count+=1
) else (
    echo ✗ foot-massager.jpg [缺失]
    set /a missing+=1
)

echo.
echo ========================================
echo 找到 %count%/8 个图片文件
echo ========================================
echo.

if %count%==8 (
    echo ✅ 所有图片文件都存在！
    echo.
    echo 2. 检查文件大小...
    echo.
    dir /b *.jpg
    echo.
    echo 3. 如果图片还是不显示，请尝试：
    echo.
    echo    方法1: 在微信开发者工具中
    echo           点击 "项目" → "重新编译"
    echo.
    echo    方法2: 清除缓存
    echo           点击 "工具" → "清除缓存" → "清除所有缓存"
    echo           然后重新编译
    echo.
    echo    方法3: 检查控制台
    echo           打开控制台查看是否有图片加载错误
    echo.
    echo    方法4: 检查图片格式
    echo           确认图片可以用图片查看器正常打开
    echo.
) else (
    echo ⚠️ 缺少 %missing% 个图片文件
    echo.
    echo 请检查文件名是否正确（区分大小写）
)

echo.
echo 按任意键打开图片目录...
pause >nul
start "" "%imgDir%"

echo.
pause
