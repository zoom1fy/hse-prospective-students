@echo off
setlocal

set PORT=3000
set BIND=0.0.0.0
set SKIP_BUILD=0
if not "%~1"=="" set PORT=%~1
if not "%~2"=="" set BIND=%~2
if /I "%~3"=="skip" set SKIP_BUILD=1

cd /d "%~dp0..\..\frontend"

if not exist node_modules (
    echo Installing dependencies...
    call bun install --frozen-lockfile
)

if "%SKIP_BUILD%"=="0" goto do_build
goto do_start

:do_build
echo Building production bundle...
call bun run build

:do_start
echo Starting frontend prod on http://%BIND%:%PORT%
set PORT=%PORT%
set HOSTNAME=%BIND%
call bun run start -- --port %PORT% --hostname %BIND%