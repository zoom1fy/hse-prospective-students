@echo off
setlocal

set PORT=3000
set BIND=localhost
if not "%~1"=="" set PORT=%~1
if not "%~2"=="" set BIND=%~2

cd /d "%~dp0..\..\frontend"

if not exist node_modules (
    echo Installing dependencies...
    call bun install
)

echo Starting dev server on http://%BIND%:%PORT%
call bun run dev -- --port %PORT% --hostname %BIND%
