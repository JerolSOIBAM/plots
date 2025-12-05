import { useMemo, useRef, useState } from 'react';
import Plot from 'react-plotly.js';
import { SubplotsConfig, SubplotConfig } from '../types';
import './SubplotsDisplay.css';

interface SubplotsDisplayProps {
  data: Record<string, any>[];
  config: SubplotsConfig;
  onConfigUpdate: (config: SubplotsConfig) => void;
}

function SubplotsDisplay({ data, config, onConfigUpdate }: SubplotsDisplayProps) {
  const plotRef = useRef<any>(null);
  const [expandedCustomization, setExpandedCustomization] = useState<number | null>(null);

  const handleSubplotUpdate = (index: number, updates: Partial<SubplotConfig>) => {
    const newPlots = [...config.plots];
    newPlots[index] = { ...newPlots[index], ...updates };
    onConfigUpdate({ ...config, plots: newPlots });
  };

  const { plotData, layout } = useMemo(() => {
    const shapes = ['circle', 'square', 'diamond', 'cross', 'triangle-up', 'triangle-down', 'star', 'hexagon'];
    const colors = ['#667eea', '#f093fb', '#4facfe', '#43e97b', '#fa709a', '#feca57', '#48dbfb', '#ff9ff3'];
    
    const traces: any[] = [];
    const annotations: any[] = [];
    
    // Use user-defined rows and cols
    const rows = config.rows;
    const cols = config.cols;

    config.plots.forEach((subplot, plotIndex) => {
      const xData = data.map(row => row[subplot.xColumn]);
      
      subplot.yColumns.forEach((yCol, yIndex) => {
        const yData = data.map(row => row[yCol]);
        
        let mode: string | undefined = 'lines';
        let type: any = 'scatter';
        
        // Use global plot type
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
          color: colors[(plotIndex + yIndex) % colors.length],
        };

        if (subplot.differentShapes && 
            (config.plotType === 'scatter' || config.plotType === 'line+markers') &&
            subplot.yColumns.length > 1) {
          markerConfig.symbol = shapes[yIndex % shapes.length];
        }

        traces.push({
          x: xData,
          y: yData,
          type,
          mode,
          name: yCol,
          xaxis: `x${plotIndex + 1}`,
          yaxis: `y${plotIndex + 1}`,
          marker: markerConfig,
          line: {
            color: colors[(plotIndex + yIndex) % colors.length],
            width: 2,
          },
        });
      });
    });

    // Build layout with subplots
    const layoutConfig: any = {
      grid: {
        rows,
        columns: cols,
        pattern: 'independent',
      },
      showlegend: true,
      height: rows * 400,
      font: {
        family: 'Arial, sans-serif',
      },
    };

    // Configure each subplot's axes
    config.plots.forEach((subplot, index) => {
      const axisNum = index + 1;
      const axisKey = axisNum === 1 ? '' : String(axisNum);
      
      // Build title with formatting
      let titleText = subplot.title || `${subplot.yColumns.join(', ')} vs ${subplot.xColumn}`;
      const titleFont: any = {
        size: config.titleFontSize || 16,
        family: 'Arial, sans-serif',
        color: '#333',
      };
      
      if (config.titleFontWeight === 'bold' && config.titleFontStyle === 'italic') {
        titleText = `<b><i>${titleText}</i></b>`;
      } else if (config.titleFontWeight === 'bold') {
        titleText = `<b>${titleText}</b>`;
      } else if (config.titleFontStyle === 'italic') {
        titleText = `<i>${titleText}</i>`;
      }

      // X-axis
      let xAxisText = subplot.xAxisLabel || subplot.xColumn;
      const axisFont: any = {
        size: config.axisFontSize || 12,
        family: 'Arial, sans-serif',
        color: '#333',
      };
      
      if (config.axisFontWeight === 'bold' && config.axisFontStyle === 'italic') {
        xAxisText = `<b><i>${xAxisText}</i></b>`;
      } else if (config.axisFontWeight === 'bold') {
        xAxisText = `<b>${xAxisText}</b>`;
      } else if (config.axisFontStyle === 'italic') {
        xAxisText = `<i>${xAxisText}</i>`;
      }

      // Y-axis
      let yAxisText = subplot.yAxisLabel || (subplot.yColumns.length === 1 ? subplot.yColumns[0] : 'Values');
      if (config.axisFontWeight === 'bold' && config.axisFontStyle === 'italic') {
        yAxisText = `<b><i>${yAxisText}</i></b>`;
      } else if (config.axisFontWeight === 'bold') {
        yAxisText = `<b>${yAxisText}</b>`;
      } else if (config.axisFontStyle === 'italic') {
        yAxisText = `<i>${yAxisText}</i>`;
      }

      layoutConfig[`xaxis${axisKey}`] = {
        title: {
          text: xAxisText,
          font: axisFont,
        },
        showgrid: true,
      };

      layoutConfig[`yaxis${axisKey}`] = {
        title: {
          text: yAxisText,
          font: axisFont,
        },
        showgrid: true,
      };

      // Add subplot title as annotation
      annotations.push({
        text: titleText,
        font: titleFont,
        showarrow: false,
        xref: `x${axisNum} domain`,
        yref: `y${axisNum} domain`,
        x: 0.5,
        y: 1.15,
        xanchor: 'center',
        yanchor: 'bottom',
      });
    });

    layoutConfig.annotations = annotations;

    return { plotData: traces, layout: layoutConfig };
  }, [data, config]);

  const handleExportHTML = () => {
    if (plotRef.current) {
      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Interactive Subplots</title>
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
      a.download = `subplots_${Date.now()}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="subplots-display">
      <div className="plot-header">
        <h3>📊 Interactive Subplots</h3>
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
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      <div className="plot-info">
        <p>
          💡 <strong>Tip:</strong> Hover over data points for details. Use the toolbar to zoom, pan, or download.
        </p>
      </div>

      {/* Customization for each subplot */}
      <div className="subplots-customization">
        <h3>🏷️ Customize Labels for Each Subplot</h3>
        {config.plots.map((subplot, index) => (
          <details 
            key={index} 
            className="customization-panel" 
            open={expandedCustomization === index}
            onToggle={(e) => {
              if ((e.target as HTMLDetailsElement).open) {
                setExpandedCustomization(index);
              } else if (expandedCustomization === index) {
                setExpandedCustomization(null);
              }
            }}
          >
            <summary className="customization-summary">
              Subplot {index + 1} - Labels
            </summary>
            <div className="customization-content">
              <div className="custom-grid">
                <div className="custom-group">
                  <label htmlFor={`subplot-title-${index}`}>Plot Title:</label>
                  <input
                    id={`subplot-title-${index}`}
                    type="text"
                    value={subplot.title || ''}
                    onChange={(e) => handleSubplotUpdate(index, { title: e.target.value || undefined })}
                    placeholder="Auto-generated"
                    className="custom-input"
                  />
                </div>

                <div className="custom-group">
                  <label htmlFor={`subplot-x-label-${index}`}>X-Axis Label:</label>
                  <input
                    id={`subplot-x-label-${index}`}
                    type="text"
                    value={subplot.xAxisLabel || ''}
                    onChange={(e) => handleSubplotUpdate(index, { xAxisLabel: e.target.value || undefined })}
                    placeholder="Column name"
                    className="custom-input"
                  />
                </div>

                <div className="custom-group">
                  <label htmlFor={`subplot-y-label-${index}`}>Y-Axis Label:</label>
                  <input
                    id={`subplot-y-label-${index}`}
                    type="text"
                    value={subplot.yAxisLabel || ''}
                    onChange={(e) => handleSubplotUpdate(index, { yAxisLabel: e.target.value || undefined })}
                    placeholder="Column name"
                    className="custom-input"
                  />
                </div>
              </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

export default SubplotsDisplay;
