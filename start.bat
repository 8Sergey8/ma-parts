@echo off
chcp 65001 >nul
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Установите Node.js 20+ с https://nodejs.org
  echo Затем снова запустите этот файл.
  pause
  exit /b 1
)

echo Запускаю магазин MBA-parts на http://127.0.0.1:43123
echo Окно браузера откроется само. Это окно не закрывайте.
echo.
node scripts\start-local.cjs
echo.
pause
