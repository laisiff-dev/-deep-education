@echo off
cd /d "%~dp0"
title 高教深耕智慧專案管理中樞 (跨電腦手機連線)
color 0A

echo ====================================================================
echo   高教深耕智慧專案管理與指標管考中樞
echo   正在為您啟動伺服器，並自動檢測局域網 (LAN IP) 跨電腦與手機連線位址...
echo ====================================================================
echo.

rem 檢查 Python 環境
python --version >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo [錯誤] 系統未檢測到 Python 環境！請先安裝 Python 3.8+ 並勾選 Add Python to PATH。
    pause
    exit /b
)

rem 嘗試放行防火牆 Port 8080 (若無權限則自動忽略)
netsh advfirewall firewall add rule name="Sprout PM App (Port 8080)" dir=in action=allow protocol=TCP localport=8080 >nul 2>&1

rem 啟動 Python Web Server
python sprout_pm_app.py

pause
