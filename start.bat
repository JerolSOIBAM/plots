@echo off
echo ==========================================
echo   Interactive Plotting App - Startup
echo ==========================================
echo.

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not running.
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)

echo Docker is running
echo.

REM Check if docker-compose is available
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: docker-compose is not installed.
    echo Please install Docker Desktop which includes docker-compose.
    pause
    exit /b 1
)

echo Building and starting containers...
echo This may take a few minutes on first run...
echo.

REM Build and start containers
docker-compose up --build -d

if %errorlevel% equ 0 (
    echo.
    echo ==========================================
    echo   Application Started Successfully!
    echo ==========================================
    echo.
    echo Open your browser and navigate to:
    echo    http://localhost:3000
    echo.
    echo Backend API is running at:
    echo    http://localhost:8000
    echo.
    echo To view logs:
    echo    docker-compose logs -f
    echo.
    echo To stop the application:
    echo    docker-compose down
    echo.
) else (
    echo.
    echo ERROR: Failed to start containers.
    echo Please check the error messages above.
    pause
    exit /b 1
)

pause
