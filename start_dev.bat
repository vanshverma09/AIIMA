@echo off
echo ======================================================================
echo   HEALTHPREDICT AI - DUAL DEVELOPMENT LAUNCHER
echo ======================================================================
echo.
echo Launching Backend (FastAPI on Port 8000)...
start cmd /k "python backend/run_server.py"
echo Launching Frontend (Vite on Port 5173)...
cd frontend
start cmd /k "npm run dev"
start "" "http://localhost:5173"
echo.
echo Both servers running!
