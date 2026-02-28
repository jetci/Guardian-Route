@echo off
echo ========================================
echo   RESTARTING FRONTEND DEV SERVER
echo ========================================
echo.

cd frontend

echo [1/3] Clearing Vite cache...
if exist "node_modules\.vite" (
    rmdir /s /q "node_modules\.vite"
    echo Cache cleared!
) else (
    echo No cache found.
)
echo.

echo [2/3] Clearing browser cache instructions:
echo   - Press Ctrl + Shift + R in browser
echo   - Or use Incognito Mode
echo.

echo [3/3] Starting dev server...
echo.
npm run dev

pause
