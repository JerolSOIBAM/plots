# Quick Setup Verification

## ✅ Pre-flight Checklist

Before starting the application, verify:

### 1. Docker Desktop Installation
```bash
# Check Docker
docker --version
# Expected: Docker version 20.x.x or higher

# Check Docker Compose
docker-compose --version
# Expected: Docker Compose version 2.x.x or higher
```

### 2. Docker Desktop Running
- Windows/Mac: Check system tray for Docker icon
- Linux: `sudo systemctl status docker`

### 3. Port Availability
```bash
# Check if ports 3000 and 8000 are free
# Mac/Linux:
lsof -i :3000
lsof -i :8000

# Windows (PowerShell):
netstat -ano | findstr :3000
netstat -ano | findstr :8000
```

If ports are in use, you can either:
- Stop the conflicting service
- Change ports in `docker-compose.yml`

## 🚀 First Time Setup

### Option 1: Using Startup Scripts (Recommended)

**Windows:**
```cmd
# Simply double-click start.bat
# Or from Command Prompt:
start.bat
```

**Mac/Linux:**
```bash
# From Terminal:
./start.sh
```

### Option 2: Manual Docker Commands

```bash
# Navigate to project directory
cd /Users/jerolsoibam/Desktop/Personal/Projects_ML/Jerry

# Build and start containers
docker-compose up --build -d

# First time build takes 3-5 minutes
# Subsequent starts take ~10-30 seconds
```

## 📊 Verify Installation

### 1. Check Container Status
```bash
docker-compose ps
```

Expected output:
```
NAME                 STATUS              PORTS
plotting-backend     Up X seconds        0.0.0.0:8000->8000/tcp
plotting-frontend    Up X seconds        0.0.0.0:3000->80/tcp
```

### 2. Check Backend Health
```bash
curl http://localhost:8000/health
```

Expected: `{"status":"healthy"}`

### 3. Check Frontend
Open browser to: http://localhost:3000

Expected: Interactive Plotting App homepage

## 🔍 View Logs

```bash
# All logs
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# Frontend only
docker-compose logs -f frontend

# Last 100 lines
docker-compose logs --tail=100
```

## 🛑 Stop Application

```bash
# Stop containers (keeps data)
docker-compose stop

# Stop and remove containers
docker-compose down

# Stop, remove containers, and clean images
docker-compose down --rmi all
```

## 🔄 Restart After Code Changes

```bash
# Rebuild and restart
docker-compose up --build -d

# Or restart specific service
docker-compose restart backend
docker-compose restart frontend
```

## 🧪 Test the Application

### Test 1: File Upload
1. Download sample CSV: https://raw.githubusercontent.com/datasets/covid-19/master/data/time-series-19-covid-combined.csv
2. Upload to app
3. Verify data preview appears
4. Select X-axis and Y-axis columns
5. Generate plot

### Test 2: URL Fetch
1. Enter URL: `https://raw.githubusercontent.com/datasets/finance-vix/master/data/vix-daily.csv`
2. Click "Fetch Data"
3. Verify data loads
4. Create visualization

### Test 3: Export
1. After creating a plot
2. Click "Export PNG"
3. Click "Export HTML"
4. Verify downloads work

## ❓ Common Issues

### Issue: "Port already in use"
**Solution:**
```bash
# Find process using port
# Mac/Linux:
lsof -i :3000
kill -9 <PID>

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Issue: "Cannot connect to Docker daemon"
**Solution:**
- Ensure Docker Desktop is running
- Wait 30 seconds after starting Docker Desktop
- Try: `docker ps`

### Issue: "Build failed"
**Solution:**
```bash
# Clean Docker system
docker system prune -a

# Remove old containers
docker-compose down -v

# Rebuild from scratch
docker-compose up --build
```

### Issue: TypeScript errors in frontend
**Solution:**
These are expected during development and won't affect the Docker build. The production build strips type checking.

### Issue: Module not found errors
**Solution:**
```bash
# Rebuild backend
docker-compose build backend

# Rebuild frontend  
docker-compose build frontend

# Restart
docker-compose up -d
```

## 📈 Performance Tips

1. **First Build**: 3-5 minutes (downloading dependencies)
2. **Subsequent Starts**: 10-30 seconds
3. **Code Changes**: Rebuild specific service only

## 🎯 Next Steps

1. ✅ Verify application is running
2. 📊 Test with sample data
3. 🎨 Create your first visualization
4. 📤 Try both upload and URL fetch
5. 💾 Export plots as PNG and HTML

---

**Need Help?**
- Check logs: `docker-compose logs -f`
- Restart: `docker-compose restart`
- Full rebuild: `docker-compose down && docker-compose up --build`
