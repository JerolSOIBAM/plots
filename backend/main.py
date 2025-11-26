from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pandas as pd
import numpy as np
from io import BytesIO, StringIO
import requests
from typing import List, Optional
from pydantic import BaseModel, HttpUrl
import chardet
import traceback

app = FastAPI(title="Interactive Plotting API")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class URLRequest(BaseModel):
    url: HttpUrl


class PlotRequest(BaseModel):
    data: List[dict]
    x_column: str
    y_columns: List[str]
    plot_type: str


def detect_delimiter(content: str) -> str:
    """Detect delimiter for text files"""
    first_line = content.split('\n')[0]
    
    # Count potential delimiters
    delimiters = [',', '\t', ';', '|']
    counts = {d: first_line.count(d) for d in delimiters}
    
    # Return delimiter with highest count
    if max(counts.values()) > 0:
        return max(counts, key=counts.get)
    return ','


def detect_column_types(df: pd.DataFrame) -> dict:
    """Detect column types: numeric, datetime, or text"""
    column_types = {}
    
    for col in df.columns:
        if pd.api.types.is_numeric_dtype(df[col]):
            column_types[col] = "numeric"
        elif pd.api.types.is_datetime64_any_dtype(df[col]):
            column_types[col] = "datetime"
        else:
            # Try to convert to datetime
            try:
                pd.to_datetime(df[col], errors='raise')
                column_types[col] = "datetime"
            except:
                # Try to convert to numeric
                try:
                    pd.to_numeric(df[col], errors='raise')
                    column_types[col] = "numeric"
                except:
                    column_types[col] = "text"
    
    return column_types


def parse_file(file_content: bytes, filename: str, delimiter: str = None) -> pd.DataFrame:
    """Parse uploaded file based on extension"""
    file_ext = filename.lower().split('.')[-1]
    
    try:
        if file_ext == 'csv':
            # Detect encoding
            detected = chardet.detect(file_content)
            encoding = detected['encoding'] or 'utf-8'
            content = file_content.decode(encoding)
            
            # Use custom delimiter or detect it
            if delimiter:
                df = pd.read_csv(StringIO(content), sep=delimiter)
            else:
                df = pd.read_csv(StringIO(content))
            
        elif file_ext in ['xlsx', 'xls']:
            df = pd.read_excel(BytesIO(file_content))
            
        elif file_ext == 'txt':
            # Detect encoding
            detected = chardet.detect(file_content)
            encoding = detected['encoding'] or 'utf-8'
            content = file_content.decode(encoding)
            
            # Use custom delimiter or detect it
            if delimiter:
                df = pd.read_csv(StringIO(content), sep=delimiter)
            else:
                detected_delimiter = detect_delimiter(content)
                df = pd.read_csv(StringIO(content), sep=detected_delimiter)
            
        else:
            raise ValueError(f"Unsupported file type: {file_ext}")
        
        # Clean column names
        df.columns = df.columns.str.strip()
        
        return df
    
    except Exception as e:
        raise ValueError(f"Error parsing file: {str(e)}")


@app.get("/")
async def root():
    return {"message": "Interactive Plotting API", "version": "1.0.0"}


@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...), delimiter: str = None):
    """Upload and parse a data file"""
    try:
        # Check file size (100MB limit)
        MAX_SIZE = 100 * 1024 * 1024  # 100MB
        contents = await file.read()
        
        if len(contents) > MAX_SIZE:
            raise HTTPException(
                status_code=413,
                detail="File size exceeds 100MB limit"
            )
        
        # Validate file extension
        allowed_extensions = ['csv', 'xlsx', 'xls', 'txt']
        file_ext = file.filename.lower().split('.')[-1]
        
        if file_ext not in allowed_extensions:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file type. Allowed: {', '.join(allowed_extensions)}"
            )
        
        # Parse file
        df = parse_file(contents, file.filename, delimiter)
        
        if df.empty:
            raise HTTPException(
                status_code=400,
                detail="File is empty or could not be parsed"
            )
        
        # Detect column types
        column_types = detect_column_types(df)
        
        # Get preview data (first 100 rows)
        preview_df = df.head(100)
        
        # Convert to JSON-serializable format
        preview_data = preview_df.replace({np.nan: None}).to_dict('records')
        
        return JSONResponse({
            "success": True,
            "filename": file.filename,
            "rows": len(df),
            "columns": list(df.columns),
            "column_types": column_types,
            "preview": preview_data,
            "preview_rows": len(preview_df)
        })
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error processing file: {traceback.format_exc()}")
        raise HTTPException(
            status_code=500,
            detail=f"Error processing file: {str(e)}"
        )


class URLRequestWithDelimiter(BaseModel):
    url: HttpUrl
    delimiter: Optional[str] = None


@app.post("/api/fetch-url")
async def fetch_from_url(request: URLRequestWithDelimiter):
    """Fetch and parse data from a URL"""
    try:
        # Make HTTP GET request
        response = requests.get(str(request.url), timeout=30)
        response.raise_for_status()
        
        # Check content size
        MAX_SIZE = 100 * 1024 * 1024  # 100MB
        content_length = len(response.content)
        
        if content_length > MAX_SIZE:
            raise HTTPException(
                status_code=413,
                detail="File size exceeds 100MB limit"
            )
        
        # Extract filename from URL
        filename = str(request.url).split('/')[-1].split('?')[0]
        
        if not filename or '.' not in filename:
            # Try to detect from content-type
            content_type = response.headers.get('content-type', '')
            if 'csv' in content_type:
                filename = 'data.csv'
            elif 'excel' in content_type or 'spreadsheet' in content_type:
                filename = 'data.xlsx'
            else:
                filename = 'data.txt'
        
        # Parse file
        df = parse_file(response.content, filename, request.delimiter)
        
        if df.empty:
            raise HTTPException(
                status_code=400,
                detail="Fetched data is empty or could not be parsed"
            )
        
        # Detect column types
        column_types = detect_column_types(df)
        
        # Get preview data (first 100 rows)
        preview_df = df.head(100)
        
        # Convert to JSON-serializable format
        preview_data = preview_df.replace({np.nan: None}).to_dict('records')
        
        return JSONResponse({
            "success": True,
            "filename": filename,
            "rows": len(df),
            "columns": list(df.columns),
            "column_types": column_types,
            "preview": preview_data,
            "preview_rows": len(preview_df)
        })
    
    except requests.RequestException as e:
        raise HTTPException(
            status_code=400,
            detail=f"Error fetching URL: {str(e)}"
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching from URL: {traceback.format_exc()}")
        raise HTTPException(
            status_code=500,
            detail=f"Error processing data: {str(e)}"
        )


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
