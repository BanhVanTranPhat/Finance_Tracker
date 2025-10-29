@echo off
echo Starting Finance Tracker Application...

echo.
echo 1. Installing dependencies...
call npm run install:all

echo.
echo 2. Starting MongoDB (if not running)...
echo Please ensure MongoDB is running on localhost:27017

echo.
echo 3. Starting server...
start "Finance Tracker Server" cmd /k "cd server && npm run dev"

echo.
echo 4. Starting frontend...
timeout /t 3 /nobreak > nul
start "Finance Tracker Frontend" cmd /k "npm run dev"

echo.
echo Application is starting...
echo Frontend: http://localhost:5173
echo Backend: http://localhost:5000
echo.
pause


