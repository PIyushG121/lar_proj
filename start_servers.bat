@echo off
echo Starting Laravel Backend (artisan serve)...
start "Laravel Backend" cmd /k "cd /d %~dp0backend && php artisan serve"

timeout /t 2 /nobreak >nul

echo Starting Vite Dev Server...
start "Vite Dev Server" cmd /k "cd /d %~dp0backend && npm run dev"

echo.
echo Application servers started!
echo Laravel Backend: http://localhost:8000
echo Vite Dev Server: http://localhost:5173
echo.
echo Press any key to exit...
pause >nul
