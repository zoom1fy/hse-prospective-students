@echo off
setlocal

set IMAGE=hse-prospective-students-frontend
set PORT=3000
if not "%~1"=="" set PORT=%~1
if not "%~2"=="" set IMAGE=%~2

cd /d "%~dp0..\..\frontend"

echo Building Docker image %IMAGE%...
docker build -t %IMAGE% .

echo Starting container on http://localhost:%PORT%
docker run --rm -p %PORT%:3000 %IMAGE%
