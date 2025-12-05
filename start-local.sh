#!/bin/bash

echo "========================================"
echo " Interactive Plotting App - Local Setup"
echo "========================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "[ERROR] Python 3 is not installed"
    echo "Please install Python 3.11 or higher from https://www.python.org/downloads/"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed"
    echo "Please install Node.js 18.x or higher from https://nodejs.org/"
    exit 1
fi

echo "[1/6] Setting up Python virtual environment..."
cd backend
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo "Virtual environment created."
else
    echo "Virtual environment already exists."
fi

echo ""
echo "[2/6] Installing Python dependencies..."
source venv/bin/activate
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to install Python dependencies"
    exit 1
fi

echo ""
echo "[3/6] Setting up frontend environment..."
cd ../frontend
if [ ! -f ".env" ]; then
    echo "VITE_API_URL=http://localhost:8000" > .env
    echo "Frontend .env file created."
else
    echo "Frontend .env file already exists."
fi

echo ""
echo "[4/6] Installing Node.js dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to install Node.js dependencies"
    exit 1
fi

echo ""
echo "[5/6] Starting backend server..."
cd ../backend

# Start backend in background
source venv/bin/activate
nohup uvicorn main:app --host 0.0.0.0 --port 8000 --reload > backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend server started (PID: $BACKEND_PID)"

echo ""
echo "[6/6] Starting frontend server..."
cd ../frontend
sleep 3

# Start frontend in background
nohup npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend server started (PID: $FRONTEND_PID)"

# Save PIDs to file for easy cleanup
cd ..
echo $BACKEND_PID > .backend.pid
echo $FRONTEND_PID > .frontend.pid

echo ""
echo "========================================"
echo " Setup Complete!"
echo "========================================"
echo ""
echo "Backend running at: http://localhost:8000"
echo "Frontend running at: http://localhost:3000"
echo ""
echo "Backend PID: $BACKEND_PID (log: backend/backend.log)"
echo "Frontend PID: $FRONTEND_PID (log: frontend/frontend.log)"
echo ""
echo "Open your browser to http://localhost:3000"
echo ""
echo "To stop the servers, run: ./stop-local.sh"
echo ""
