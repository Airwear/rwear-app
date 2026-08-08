@echo off
setlocal

set "PROJECT_ROOT=%~dp0.."
cd /d "%PROJECT_ROOT%\android" || exit /b 1

if not exist "%PROJECT_ROOT%\.tmp" mkdir "%PROJECT_ROOT%\.tmp"

set "NODE_BINARY=%PROJECT_ROOT%\scripts\node20.cmd"
set "NODE_ENV=production"
set "TMP=%PROJECT_ROOT%\.tmp"
set "TEMP=%PROJECT_ROOT%\.tmp"

if exist "%LOCALAPPDATA%\Temp\metro-cache" rmdir /s /q "%LOCALAPPDATA%\Temp\metro-cache"

call gradlew.bat --no-daemon app:assembleRelease --console=plain
exit /b %ERRORLEVEL%
