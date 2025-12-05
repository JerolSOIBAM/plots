# Interactive Plotting Web App 📊

A user-friendly web application for uploading datasets and generating interactive 2D visualizations using Plotly. Built with React, FastAPI, and Docker for easy cross-platform deployment.

![Interactive Plotting App](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)
![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey)

## ✨ Features

### Data Input
- 📤 **File Upload**: Drag & drop or browse for CSV, Excel (.xlsx), or TXT files
- 🌐 **URL Fetching**: Load datasets directly from HTTP/HTTPS URLs
- 📏 **Large File Support**: Handle files up to 100MB
- 🔍 **Smart Detection**: Automatic delimiter detection for text files

### Data Handling
- ✅ **Automatic Parsing**: Parse and validate CSV, Excel, and TXT files
- 🔢 **Type Detection**: Automatically detect numeric, datetime, and text columns
- 👁️ **Data Preview**: View first 100 rows in an interactive table
- 📊 **Column Information**: See column types with visual indicators

### Visualization
- 📈 **Multiple Chart Types**:
  - Line charts
  - Scatter plots
  - Line + markers
  - Bar charts
- 📉 **Multi-Series Support**: Plot multiple Y-axis columns simultaneously
- 🎨 **Interactive Plots**: Zoom, pan, and hover for details
- 💾 **Export Options**: Download plots as PNG or HTML

### User Experience
- 🎯 **Intuitive Interface**: Clean, modern React-based UI
- ⚡ **Fast Processing**: Quick data parsing and rendering
- 🔴 **Error Handling**: Clear error messages for invalid inputs
- 📱 **Responsive Design**: Works on desktop and mobile devices

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         User Browser                        │
│                     http://localhost:3000                   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  Frontend (React + Vite)                    │
│  • File Upload Component                                    │
│  • Data Preview Table                                       │
│  • Plot Configuration                                       │
│  • Plotly.js Visualization                                  │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/REST API
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   Backend (FastAPI)                         │
│  • /api/upload - File upload endpoint                       │
│  • /api/fetch-url - URL fetching endpoint                   │
│  • Data parsing with Pandas                                 │
│  • Column type detection                                    │
└─────────────────────────────────────────────────────────────┘

                    Deployed with Docker
```

## 🚀 Quick Start

### Prerequisites

**Option 1: With Docker (Recommended)**
- **Docker Desktop** (includes Docker and Docker Compose)
  - [Download for Windows](https://www.docker.com/products/docker-desktop)
  - [Download for Mac](https://www.docker.com/products/docker-desktop)
  - [Download for Linux](https://docs.docker.com/desktop/install/linux-install/)

**Option 2: Without Docker**
- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **Python** 3.11 or higher ([Download](https://www.python.org/downloads/))
- **npm** or **yarn** (comes with Node.js)

### Installation & Startup

#### With Docker

##### Windows

1. **Ensure Docker Desktop is running**
2. **Double-click** `start.bat` in the project root directory
3. Wait for the containers to build and start
4. Open your browser to **http://localhost:3000**

##### Mac / Linux

1. **Ensure Docker Desktop is running**
2. Open Terminal and navigate to the project directory:
   ```bash
   cd /path/to/Jerry
   ```
3. Make the startup script executable:
   ```bash
   chmod +x start.sh
   ```
4. Run the startup script:
   ```bash
   ./start.sh
   ```
5. Open your browser to **http://localhost:3000**

#### Without Docker

##### Quick Start (Automated)

**Windows:**
1. Double-click `start-local.bat`
2. Wait for setup to complete
3. Two terminal windows will open (backend and frontend)
4. Open your browser to **http://localhost:3000**

**Mac/Linux:**
1. Open Terminal and navigate to the project directory
2. Run the startup script:
   ```bash
   ./start-local.sh
   ```
3. Open your browser to **http://localhost:3000**
4. To stop the servers:
   ```bash
   ./stop-local.sh
   ```

##### Manual Setup

If you prefer to set up manually or the automated script doesn't work:

##### Setup Backend (FastAPI)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # Mac/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the backend server:
   ```bash
   # The backend will run on http://localhost:8000
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

##### Setup Frontend (React)

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Create a `.env` file for API configuration:
   ```bash
   # Windows
   echo VITE_API_URL=http://localhost:8000 > .env

   # Mac/Linux
   echo "VITE_API_URL=http://localhost:8000" > .env
   ```

3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser to **http://localhost:3000**

**Note**: When running without Docker, make sure both backend and frontend servers are running simultaneously in separate terminal windows.

### Manual Docker Commands

If you prefer to use Docker commands directly:

```bash
# Build and start containers
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down

# Rebuild containers (if you make code changes)
docker-compose up --build -d
```

## 📖 Usage Guide

### 1. Upload or Fetch Data

**Option A: Upload a File**
- Drag and drop a CSV, Excel, or TXT file onto the upload zone
- OR click the upload zone to browse for a file
- Supported formats: `.csv`, `.xlsx`, `.xls`, `.txt`
- Maximum file size: 100MB

**Option B: Fetch from URL**
- Enter a direct URL to a data file (e.g., `https://example.com/data.csv`)
- Click "Fetch Data"
- The file will be downloaded and parsed automatically

For questions or support, please open an issue on the repository.
