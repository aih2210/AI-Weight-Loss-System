@echo off
chcp 65001 >nul
echo ========================================
echo    AI减重系统 - 自动同步工具
echo ========================================
echo.

set SOURCE_DIR=E:\项目测试
set TARGET_DIR=E:\重要重要！！！\AI减重系统-项目测试

echo 源目录: %SOURCE_DIR%
echo 目标目录: %TARGET_DIR%
echo.

echo [1/3] 检查目标目录...
if not exist "%TARGET_DIR%" (
    echo 创建目标目录...
    mkdir "%TARGET_DIR%"
)

echo [2/3] 同步文件中...
echo 这可能需要几分钟，请稍候...
echo.

REM 使用 robocopy 进行高效同步
REM /MIR - 镜像目录（删除目标中源没有的文件）
REM /XD - 排除目录
REM /XF - 排除文件
REM /R:1 - 重试1次
REM /W:1 - 等待1秒
REM /NFL - 不列出文件
REM /NDL - 不列出目录
REM /NP - 不显示进度百分比
REM /NS - 不显示文件大小
REM /NC - 不显示文件类别
REM /BYTES - 以字节显示大小
REM /TEE - 输出到控制台和日志

robocopy "%SOURCE_DIR%" "%TARGET_DIR%" /MIR ^
    /XD "node_modules" ".git" ".vscode" "__pycache__" "dist" "build" ".next" ".nuxt" ^
    /XF "*.log" "*.tmp" "*.temp" ".DS_Store" "Thumbs.db" "desktop.ini" ^
    /R:1 /W:1 /NFL /NDL /NP /NS /NC

REM robocopy 的退出代码
REM 0 = 没有文件被复制
REM 1 = 文件被成功复制
REM 2 = 有额外的文件或目录
REM 4 = 有不匹配的文件或目录
REM 8 = 有复制失败的文件

if %ERRORLEVEL% LEQ 7 (
    echo.
    echo [3/3] ✅ 同步完成！
    echo.
    echo 所有文件已成功同步到:
    echo %TARGET_DIR%
    echo.
) else (
    echo.
    echo [3/3] ❌ 同步过程中出现错误
    echo 错误代码: %ERRORLEVEL%
    echo.
)

echo ========================================
echo 按任意键退出...
pause >nul
