import { useMemo, useRef, useState } from 'react';
import Plot from 'react-plotly.js';
import { PlotConfig, PlotAnnotation } from '../types';
import './PlotDisplay.css';

interface PlotDisplayProps {
  data: Record<string, any>[];
  config: PlotConfig;
  onConfigUpdate: (config: PlotConfig) => void;
}

function PlotDisplay({ data, config, onConfigUpdate }: PlotDisplayProps) {
  const plotRef = useRef<any>(null);
  const [showCustomization, setShowCustomization] = useState(false);
  const [showAnnotations, setShowAnnotations] = useState(false);
  const [annotations, setAnnotations] = useState<PlotAnnotation[]>(config.annotations || []);
  const [newAnnotation, setNewAnnotation] = useState({ x: '', y: '', text: '', color: '#000000', fontSize: 12, xanchor: 'auto' as const, yanchor: 'auto' as const });
  const [annotationMode, setAnnotationMode] = useState(false);
  const [pendingAnnotation, setPendingAnnotation] = useState<{ x: number | string; y: number } | null>(null);

  const { plotData, layout } = useMemo(() => {
    const xValues = data.map((row) => row[config.xColumn]);
    const shapes = ['circle', 'square', 'diamond', 'cross', 'triangle-up', 'triangle-down', 'star', 'hexagon'];

    // Create a trace for each Y column
    const traces = config.yColumns.map((yCol, index) => {
      const yValues = data.map((row) => row[yCol]);

      let mode: string | undefined = 'lines';
      let type: any = 'scatter';

      switch (config.plotType) {
        case 'scatter':
          mode = 'markers';
          break;
        case 'line+markers':
          mode = 'lines+markers';
          break;
        case 'bar':
          type = 'bar';
          mode = undefined;
          break;
        case 'line':
        default:
          mode = 'lines';
          break;
      }

      const markerConfig: any = {
        size: config.plotType === 'scatter' || config.plotType === 'line+markers' ? 8 : undefined,
      };

      // Add different shapes if enabled and plot type supports markers
      if (config.differentShapes && 
          (config.plotType === 'scatter' || config.plotType === 'line+markers') &&
          config.yColumns.length > 1) {
        markerConfig.symbol = shapes[index % shapes.length];
      }

      return {
        x: xValues,
        y: yValues,
        type,
        mode,
        name: yCol,
        marker: markerConfig,
      };
    });

    // Build font objects with proper styling
    const titleFont: any = {
      size: config.titleFontSize || 20,
      family: 'Arial, sans-serif',
      color: '#333',
    };
    
    const axisFont: any = {
      size: config.axisFontSize || 14,
      family: 'Arial, sans-serif',
      color: '#333',
    };

    // Apply HTML-like formatting for bold/italic in title text
    let titleText = config.title || `${config.yColumns.join(', ')} vs ${config.xColumn}`;
    if (config.titleFontWeight === 'bold' && config.titleFontStyle === 'italic') {
      titleText = `<b><i>${titleText}</i></b>`;
    } else if (config.titleFontWeight === 'bold') {
      titleText = `<b>${titleText}</b>`;
    } else if (config.titleFontStyle === 'italic') {
      titleText = `<i>${titleText}</i>`;
    }

    let xAxisText = config.xAxisLabel || config.xColumn;
    if (config.axisFontWeight === 'bold' && config.axisFontStyle === 'italic') {
      xAxisText = `<b><i>${xAxisText}</i></b>`;
    } else if (config.axisFontWeight === 'bold') {
      xAxisText = `<b>${xAxisText}</b>`;
    } else if (config.axisFontStyle === 'italic') {
      xAxisText = `<i>${xAxisText}</i>`;
    }

    let yAxisText = config.yAxisLabel || (config.yColumns.length === 1 ? config.yColumns[0] : 'Values');
    if (config.axisFontWeight === 'bold' && config.axisFontStyle === 'italic') {
      yAxisText = `<b><i>${yAxisText}</i></b>`;
    } else if (config.axisFontWeight === 'bold') {
      yAxisText = `<b>${yAxisText}</b>`;
    } else if (config.axisFontStyle === 'italic') {
      yAxisText = `<i>${yAxisText}</i>`;
    }

    const layoutConfig = {
      title: {
        text: titleText,
        font: titleFont,
      },
      xaxis: {
        title: {
          text: xAxisText,
          font: axisFont,
        },
        showgrid: true,
      },
      yaxis: {
        title: {
          text: yAxisText,
          font: axisFont,
        },
        showgrid: true,
      },
      autosize: true,
      hovermode: 'closest' as const,
      showlegend: config.yColumns.length > 1,
      font: {
        family: 'Arial, sans-serif',
      },
      annotations: annotations.map(ann => ({
        x: ann.x,
        y: ann.y,
        text: ann.text,
        xanchor: ann.xanchor || 'auto',
        yanchor: ann.yanchor || 'auto',
        showarrow: true,
        arrowhead: 2,
        arrowsize: 1,
        arrowwidth: 2,
        arrowcolor: ann.color || '#636363',
        ax: 0,
        ay: -40,
        font: {
          size: ann.fontSize || 12,
          color: ann.color || '#000',
        },
        bgcolor: 'rgba(255, 255, 255, 0.8)',
        bordercolor: ann.color || '#636363',
        borderwidth: 1,
        borderpad: 4,
      })),
    };

    return { plotData: traces, layout: layoutConfig };
  }, [data, config, annotations]);

  const handleAddAnnotation = () => {
    if (newAnnotation.x && newAnnotation.y && newAnnotation.text) {
      const updatedAnnotations = [...annotations, {
        x: isNaN(Number(newAnnotation.x)) ? newAnnotation.x : Number(newAnnotation.x),
        y: Number(newAnnotation.y),
        text: newAnnotation.text,
        color: newAnnotation.color,
        fontSize: newAnnotation.fontSize,
        xanchor: newAnnotation.xanchor,
        yanchor: newAnnotation.yanchor,
      }];
      setAnnotations(updatedAnnotations);
      onConfigUpdate({ ...config, annotations: updatedAnnotations });
      setNewAnnotation({ x: '', y: '', text: '', color: '#000000', fontSize: 12, xanchor: 'auto', yanchor: 'auto' });
    }
  };

  const handleRemoveAnnotation = (index: number) => {
    const updatedAnnotations = annotations.filter((_, i) => i !== index);
    setAnnotations(updatedAnnotations);
    onConfigUpdate({ ...config, annotations: updatedAnnotations });
  };

  const handlePlotClick = (event: any) => {
    if (annotationMode && event.points && event.points.length > 0) {
      const point = event.points[0];
      setPendingAnnotation({ x: point.x, y: point.y });
    }
  };

  const handleAddPendingAnnotation = () => {
    if (pendingAnnotation && newAnnotation.text) {
      const updatedAnnotations = [...annotations, {
        x: pendingAnnotation.x,
        y: pendingAnnotation.y,
        text: newAnnotation.text,
        color: newAnnotation.color,
        fontSize: newAnnotation.fontSize,
        xanchor: newAnnotation.xanchor,
        yanchor: newAnnotation.yanchor,
      }];
      setAnnotations(updatedAnnotations);
      onConfigUpdate({ ...config, annotations: updatedAnnotations });
      setNewAnnotation({ x: '', y: '', text: '', color: '#000000', fontSize: 12, xanchor: 'auto', yanchor: 'auto' });
      setPendingAnnotation(null);
      setAnnotationMode(false);
    }
  };

  const handleExportHTML = () => {
    if (plotRef.current) {
      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Interactive Plot</title>
  <script src="https://cdn.plot.ly/plotly-2.28.0.min.js"></script>
</head>
<body>
  <div id="plot"></div>
  <script>
    Plotly.newPlot('plot', ${JSON.stringify(plotData)}, ${JSON.stringify(layout)});
  </script>
</body>
</html>`;

      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `plot_${Date.now()}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="plot-display">
      <div className="plot-header">
        <h3>📈 Interactive Plot</h3>
        <div className="export-buttons">
          <button onClick={handleExportHTML} className="export-btn" title="Export as interactive HTML">
            🌐 Export HTML
          </button>
        </div>
      </div>

      <div className="plot-container">
        <Plot
          ref={plotRef}
          data={plotData}
          layout={layout}
          config={{
            responsive: true,
            displayModeBar: true,
            displaylogo: false,
            modeBarButtonsToRemove: ['lasso2d', 'select2d'],
          }}
          style={{ width: '100%', height: '600px' }}
          onClick={handlePlotClick}
        />
      </div>

      <div className="plot-info">
        <p>
          💡 <strong>Tip:</strong> Hover over data points for details. Use the toolbar to zoom, pan, or download.
        </p>
      </div>

      {/* Customization Panel */}
      <details className="customization-panel" open={showCustomization}>
        <summary className="customization-summary" onClick={() => setShowCustomization(!showCustomization)}>
          🎨 Customize Labels & Fonts
        </summary>
        <div className="customization-content">
          <div className="custom-grid">
            <div className="custom-group">
              <label htmlFor="custom-title">Plot Title:</label>
              <input
                id="custom-title"
                type="text"
                defaultValue={config.title || ''}
                onBlur={(e) => onConfigUpdate({ ...config, title: e.target.value || undefined })}
                placeholder="Auto-generated"
                className="custom-input"
              />
            </div>

            <div className="custom-group">
              <label htmlFor="custom-x-label">X-Axis Label:</label>
              <input
                id="custom-x-label"
                type="text"
                defaultValue={config.xAxisLabel || ''}
                onBlur={(e) => onConfigUpdate({ ...config, xAxisLabel: e.target.value || undefined })}
                placeholder="Column name"
                className="custom-input"
              />
            </div>

            <div className="custom-group">
              <label htmlFor="custom-y-label">Y-Axis Label:</label>
              <input
                id="custom-y-label"
                type="text"
                defaultValue={config.yAxisLabel || ''}
                onBlur={(e) => onConfigUpdate({ ...config, yAxisLabel: e.target.value || undefined })}
                placeholder="Column name"
                className="custom-input"
              />
            </div>
          </div>

          <div className="font-section">
            <h4>Title Font</h4>
            <div className="font-controls-row">
              <label>
                Size:
                <input
                  type="number"
                  value={config.titleFontSize || 20}
                  onChange={(e) => onConfigUpdate({ ...config, titleFontSize: Number(e.target.value) })}
                  min="10"
                  max="48"
                  className="font-input"
                />
              </label>
              <label>
                Weight:
                <select
                  value={config.titleFontWeight || 'bold'}
                  onChange={(e) => onConfigUpdate({ ...config, titleFontWeight: e.target.value as 'normal' | 'bold' })}
                  className="font-select"
                >
                  <option value="normal">Normal</option>
                  <option value="bold">Bold</option>
                </select>
              </label>
              <label>
                Style:
                <select
                  value={config.titleFontStyle || 'normal'}
                  onChange={(e) => onConfigUpdate({ ...config, titleFontStyle: e.target.value as 'normal' | 'italic' })}
                  className="font-select"
                >
                  <option value="normal">Normal</option>
                  <option value="italic">Italic</option>
                </select>
              </label>
            </div>
          </div>

          <div className="font-section">
            <h4>Axis Labels Font</h4>
            <div className="font-controls-row">
              <label>
                Size:
                <input
                  type="number"
                  value={config.axisFontSize || 14}
                  onChange={(e) => onConfigUpdate({ ...config, axisFontSize: Number(e.target.value) })}
                  min="8"
                  max="32"
                  className="font-input"
                />
              </label>
              <label>
                Weight:
                <select
                  value={config.axisFontWeight || 'normal'}
                  onChange={(e) => onConfigUpdate({ ...config, axisFontWeight: e.target.value as 'normal' | 'bold' })}
                  className="font-select"
                >
                  <option value="normal">Normal</option>
                  <option value="bold">Bold</option>
                </select>
              </label>
              <label>
                Style:
                <select
                  value={config.axisFontStyle || 'normal'}
                  onChange={(e) => onConfigUpdate({ ...config, axisFontStyle: e.target.value as 'normal' | 'italic' })}
                  className="font-select"
                >
                  <option value="normal">Normal</option>
                  <option value="italic">Italic</option>
                </select>
              </label>
            </div>
          </div>
        </div>
      </details>

      {/* Annotations Panel */}
      <details className="customization-panel" open={showAnnotations}>
        <summary className="customization-summary" onClick={() => setShowAnnotations(!showAnnotations)}>
          📍 Add Annotations
        </summary>
        <div className="customization-content">
          <div className="annotations-section">
            <div className="annotation-mode-toggle">
              <button 
                onClick={() => {
                  setAnnotationMode(!annotationMode);
                  setPendingAnnotation(null);
                  setNewAnnotation({ x: '', y: '', text: '', color: '#000000', fontSize: 12, xanchor: 'auto', yanchor: 'auto' });
                }}
                className={`mode-toggle-btn ${annotationMode ? 'active' : ''}`}
              >
                {annotationMode ? '🎯 Click Mode Active - Click on plot to add label' : '🎯 Enable Click-to-Annotate Mode'}
              </button>
            </div>

            {pendingAnnotation && (
              <div className="pending-annotation">
                <h4>Add Label at ({pendingAnnotation.x}, {pendingAnnotation.y})</h4>
                <div className="custom-group">
                  <label htmlFor="pending-text">Label Text:</label>
                  <input
                    id="pending-text"
                    type="text"
                    value={newAnnotation.text}
                    onChange={(e) => setNewAnnotation({ ...newAnnotation, text: e.target.value })}
                    placeholder="Enter label text"
                    className="custom-input"
                    autoFocus
                  />
                </div>
                <div className="annotation-input-grid">
                  <div className="custom-group">
                    <label htmlFor="pending-color">Color:</label>
                    <input
                      id="pending-color"
                      type="color"
                      value={newAnnotation.color}
                      onChange={(e) => setNewAnnotation({ ...newAnnotation, color: e.target.value })}
                      className="custom-input"
                    />
                  </div>
                  <div className="custom-group">
                    <label htmlFor="pending-font-size">Font Size:</label>
                    <input
                      id="pending-font-size"
                      type="number"
                      value={newAnnotation.fontSize}
                      onChange={(e) => setNewAnnotation({ ...newAnnotation, fontSize: parseInt(e.target.value) || 12 })}
                      min="8"
                      max="48"
                      className="custom-input"
                    />
                  </div>
                  <div className="custom-group">
                    <label htmlFor="pending-xanchor">H-Align:</label>
                    <select
                      id="pending-xanchor"
                      value={newAnnotation.xanchor}
                      onChange={(e) => setNewAnnotation({ ...newAnnotation, xanchor: e.target.value as any })}
                      className="custom-input"
                    >
                      <option value="auto">Auto</option>
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                  <div className="custom-group">
                    <label htmlFor="pending-yanchor">V-Align:</label>
                    <select
                      id="pending-yanchor"
                      value={newAnnotation.yanchor}
                      onChange={(e) => setNewAnnotation({ ...newAnnotation, yanchor: e.target.value as any })}
                      className="custom-input"
                    >
                      <option value="auto">Auto</option>
                      <option value="top">Top</option>
                      <option value="middle">Middle</option>
                      <option value="bottom">Bottom</option>
                    </select>
                  </div>
                </div>
                <div className="pending-actions">
                  <button onClick={handleAddPendingAnnotation} className="add-annotation-btn">
                    ✓ Add Label
                  </button>
                  <button 
                    onClick={() => {
                      setPendingAnnotation(null);
                      setNewAnnotation({ x: '', y: '', text: '', color: '#000000', fontSize: 12, xanchor: 'auto', yanchor: 'auto' });
                    }} 
                    className="cancel-btn"
                  >
                    ✕ Cancel
                  </button>
                </div>
              </div>
            )}

            {!annotationMode && !pendingAnnotation && (
              <>
                <h4>Or Add Label Manually</h4>
                <div className="annotation-input-grid">
                  <div className="custom-group">
                    <label htmlFor="ann-x">X Position:</label>
                    <input
                      id="ann-x"
                      type="text"
                      value={newAnnotation.x}
                      onChange={(e) => setNewAnnotation({ ...newAnnotation, x: e.target.value })}
                      placeholder="e.g., 100 or date"
                      className="custom-input"
                    />
                  </div>
                  <div className="custom-group">
                    <label htmlFor="ann-y">Y Position:</label>
                    <input
                      id="ann-y"
                      type="number"
                      value={newAnnotation.y}
                      onChange={(e) => setNewAnnotation({ ...newAnnotation, y: e.target.value })}
                      placeholder="e.g., 25"
                      className="custom-input"
                    />
                  </div>
                  <div className="custom-group">
                    <label htmlFor="ann-text">Label Text:</label>
                    <input
                      id="ann-text"
                      type="text"
                      value={newAnnotation.text}
                      onChange={(e) => setNewAnnotation({ ...newAnnotation, text: e.target.value })}
                      placeholder="e.g., Peak"
                      className="custom-input"
                    />
                  </div>
                  <div className="custom-group">
                    <label htmlFor="ann-color">Color:</label>
                    <input
                      id="ann-color"
                      type="color"
                      value={newAnnotation.color}
                      onChange={(e) => setNewAnnotation({ ...newAnnotation, color: e.target.value })}
                      className="custom-input"
                    />
                  </div>
                  <div className="custom-group">
                    <label htmlFor="ann-font-size">Font Size:</label>
                    <input
                      id="ann-font-size"
                      type="number"
                      value={newAnnotation.fontSize}
                      onChange={(e) => setNewAnnotation({ ...newAnnotation, fontSize: parseInt(e.target.value) || 12 })}
                      min="8"
                      max="48"
                      className="custom-input"
                    />
                  </div>
                  <div className="custom-group">
                    <label htmlFor="ann-xanchor">H-Align:</label>
                    <select
                      id="ann-xanchor"
                      value={newAnnotation.xanchor}
                      onChange={(e) => setNewAnnotation({ ...newAnnotation, xanchor: e.target.value as any })}
                      className="custom-input"
                    >
                      <option value="auto">Auto</option>
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                  <div className="custom-group">
                    <label htmlFor="ann-yanchor">V-Align:</label>
                    <select
                      id="ann-yanchor"
                      value={newAnnotation.yanchor}
                      onChange={(e) => setNewAnnotation({ ...newAnnotation, yanchor: e.target.value as any })}
                      className="custom-input"
                    >
                      <option value="auto">Auto</option>
                      <option value="top">Top</option>
                      <option value="middle">Middle</option>
                      <option value="bottom">Bottom</option>
                    </select>
                  </div>
                  <div className="custom-group">
                    <button onClick={handleAddAnnotation} className="add-annotation-btn">
                      ➕ Add Label
                    </button>
                  </div>
                </div>
              </>
            )}

            {annotations.length > 0 && (
              <div className="annotations-list">
                <h4>Current Labels</h4>
                {annotations.map((ann, index) => (
                  <div key={index} className="annotation-item">
                    <span>📍 {ann.text} at ({ann.x}, {ann.y})</span>
                    <button onClick={() => handleRemoveAnnotation(index)} className="remove-btn">
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </details>
    </div>
  );
}

export default PlotDisplay;
