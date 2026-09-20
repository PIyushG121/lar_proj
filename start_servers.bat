@echo off
echo Starting Laravel Backend (artisan serve)...
start "Laravel Backend" cmd /k "cd /d %~dp0 && php artisan serve --host=192.168.185.228"

timeout /t 2 /nobreak >nul

echo Starting Vite Dev Server...
start "Vite Dev Server" cmd /k "cd /d %~dp0 && npm run dev -- --host 192.168.185.228"

echo Starting Reverb Server (WebSockets)...
start "Reverb Server" cmd /k "cd /d %~dp0 && php artisan reverb:start --host=192.168.185.228"

timeout /t 2 /nobreak >nul

echo Starting Queue Worker...
start "Queue Worker" cmd /k "cd /d %~dp0 && php artisan queue:work"

echo.
echo Application servers started!
echo Laravel Backend: http://192.168.185.228:8000
echo Vite Dev Server: http://192.168.185.228:5173
echo WebSockets (Reverb): Running on http://192.168.185.228:8080
echo.
echo Press any key to exit...
pause >nul
