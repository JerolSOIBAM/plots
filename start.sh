#!/bin/bash

echo "=========================================="
echo "  Interactive Plotting App - Startup"
echo "=========================================="
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running."
    echo "Please start Docker Desktop and try again."
    exit 1
fi

echo "✅ Docker is running"
echo ""

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Error: docker-compose is not installed."
    echo "Please install Docker Desktop which includes docker-compose."
    exit 1
fi

echo "🔧 Building and starting containers..."
echo "This may take a few minutes on first run..."
echo ""

# Build and start containers
docker-compose up --build -d

if [ $? -eq 0 ]; then
    echo ""
    echo "=========================================="
    echo "  ✅ Application Started Successfully!"
    echo "=========================================="
    echo ""
    echo "🌐 Open your browser and navigate to:"
    echo "   http://localhost:3000"
    echo ""
    echo "📡 Backend API is running at:"
    echo "   http://localhost:8000"
    echo ""
    echo "📋 To view logs:"
    echo "   docker-compose logs -f"
    echo ""
    echo "🛑 To stop the application:"
    echo "   docker-compose down"
    echo ""
else
    echo ""
    echo "❌ Error: Failed to start containers."
    echo "Please check the error messages above."
    exit 1
fi
