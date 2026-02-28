@echo off
echo ========================================
echo   FORCE RESTART FRONTEND DEV SERVER
echo ========================================
echo.

echo [1/3] Killing all Node processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo [2/3] Clearing port 5173...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":5173" ^| find "LISTENING"') do taskkill /F /PID %%a >nul 2>&1
timeout /t 1 /nobreak >nul

echo [3/3] Starting frontend dev server...
cd frontend
start cmd /k "npm run dev"

echo.
echo ========================================
echo   Frontend restarting...
echo   Wait 10 seconds then refresh browser
echo   Press Ctrl+Shift+R to hard refresh
echo ========================================
pause
