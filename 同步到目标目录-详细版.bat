@echo off
chcp 65001 >nul
color 0A
echo ========================================
echo    AI减重系统 - 自动同步工具 (详细版)
echo ========================================
echo.

set SOURCE_DIR=E:\项目测试
set TARGET_DIR=E:\重要重要！！！\AI减重系统-项目测试
set LOG_FILE=%~dp0sync_log_%date:~0,4%%date:~5,2%%date:~8,2%_%time:~0,2%%time:~3,2%%time:~6,2%.txt
set LOG_FILE=%LOG_FILE: =0%

echo 📁 源目录: %SOURCE_DIR%
echo 📁 目标目录: %TARGET_DIR%
echo 📝 日志文件: %LOG_FILE%
echo.

echo [1/4] 检查目标目录...
if not exist "%TARGET_DIR%" (
    echo ✨ 创建目标目录...
    mkdir "%TARGET_DIR%"
    if %ERRORLEVEL% EQU 0 (
        echo ✅ 目录创建成功
    ) else (
        echo ❌ 目录创建失败
        goto :error
    )
) else (
    echo ✅ 目标目录已存在
)
echo.

echo [2/4] 统计源文件...
set FILE_COUNT=0
for /r "%SOURCE_DIR%" %%f in (*) do set /a FILE_COUNT+=1
echo 📊 发现 %FILE_COUNT% 个文件
echo.

echo [3/4] 开始同步...
echo 这可能需要几分钟，请稍候...
echo.

REM 详细模式的 robocopy
robocopy "%SOURCE_DIR%" "%TARGET_DIR%" /MIR ^
    /XD "node_modules" ".git" ".vscode" "__pycache__" "dist" "build" ".next" ".nuxt" "venv" ".pytest_cache" ^
    /XF "*.log" "*.tmp" "*.temp" ".DS_Store" "Thumbs.db" "desktop.ini" "*.pyc" "*.pyo" ^
    /R:2 /W:2 ^
    /V /ETA /LOG:"%LOG_FILE%" /TEE

set SYNC_RESULT=%ERRORLEVEL%

echo.
echo [4/4] 同步结果分析...
echo.

if %SYNC_RESULT% EQU 0 (
    echo 📊 状态: 没有文件需要复制
    echo ✅ 所有文件已是最新
) else if %SYNC_RESULT% EQU 1 (
    echo 📊 状态: 文件已成功复制
    echo ✅ 同步完成
) else if %SYNC_RESULT% EQU 2 (
    echo 📊 状态: 有额外的文件或目录
    echo ✅ 同步完成（有额外文件）
) else if %SYNC_RESULT% EQU 3 (
    echo 📊 状态: 文件已复制，有额外文件
    echo ✅ 同步完成
) else if %SYNC_RESULT% EQU 4 (
    echo 📊 状态: 有不匹配的文件或目录
    echo ⚠️ 同步完成（有不匹配）
) else if %SYNC_RESULT% EQU 5 (
    echo 📊 状态: 文件已复制，有不匹配
    echo ⚠️ 同步完成（有不匹配）
) else if %SYNC_RESULT% EQU 6 (
    echo 📊 状态: 有额外和不匹配的文件
    echo ⚠️ 同步完成（有问题）
) else if %SYNC_RESULT% EQU 7 (
    echo 📊 状态: 文件已复制，有额外和不匹配
    echo ⚠️ 同步完成（有问题）
) else (
    echo 📊 状态: 同步失败
    echo ❌ 错误代码: %SYNC_RESULT%
    goto :error
)

echo.
echo ========================================
echo ✅ 同步完成！
echo ========================================
echo.
echo 📁 目标位置: %TARGET_DIR%
echo 📝 详细日志: %LOG_FILE%
echo.
echo 💡 提示: 
echo    - 可以在微信开发者工具中打开目标目录
echo    - 日志文件保存了详细的同步信息
echo.
goto :end

:error
echo.
echo ========================================
echo ❌ 同步失败
echo ========================================
echo.
echo 请检查:
echo 1. 源目录是否存在
echo 2. 目标目录是否有写入权限
echo 3. 磁盘空间是否充足
echo.
echo 详细错误信息请查看日志文件:
echo %LOG_FILE%
echo.

:end
echo ========================================
echo 按任意键退出...
pause >nul
