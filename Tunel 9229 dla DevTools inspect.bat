@echo off
setlocal

echo Uruchamianie tunelu SSH...
ssh -p 2222 -L 9229:localhost:9229 rafal@188.68.242.226

echo Tunel SSH został zamknięty.
pause
