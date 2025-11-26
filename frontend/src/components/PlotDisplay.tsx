import { useMemo, useRef, useState } from 'react';
import Plot from 'react-plotly.js';
import { PlotConfig } from '../types';
import './PlotDisplay.css';

interface PlotDisplayProps {
  data: Record<string, any>[];
  config: PlotConfig;
  onConfigUpdate: (config: PlotConfig) => void;
}

function PlotDisplay({ data, config, onConfigUpdate }: PlotDisplayProps) {
  const plotRef = useRef<any>(null);
  const [showCustomization, setShowCustomization] = useState(false);

  const handleTitleChange = (value: string) => {
    onConfigUpdate({ ...config, title: value || undefined });
  };

  const handleXAxisLabelChange = (value: string) => {
    onConfigUpdate({ ...config, xAxisLabel: value || undefined });
  };

  const handleYAxisLabelChange = (value: string) => {
    onConfigUpdate({ ...config, yAxisLabel: value || undefined });
  };

  const handleTitleFontSizeChange = (size: number) => {
    onConfigUpdate({ ...config, titleFontSize: size });
  };

  const handleTitleFontWeightChange = (weight: 'normal' | 'bold') => {
    onConfigUpdate({ ...config, titleFontWeight: weight });
  };

  const handleTitleFontStyleChange = (style: 'normal' | 'italic') => {
    onConfigUpdate({ ...config, titleFontStyle: style });
  };

  const handleAxisFontSizeChange = (size: number) => {
    onConfigUpdate({ ...config, axisFontSize: size });
  };

  const handleAxisFontWeightChange = (weight: 'normal' | 'bold') => {
    onConfigUpdate({ ...config, axisFontWeight: weight });
  };

  const handleAxisFontStyleChange = (style: 'normal' | 'italic') => {
    onConfigUpdate({ ...config, axisFontStyle: style });
  };

  const plotData = useMemo(() => {
    const xValues = data.map((row) => row[config.xColumn]);
    const shapes = ['circle', 'square', 'diamond', 'cross', 'triangle-up', 'triangle-down', 'star', 'hexagon'];

    // Create a trace for each Y column
    return config.yColumns.map((yCol, index) => {
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
  }, [data, config]);

  const layout = useMemo(() => {
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

    return {
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
    };
  }, [config]);

  const handleExportPNG = () => {
    if (plotRef.current && plotRef.current.el) {
      const gd = plotRef.current.el;
      const Plotly = (window as any).Plotly;
      if (Plotly && Plotly.toImage) {
        Plotly.toImage(gd, {
          format: 'png',
          width: 1600,
          height: 1000,
        }).then((dataUrl: string) => {
          const a = document.createElement('a');
          a.href = dataUrl;
          a.download = `plot_${Date.now()}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }).catch((err: any) => {
          console.error('PNG export failed:', err);
          alert('PNG export failed. Please try again.');
        });
      }
    }
  };

  const handleExportSVG = () => {
    if (plotRef.current && plotRef.current.el) {
      const gd = plotRef.current.el;
      const Plotly = (window as any).Plotly;
      if (Plotly && Plotly.toImage) {
        Plotly.toImage(gd, {
          format: 'svg',
          width: 1600,
          height: 1000,
        }).then((dataUrl: string) => {
          const a = document.createElement('a');
          a.href = dataUrl;
          a.download = `plot_${Date.now()}.svg`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }).catch((err: any) => {
          console.error('SVG export failed:', err);
          alert('SVG export failed. Please try again.');
        });
      }
    }
  };

  const handleExportPDF = () => {
    if (plotRef.current && plotRef.current.el) {
      const gd = plotRef.current.el;
      const Plotly = (window as any).Plotly;
      if (Plotly && Plotly.toImage) {
        // PDF export via PNG conversion (Plotly.js doesn't support direct PDF in browser)
        Plotly.toImage(gd, {
          format: 'png',
          width: 1600,
          height: 1000,
        }).then((dataUrl: string) => {
          // Note: True PDF would require server-side conversion
          // For now, we'll export high-res PNG
          const a = document.createElement('a');
          a.href = dataUrl;
          a.download = `plot_${Date.now()}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          alert('Note: Exported as high-resolution PNG. PDF export requires server-side processing.');
        }).catch((err: any) => {
          console.error('Export failed:', err);
          alert('Export failed. Please try again.');
        });
      }
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
        />
      </div>

      <div className="plot-info">
        <p>
          💡 <strong>Tip:</strong> Hover over data points for details. Use the toolbar
          to zoom, pan, or download the plot.
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
                value={config.title || ''}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Auto-generated"
                className="custom-input"
              />
            </div>

            <div className="custom-group">
              <label htmlFor="custom-x-label">X-Axis Label:</label>
              <input
                id="custom-x-label"
                type="text"
                value={config.xAxisLabel || ''}
                onChange={(e) => handleXAxisLabelChange(e.target.value)}
                placeholder="Column name"
                className="custom-input"
              />
            </div>

            <div className="custom-group">
              <label htmlFor="custom-y-label">Y-Axis Label:</label>
              <input
                id="custom-y-label"
                type="text"
                value={config.yAxisLabel || ''}
                onChange={(e) => handleYAxisLabelChange(e.target.value)}
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
                  onChange={(e) => handleTitleFontSizeChange(Number(e.target.value))}
                  min="10"
                  max="48"
                  className="font-input"
                />
              </label>
              <label>
                Weight:
                <select
                  value={config.titleFontWeight || 'bold'}
                  onChange={(e) => handleTitleFontWeightChange(e.target.value as 'normal' | 'bold')}
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
                  onChange={(e) => handleTitleFontStyleChange(e.target.value as 'normal' | 'italic')}
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
                  onChange={(e) => handleAxisFontSizeChange(Number(e.target.value))}
                  min="8"
                  max="32"
                  className="font-input"
                />
              </label>
              <label>
                Weight:
                <select
                  value={config.axisFontWeight || 'normal'}
                  onChange={(e) => handleAxisFontWeightChange(e.target.value as 'normal' | 'bold')}
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
                  onChange={(e) => handleAxisFontStyleChange(e.target.value as 'normal' | 'italic')}
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
    </div>
  );
}

export default PlotDisplay;
