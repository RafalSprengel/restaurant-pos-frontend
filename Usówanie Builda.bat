@echo off

REM Dane dostępowe
set SERVER_USER=rafal
set SERVER_IP=188.68.242.226
set SERVER_PORT=2222
set REMOTE_BUILD_PATH=/var/www/demo1.rafalsprengel.com/react/build

echo === Czyszczenie katalogu build na serwerze...
ssh -p %SERVER_PORT% %SERVER_USER%@%SERVER_IP% "rm -rf %REMOTE_BUILD_PATH%"

echo === Gotowe!
pause
