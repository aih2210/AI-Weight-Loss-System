@echo off
chcp 65001 >nul
echo ========================================
echo    九安医疗商品图片保存助手
echo ========================================
echo.
echo 请按照以下步骤操作：
echo.
echo 1. 在聊天窗口中，右键点击每张图片
echo 2. 选择"另存为"或"保存图片"
echo 3. 保存到以下目录：
echo    E:\重要重要！！！\AI减重系统-项目测试\miniprogram-weight-loss\images\products\
echo.
echo ========================================
echo    图片命名对应表
echo ========================================
echo.
echo 图片1: 玫瑰金足底按摩器
echo    → foot-massager.jpg
echo.
echo 图片2: 血糖试纸盒子
echo    → test-strips.jpg
echo.
echo 图片3: 白色腕式血压计
echo    → wrist-monitor.jpg
echo.
echo 图片4: 白色颈椎按摩器
echo    → neck-massager.jpg
echo.
echo 图片5: 智能体脂秤
echo    → body-scale.jpg
echo.
echo 图片6: 白色红外体温计
echo    → thermometer.jpg
echo.
echo 图片7: 血糖仪套装
echo    → glucose-meter.jpg
echo.
echo 图片8: 电子血压计包装盒
echo    → blood-pressure.jpg
echo.
echo ========================================
echo.
echo 按任意键打开图片保存目录...
pause >nul

:: 打开目标目录
start "" "E:\重要重要！！！\AI减重系统-项目测试\miniprogram-weight-loss\images\products"

echo.
echo 目录已打开！
echo 请将8张图片按照上面的命名保存到此目录。
echo.
echo 保存完成后，按任意键验证文件...
pause >nul

:: 验证文件
echo.
echo 正在验证文件...
echo.

cd /d "E:\重要重要！！！\AI减重系统-项目测试\miniprogram-weight-loss\images\products"

set count=0

if exist "foot-massager.jpg" (
    echo ✓ foot-massager.jpg
    set /a count+=1
) else (
    echo ✗ foot-massager.jpg [缺失]
)

if exist "test-strips.jpg" (
    echo ✓ test-strips.jpg
    set /a count+=1
) else (
    echo ✗ test-strips.jpg [缺失]
)

if exist "wrist-monitor.jpg" (
    echo ✓ wrist-monitor.jpg
    set /a count+=1
) else (
    echo ✗ wrist-monitor.jpg [缺失]
)

if exist "neck-massager.jpg" (
    echo ✓ neck-massager.jpg
    set /a count+=1
) else (
    echo ✗ neck-massager.jpg [缺失]
)

if exist "body-scale.jpg" (
    echo ✓ body-scale.jpg
    set /a count+=1
) else (
    echo ✗ body-scale.jpg [缺失]
)

if exist "thermometer.jpg" (
    echo ✓ thermometer.jpg
    set /a count+=1
) else (
    echo ✗ thermometer.jpg [缺失]
)

if exist "glucose-meter.jpg" (
    echo ✓ glucose-meter.jpg
    set /a count+=1
) else (
    echo ✗ glucose-meter.jpg [缺失]
)

if exist "blood-pressure.jpg" (
    echo ✓ blood-pressure.jpg
    set /a count+=1
) else (
    echo ✗ blood-pressure.jpg [缺失]
)

echo.
echo ========================================
echo 已找到 %count%/8 个图片文件
echo ========================================
echo.

if %count%==8 (
    echo 🎉 太棒了！所有图片都已保存！
    echo 现在可以刷新小程序查看真实商品图片了！
) else (
    echo ⚠️ 还有 %count% 个图片文件缺失
    echo 请检查文件名是否正确（包括扩展名.jpg）
)

echo.
pause
