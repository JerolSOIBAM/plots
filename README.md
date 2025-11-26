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

- **Docker Desktop** (includes Docker and Docker Compose)
  - [Download for Windows](https://www.docker.com/products/docker-desktop)
  - [Download for Mac](https://www.docker.com/products/docker-desktop)
  - [Download for Linux](https://docs.docker.com/desktop/install/linux-install/)

### Installation & Startup

#### Windows

1. **Ensure Docker Desktop is running**
2. **Double-click** `start.bat` in the project root directory
3. Wait for the containers to build and start
4. Open your browser to **http://localhost:3000**

#### Mac / Linux

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

### 2. Preview Your Data

- View the first 100 rows of your dataset in an interactive table
- See column names and row counts
- Scroll horizontally to view all columns

### 3. Configure Your Plot

**Select X-Axis:**
- Choose the column for your X-axis from the dropdown
- Can be numeric, datetime, or text

**Select Y-Axis:**
- Check one or more numeric columns to plot
- Multiple columns will be shown as separate series

**Choose Plot Type:**
- **Line Chart**: Connected lines
- **Scatter Plot**: Individual points
- **Line + Markers**: Lines with visible data points
- **Bar Chart**: Vertical bars

### 4. View and Export

- Your plot will appear automatically below the configuration
- **Interact** with the plot:
  - Hover over points for details
  - Zoom by dragging
  - Pan by clicking and dragging
  - Double-click to reset view
- **Export** your plot:
  - **PNG**: Static image for presentations
  - **HTML**: Interactive standalone file

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast builds
- **Plotly.js** for interactive visualizations
- **Axios** for API communication

### Backend
- **FastAPI** (Python web framework)
- **Pandas** for data processing
- **OpenPyXL** for Excel file support
- **Uvicorn** ASGI server

### Infrastructure
- **Docker** & **Docker Compose**
- **Nginx** for frontend serving
- **Multi-stage builds** for optimized images

## 📁 Project Structure

```
Jerry/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   └── Dockerfile           # Backend container config
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── FileUpload.tsx
│   │   │   ├── DataPreview.tsx
│   │   │   ├── PlotConfig.tsx
│   │   │   └── PlotDisplay.tsx
│   │   ├── App.tsx          # Main application
│   │   ├── api.ts           # API client
│   │   └── types.ts         # TypeScript interfaces
│   ├── package.json         # Node dependencies
│   ├── Dockerfile           # Frontend container config
│   └── nginx.conf           # Nginx configuration
├── docker-compose.yml       # Multi-container orchestration
├── start.sh                 # Mac/Linux startup script
├── start.bat                # Windows startup script
└── README.md                # This file
```

## 🔧 Development

### Running in Development Mode

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables

**Frontend** (create `.env` file):
```env
VITE_API_URL=http://localhost:8000
```

## 🐛 Troubleshooting

### Docker Issues

**Problem**: "Docker is not running"
- **Solution**: Start Docker Desktop and wait for it to fully initialize

**Problem**: Port already in use (3000 or 8000)
- **Solution**: Stop the conflicting service or change ports in `docker-compose.yml`

**Problem**: Build fails with "no space left on device"
- **Solution**: Clean up Docker: `docker system prune -a`

### Application Issues

**Problem**: File upload fails
- Check file size (must be < 100MB)
- Verify file format (.csv, .xlsx, .xls, .txt)
- Check file encoding (UTF-8 recommended)

**Problem**: No numeric columns for plotting
- Ensure your data contains numeric columns
- Check that numbers aren't formatted as text

**Problem**: Plot doesn't appear
- Verify X-axis column is selected
- Ensure at least one Y-axis column is checked
- Check browser console for errors (F12)

### Getting Help

If you encounter issues:
1. Check the logs: `docker-compose logs -f`
2. Restart containers: `docker-compose restart`
3. Rebuild from scratch: `docker-compose down && docker-compose up --build`

## 📊 Sample Data

To test the application, you can use public datasets:

```
# COVID-19 Data
https://raw.githubusercontent.com/datasets/covid-19/master/data/time-series-19-covid-combined.csv

# Stock Prices
https://raw.githubusercontent.com/datasets/finance-vix/master/data/vix-daily.csv

# World Population
https://raw.githubusercontent.com/datasets/population/master/data/population.csv
```

## 🚢 Deployment

### Production Considerations

1. **Environment Variables**: Set production URLs
2. **CORS**: Configure allowed origins in `backend/main.py`
3. **Security**: Add authentication if needed
4. **Scaling**: Use load balancers for high traffic
5. **Storage**: Consider persistent storage for large files

### Deploy to Cloud

The Docker setup makes it easy to deploy to:
- AWS (ECS, Elastic Beanstalk)
- Google Cloud (Cloud Run, GKE)
- Azure (Container Instances, AKS)
- DigitalOcean (App Platform)
- Heroku (Container Registry)

## 📝 License

This project is provided as-is for educational and commercial use.

## 👥 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## 🎯 Roadmap

Future enhancements:
- [ ] Row filtering before plotting
- [ ] Multiple plots in one view
- [ ] Save/load plot configurations
- [ ] More chart types (histogram, pie, heatmap)
- [ ] Data transformations (aggregation, pivoting)
- [ ] Authentication for API access
- [ ] Database integration for data persistence
- [ ] Export to PDF
- [ ] Dark mode toggle

---

**Built with ❤️ using React, FastAPI, and Plotly**

For questions or support, please open an issue on the repository.
