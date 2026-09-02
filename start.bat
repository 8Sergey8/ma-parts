@echo off
setlocal
cd /d "%~dp0"
set "LOG=%~dp0start-log.txt"

echo ===== %DATE% %TIME% ===== > "%LOG%"
echo Folder: %CD% >> "%LOG%"
echo.

echo MBA-parts
echo Folder: %CD%
echo Log: start-log.txt
echo.

where node >> "%LOG%" 2>&1
where npm >> "%LOG%" 2>&1
node -v >> "%LOG%" 2>&1
call npm -v >> "%LOG%" 2>&1

where node >nul 2>&1
if errorlevel 1 goto NONODE

node -v
call npm -v
if errorlevel 1 goto NONPM

echo.
echo [1/2] npm install  (wait, 1-2 min)
echo.
call npm install
if errorlevel 1 (
  echo npm install FAILED >> "%LOG%"
  call npm install >> "%LOG%" 2>&1
  echo.
  echo npm install failed. Open start-log.txt
  goto END
)

echo.
echo [2/2] Starting http://127.0.0.1:43123
echo Do NOT close this window.
echo Browser will open in 10 seconds.
echo.

start "" cmd /c "timeout /t 10 /nobreak >nul & start http://127.0.0.1:43123"

call npx --yes next dev --hostname 127.0.0.1 --port 43123
echo.
echo Server stopped. Exit code: %ERRORLEVEL%
echo Server stopped. Exit code: %ERRORLEVEL% >> "%LOG%"
goto END

:NONODE
echo.
echo Node.js NOT FOUND in PATH.
echo Install LTS from https://nodejs.org
echo Enable "Add to PATH", then REBOOT Windows,
echo then run start.bat again.
echo.
goto END

:NONPM
echo.
echo npm NOT FOUND. Reinstall Node.js and keep npm checked.
echo.
goto END

:END
echo.
pause
endlocal
