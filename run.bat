@echo off
echo ======================================================================
echo   HEALTHPREDICT ENTERPRISE
echo   Hospital Clinical Decision Support & Disease Risk Surveillance
echo ======================================================================
echo.
echo Launching Clinical Gateway at http://127.0.0.1:8000 ...
echo.
start "" "http://127.0.0.1:8000"
python backend/run_server.py
pause
