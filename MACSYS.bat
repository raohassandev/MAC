

@REM @echo off
@REM cd /d "%~dp0"

@REM :: Start Backend (Node.js)
@REM start cmd /k "cd macsys_engine && npm install && npm run dev"

@REM :: Start Frontend (React)
@REM start cmd /k "cd macsys_web && npm install && npm run dev"

@echo off
:: MacSys - Modbus Device Management System Startup Script

:: Check if running with administrator privileges
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"

:: If not admin, request elevation
if '%errorlevel%' NEQ '0' (
    echo Requesting administrative privileges...
    goto UACPrompt
) else ( goto gotAdmin )

:UACPrompt
    echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\getadmin.vbs"
    echo UAC.ShellExecute "%~s0", "", "", "runas", 1 >> "%temp%\getadmin.vbs"
    "%temp%\getadmin.vbs"
    exit /B

:gotAdmin
    pushd "%CD%"
    CD /D "%~dp0"

:: Start MongoDB (if not using Docker/separate service)
start "MongoDB" "C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe"

:: Wait a moment for MongoDB to start
timeout /t 5 /nobreak > NUL

:: Start Backend (Node.js/Express)
start "MacSys Engine" cmd /k "cd macsys_engine && npm install && npm run dev"

:: Start Frontend (React)
start "MacSys Web" cmd /k "cd macsys_web && npm install && npm run dev"

:: Optional: Open default browser (adjust URL as needed)
start http://localhost:3000

echo MacSys services are starting...
pause

