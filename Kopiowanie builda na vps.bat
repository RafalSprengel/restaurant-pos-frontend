@echo off
powershell -Command "& {scp -P 2222 -r C:\Programowanie\React\justcode.uk\build\* rafal@188.68.242.226:/var/www/justcode.uk/build}"
echo ✅ Pliki zostały skopiowane na VPS!
pause