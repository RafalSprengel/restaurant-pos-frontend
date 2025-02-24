@echo off
setlocal

echo Uruchamianie tunelu SSH do MongoDB...
ssh -p 2222 -L 27018:localhost:27017 rafal@188.68.242.226

echo Tunel zamknięty.
pause
