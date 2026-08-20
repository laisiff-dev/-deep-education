@echo off
cd /d "%~dp0"
title Sprout PM App Launcher
color 0A

echo ====================================================================
echo   Sprout PM App Server Launcher
echo   Starting server and launching web browser...
echo ====================================================================
echo.

python --version >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR] Python environment not detected! Please install Python 3.8+.
    pause
    exit /b
)

rem 自動啟動瀏覽器與 Python 服務
start http://localhost:8080
python sprout_pm_app.py
pause
