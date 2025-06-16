@echo off

set SERVER_USER=rafal
set SERVER_IP=188.68.242.226
set SERVER_PORT=2222
set REMOTE_BUILD_PATH=/var/www/justcode.uk/build
set LOCAL_BUILD_PATH=build\*

echo === Czyszczenie katalogu build na serwerze...
ssh -p %SERVER_PORT% %SERVER_USER%@%SERVER_IP% "rm -rf %REMOTE_BUILD_PATH% && mkdir -p %REMOTE_BUILD_PATH%"

echo === Wysyłanie nowego builda na serwer...
scp -P %SERVER_PORT% -r %LOCAL_BUILD_PATH% %SERVER_USER%@%SERVER_IP%:%REMOTE_BUILD_PATH%

echo === Gotowe!
pause
