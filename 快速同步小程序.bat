@echo off
chcp 65001 >nul
echo ========================================
echo    快速同步 - 仅小程序文件
echo ========================================
echo.

set SOURCE_DIR=E:\项目测试\miniprogram-weight-loss
set TARGET_DIR=E:\重要重要！！！\AI减重系统-项目测试\miniprogram-weight-loss

echo 源目录: %SOURCE_DIR%
echo 目标目录: %TARGET_DIR%
echo.

echo 正在同步小程序文件...

robocopy "%SOURCE_DIR%" "%TARGET_DIR%" /MIR ^
    /XD "node_modules" ".git" ^
    /XF "*.log" "*.tmp" ^
    /R:1 /W:1 /NFL /NDL /NP

if %ERRORLEVEL% LEQ 7 (
    echo.
    echo ✅ 小程序同步完成！
    echo.
    echo 可以在微信开发者工具中打开:
    echo %TARGET_DIR%
    echo.
) else (
    echo.
    echo ❌ 同步失败，错误代码: %ERRORLEVEL%
    echo.
)

echo 按任意键退出...
pause >nul
