@echo off
echo ========================================
echo  Interactive Plotting App - Local Setup
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH
    echo Please install Python 3.11 or higher from https://www.python.org/downloads/
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js 18.x or higher from https://nodejs.org/
    pause
    exit /b 1
)

echo [1/6] Setting up Python virtual environment...
cd backend
if not exist venv (
    python -m venv venv
    echo Virtual environment created.
) else (
    echo Virtual environment already exists.
)

echo.
echo [2/6] Installing Python dependencies...
call venv\Scripts\activate.bat
pip install -r requirements.txt
if errorlevel 1 (
    echo [ERROR] Failed to install Python dependencies
    pause
    exit /b 1
)

echo.
echo [3/6] Setting up frontend environment...
cd ..\frontend
if not exist .env (
    echo VITE_API_URL=http://localhost:8000 > .env
    echo Frontend .env file created.
) else (
    echo Frontend .env file already exists.
)

echo.
echo [4/6] Installing Node.js dependencies...
call npm install
if errorlevel 1 (
    echo [ERROR] Failed to install Node.js dependencies
    pause
    exit /b 1
)

echo.
echo [5/6] Starting backend server...
cd ..\backend
start "Backend Server" cmd /k "call venv\Scripts\activate.bat && uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

echo.
echo [6/6] Starting frontend server...
cd ..\frontend
timeout /t 3 /nobreak >nul
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ========================================
echo  Setup Complete!
echo ========================================
echo.
echo Backend running at: http://localhost:8000
echo Frontend running at: http://localhost:3000
echo.
echo Two terminal windows have been opened:
echo  - Backend Server (FastAPI)
echo  - Frontend Server (React + Vite)
echo.
echo Open your browser to http://localhost:3000
echo.
echo Press Ctrl+C in each terminal window to stop the servers.
echo.
pause
