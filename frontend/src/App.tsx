import { useState } from 'react'
import './App.css'
import FileUpload from './components/FileUpload'
import DataPreview from './components/DataPreview'
import PlotConfig from './components/PlotConfig'
import PlotDisplay from './components/PlotDisplay'
import SubplotsManager from './components/SubplotsManager'
import SubplotsDisplay from './components/SubplotsDisplay'
import { DataInfo, PlotConfig as PlotConfigType, SubplotsConfig } from './types'

type TabType = 'preview' | 'plot' | 'subplots'

function App() {
  const [dataInfo, setDataInfo] = useState<DataInfo | null>(null)
  const [plotConfig, setPlotConfig] = useState<PlotConfigType | null>(null)
  const [subplotsConfig, setSubplotsConfig] = useState<SubplotsConfig | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('preview')

  const handleDataLoaded = (data: DataInfo) => {
    setDataInfo(data)
    setError(null)
    setActiveTab('preview')
  }

  const handlePlotConfigChange = (config: PlotConfigType) => {
    setPlotConfig((prevConfig: PlotConfigType | null) => ({
      ...prevConfig,
      ...config,
    }))
  }

  const handleReset = () => {
    setDataInfo(null)
    setPlotConfig(null)
    setSubplotsConfig(null)
    setError(null)
    setActiveTab('preview')
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>📊 Interactive Plotting App</h1>
        <p>Upload or fetch datasets and create beautiful interactive visualizations</p>
      </header>

      {error && (
        <div className="error-banner">
          <strong>Error:</strong> {error}
          <button onClick={() => setError(null)} className="close-btn">×</button>
        </div>
      )}

      <div className="app-container">
        {!dataInfo ? (
          <div className="upload-center">
            <FileUpload 
              onDataLoaded={handleDataLoaded} 
              onError={setError}
            />
          </div>
        ) : (
          <>
            {/* Sidebar - Only show on preview tab */}
            {activeTab === 'preview' && (
              <aside className="sidebar">
                <div className="sidebar-header">
                  <h3>📁 Dataset</h3>
                  <button onClick={handleReset} className="reset-btn-small" title="Load new data">
                    ↻
                  </button>
                </div>
                
                <div className="dataset-info">
                  <p className="filename">{dataInfo.filename}</p>
                  <div className="stats">
                    <div className="stat">
                      <span className="label">Rows:</span>
                      <span className="value">{dataInfo.rows.toLocaleString()}</span>
                    </div>
                    <div className="stat">
                      <span className="label">Columns:</span>
                      <span className="value">{dataInfo.columns.length}</span>
                    </div>
                    <div className="stat">
                      <span className="label">Preview:</span>
                      <span className="value">{dataInfo.preview_rows} rows</span>
                    </div>
                  </div>
                </div>
              </aside>
            )}

            {/* Main Content */}
            <main className="main-content">
              <div className="tabs">
                <button 
                  className={`tab ${activeTab === 'preview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('preview')}
                >
                  📋 Data Preview
                </button>
                <button 
                  className={`tab ${activeTab === 'plot' ? 'active' : ''}`}
                  onClick={() => setActiveTab('plot')}
                >
                  📈 Visualization
                </button>
                <button 
                  className={`tab ${activeTab === 'subplots' ? 'active' : ''}`}
                  onClick={() => setActiveTab('subplots')}
                >
                  🎛️ Subplots
                </button>
                {activeTab !== 'preview' && (
                  <button onClick={handleReset} className="reset-btn-tab" title="Load new data">
                    ↻ New Dataset
                  </button>
                )}
              </div>

              <div className="tab-content">
                {activeTab === 'preview' && (
                  <DataPreview data={dataInfo.preview} columns={dataInfo.columns} />
                )}
                
                {activeTab === 'plot' && (
                  <div className="plot-tab-layout">
                    <div className="config-panel">
                      <h3>⚙️ Plot Configuration</h3>
                      <PlotConfig 
                        columns={dataInfo.columns}
                        columnTypes={dataInfo.column_types}
                        onConfigChange={handlePlotConfigChange}
                        initialConfig={plotConfig || undefined}
                      />
                    </div>
                    {plotConfig && (
                      <div className="plot-display-area">
                        <PlotDisplay 
                          data={dataInfo.data}
                          config={plotConfig}
                          onConfigUpdate={setPlotConfig}
                        />
                      </div>
                    )}
                    {!plotConfig && (
                      <div className="empty-state">
                        <p>☝️ Configure your plot on the left to get started</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'subplots' && (
                  <div className="subplots-tab-layout">
                    <div className="config-panel">
                      <SubplotsManager
                        columns={dataInfo.columns}
                        columnTypes={dataInfo.column_types}
                        onConfigChange={setSubplotsConfig}
                        initialConfig={subplotsConfig || undefined}
                      />
                    </div>
                    {subplotsConfig && (
                      <div className="plot-display-area">
                        <SubplotsDisplay
                          data={dataInfo.data}
                          config={subplotsConfig}
                          onConfigUpdate={setSubplotsConfig}
                        />
                      </div>
                    )}
                    {!subplotsConfig && (
                      <div className="empty-state">
                        <p>☝️ Configure your subplots on the left to get started</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </main>
          </>
        )}
      </div>

      <footer className="app-footer">
        <p>Built with React, FastAPI, and Plotly | 2025</p>
      </footer>
    </div>
  )
}

export default App
