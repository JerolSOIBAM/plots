#!/bin/bash

echo "========================================"
echo " Stopping Local Servers"
echo "========================================"
echo ""

# Stop backend
if [ -f ".backend.pid" ]; then
    BACKEND_PID=$(cat .backend.pid)
    if ps -p $BACKEND_PID > /dev/null 2>&1; then
        echo "Stopping backend server (PID: $BACKEND_PID)..."
        kill $BACKEND_PID
        echo "Backend server stopped."
    else
        echo "Backend server is not running."
    fi
    rm .backend.pid
else
    echo "No backend PID file found."
fi

# Stop frontend
if [ -f ".frontend.pid" ]; then
    FRONTEND_PID=$(cat .frontend.pid)
    if ps -p $FRONTEND_PID > /dev/null 2>&1; then
        echo "Stopping frontend server (PID: $FRONTEND_PID)..."
        kill $FRONTEND_PID
        echo "Frontend server stopped."
    else
        echo "Frontend server is not running."
    fi
    rm .frontend.pid
else
    echo "No frontend PID file found."
fi

echo ""
echo "All servers stopped."
echo ""
