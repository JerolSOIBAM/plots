# Development Guide

## 🛠️ Development Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- Docker Desktop

### Backend Development

#### 1. Setup Python Environment
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate
# Mac/Linux:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

#### 2. Run Backend Locally
```bash
# From backend directory with venv activated
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Backend will be available at http://localhost:8000
# API docs at http://localhost:8000/docs
```

#### 3. Test Backend API
```bash
# Health check
curl http://localhost:8000/health

# Interactive API docs
# Open: http://localhost:8000/docs
```

### Frontend Development

#### 1. Install Dependencies
```bash
cd frontend
npm install
```

#### 2. Run Frontend Locally
```bash
# Development server with hot reload
npm run dev

# Frontend will be available at http://localhost:3000
```

#### 3. Build for Production
```bash
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure Explained

```
Jerry/
├── backend/
│   ├── main.py                 # FastAPI app with all endpoints
│   ├── requirements.txt        # Python dependencies
│   ├── Dockerfile             # Backend container config
│   └── .dockerignore          # Files to exclude from Docker
│
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── FileUpload.tsx      # File upload & URL fetch
│   │   │   ├── DataPreview.tsx     # Data table display
│   │   │   ├── PlotConfig.tsx      # Chart configuration
│   │   │   └── PlotDisplay.tsx     # Plotly chart rendering
│   │   ├── App.tsx            # Main application container
│   │   ├── api.ts             # Axios API client
│   │   ├── types.ts           # TypeScript interfaces
│   │   ├── main.tsx           # React entry point
│   │   └── index.css          # Global styles
│   ├── public/                # Static assets
│   ├── index.html             # HTML template
│   ├── package.json           # Node dependencies
│   ├── tsconfig.json          # TypeScript config
│   ├── vite.config.ts         # Vite build config
│   ├── nginx.conf             # Production nginx config
│   ├── Dockerfile             # Frontend container config
│   └── .dockerignore          # Files to exclude from Docker
│
├── docker-compose.yml         # Multi-container orchestration
├── start.sh                   # Mac/Linux startup script
├── start.bat                  # Windows startup script
├── README.md                  # User documentation
├── SETUP.md                   # Setup verification guide
├── DEVELOPMENT.md             # This file
└── .gitignore                # Git ignore rules
```

## 🔌 API Endpoints

### `POST /api/upload`
Upload and parse a data file.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: File data

**Response:**
```json
{
  "success": true,
  "filename": "data.csv",
  "rows": 1000,
  "columns": ["col1", "col2", "col3"],
  "column_types": {
    "col1": "numeric",
    "col2": "datetime",
    "col3": "text"
  },
  "preview": [{"col1": 1, "col2": "2023-01-01", "col3": "value"}],
  "preview_rows": 100
}
```

### `POST /api/fetch-url`
Fetch and parse data from a URL.

**Request:**
```json
{
  "url": "https://example.com/data.csv"
}
```

**Response:**
Same as `/api/upload`

### `GET /health`
Health check endpoint.

**Response:**
```json
{
  "status": "healthy"
}
```

## 🎨 Component Architecture

### App.tsx
- Main application container
- Manages global state (dataInfo, plotConfig)
- Coordinates component interactions

### FileUpload.tsx
- Drag-and-drop file upload
- URL input and fetching
- File validation
- Loading states

### DataPreview.tsx
- Displays data in table format
- First 100 rows
- Sticky headers
- Horizontal scrolling

### PlotConfig.tsx
- X-axis column selection
- Y-axis column multi-select
- Plot type selection
- Input validation

### PlotDisplay.tsx
- Plotly.js integration
- Interactive chart rendering
- PNG/HTML export functionality
- Responsive layout

## 🔧 Key Technologies

### Backend
- **FastAPI**: Modern Python web framework
- **Pandas**: Data manipulation and analysis
- **Uvicorn**: ASGI server
- **Pydantic**: Data validation

### Frontend
- **React 18**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool
- **Plotly.js**: Charting library
- **Axios**: HTTP client

### DevOps
- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration
- **Nginx**: Web server for production

## 🧪 Testing

### Manual Testing

**Backend:**
```bash
# Test file upload
curl -X POST "http://localhost:8000/api/upload" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@sample.csv"

# Test URL fetch
curl -X POST "http://localhost:8000/api/fetch-url" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com/data.csv"}'
```

**Frontend:**
1. Start dev server: `npm run dev`
2. Open http://localhost:3000
3. Test file upload
4. Test URL fetch
5. Test plot generation
6. Test export functions

## 📦 Adding New Features

### Add New Backend Endpoint

1. Edit `backend/main.py`
2. Add new route:
```python
@app.post("/api/new-endpoint")
async def new_endpoint(request: RequestModel):
    # Your logic here
    return {"result": "success"}
```
3. Test locally
4. Rebuild: `docker-compose build backend`

### Add New Frontend Component

1. Create `frontend/src/components/NewComponent.tsx`
2. Create `frontend/src/components/NewComponent.css`
3. Import in `App.tsx`:
```typescript
import NewComponent from './components/NewComponent'
```
4. Use in JSX:
```tsx
<NewComponent prop1={value1} />
```
5. Test locally
6. Rebuild: `docker-compose build frontend`

### Add New Plot Type

1. Edit `frontend/src/types.ts`:
```typescript
export type PlotType = 'line' | 'scatter' | 'line+markers' | 'bar' | 'histogram';
```

2. Edit `frontend/src/components/PlotConfig.tsx`:
```tsx
<option value="histogram">Histogram</option>
```

3. Edit `frontend/src/components/PlotDisplay.tsx`:
```typescript
case 'histogram':
  type = 'histogram';
  mode = undefined;
  break;
```

## 🐛 Debugging

### Backend Debugging

**Enable detailed logs:**
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

**Print statements:**
```python
print(f"Debug: {variable}")
```

**View logs:**
```bash
docker-compose logs -f backend
```

### Frontend Debugging

**Browser Console:**
- Press F12
- Check Console tab for errors
- Check Network tab for API calls

**Add debug logs:**
```typescript
console.log('Debug:', variable);
console.error('Error:', error);
```

**View logs:**
```bash
docker-compose logs -f frontend
```

## 🔐 Security Considerations

### Current Setup (Development)
- CORS allows all origins (`*`)
- No authentication
- No rate limiting
- No input sanitization beyond basic validation

### Production Recommendations

1. **CORS**: Restrict to specific domains
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

2. **Authentication**: Add API keys or OAuth
3. **Rate Limiting**: Use slowapi or similar
4. **Input Validation**: Enhanced Pydantic models
5. **File Scanning**: Virus scanning for uploads
6. **HTTPS**: SSL/TLS certificates
7. **Environment Variables**: Secrets management

## 🚀 Deployment

### Build Production Images

```bash
# Build optimized images
docker-compose build --no-cache

# Tag images
docker tag jerry-backend:latest yourregistry/plotting-backend:v1.0
docker tag jerry-frontend:latest yourregistry/plotting-frontend:v1.0

# Push to registry
docker push yourregistry/plotting-backend:v1.0
docker push yourregistry/plotting-frontend:v1.0
```

### Deploy to Cloud

**AWS ECS:**
1. Create task definitions
2. Create ECS service
3. Configure load balancer
4. Set environment variables

**Google Cloud Run:**
```bash
gcloud run deploy plotting-backend --image yourregistry/plotting-backend:v1.0
gcloud run deploy plotting-frontend --image yourregistry/plotting-frontend:v1.0
```

**Azure Container Instances:**
```bash
az container create --resource-group myResourceGroup \
  --name plotting-app --image yourregistry/plotting-backend:v1.0
```

## 📊 Performance Optimization

### Backend
- Use async/await for I/O operations
- Implement caching (Redis)
- Optimize pandas operations
- Use connection pooling

### Frontend
- Code splitting (React.lazy)
- Image optimization
- Bundle size reduction
- CDN for static assets

### Docker
- Multi-stage builds (already implemented)
- Layer caching
- Minimal base images (alpine)
- .dockerignore optimization

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Make changes
4. Test locally
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open Pull Request

## 📝 Code Style

### Python
- Follow PEP 8
- Use type hints
- Document functions with docstrings

### TypeScript/React
- Use functional components
- Prefer hooks over class components
- Use TypeScript interfaces
- Follow ESLint rules

---

**Happy Coding! 🎉**
