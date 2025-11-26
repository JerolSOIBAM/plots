import { useState, useRef } from 'react';
import { uploadFile, fetchFromUrl } from '../api';
import { DataInfo } from '../types';
import './FileUpload.css';

interface FileUploadProps {
  onDataLoaded: (data: DataInfo) => void;
  onError: (error: string) => void;
}

function FileUpload({ onDataLoaded, onError }: FileUploadProps) {
  const [url, setUrl] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [delimiter, setDelimiter] = useState<string>('auto');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    // Validate file type
    const allowedExtensions = ['csv', 'xlsx', 'xls', 'txt'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      onError(`Invalid file type. Please upload: ${allowedExtensions.join(', ')}`);
      return;
    }

    // Validate file size (100MB)
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      onError('File size exceeds 100MB limit');
      return;
    }

    setLoading(true);
    try {
      const delimiterValue = delimiter === 'auto' ? null : delimiter;
      const data = await uploadFile(file, delimiterValue);
      onDataLoaded(data);
    } catch (err: any) {
      onError(err.response?.data?.detail || err.message || 'Failed to upload file');
    } finally {
      setLoading(false);
    }
  };

  const handleUrlFetch = async () => {
    if (!url.trim()) {
      onError('Please enter a valid URL');
      return;
    }

    setLoading(true);
    try {
      const delimiterValue = delimiter === 'auto' ? null : delimiter;
      const data = await fetchFromUrl(url, delimiterValue);
      onDataLoaded(data);
    } catch (err: any) {
      onError(err.response?.data?.detail || err.message || 'Failed to fetch data from URL');
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="file-upload-container">
      <div className="delimiter-section">
        <label htmlFor="delimiter-select">Delimiter (for CSV/TXT files):</label>
        <select
          id="delimiter-select"
          value={delimiter}
          onChange={(e) => setDelimiter(e.target.value)}
          className="delimiter-select"
        >
          <option value="auto">Auto-detect</option>
          <option value=",">Comma (,)</option>
          <option value=";">Semicolon (;)</option>
          <option value="\t">Tab (\t)</option>
          <option value="|">Pipe (|)</option>
          <option value=" ">Space</option>
        </select>
      </div>

      <div className="upload-section">
        <h2>📤 Upload File</h2>
        <div
          className={`drop-zone ${dragActive ? 'active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls,.txt"
            onChange={handleFileInputChange}
            style={{ display: 'none' }}
          />
          <div className="drop-zone-content">
            <div className="upload-icon">📁</div>
            <p className="drop-zone-text">
              {loading ? 'Processing...' : 'Drag & drop a file here or click to browse'}
            </p>
            <p className="drop-zone-hint">
              Supported formats: CSV, Excel (.xlsx), TXT (up to 100MB)
            </p>
          </div>
        </div>
      </div>

      <div className="divider">
        <span>OR</span>
      </div>

      <div className="url-section">
        <h2>🌐 Fetch from URL</h2>
        <div className="url-input-group">
          <input
            type="url"
            placeholder="https://example.com/data.csv"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleUrlFetch()}
            disabled={loading}
            className="url-input"
          />
          <button
            onClick={handleUrlFetch}
            disabled={loading || !url.trim()}
            className="fetch-btn"
          >
            {loading ? 'Fetching...' : 'Fetch Data'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default FileUpload;
