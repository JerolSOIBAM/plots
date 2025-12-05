import { useState, useEffect } from 'react';
import { PlotConfig as PlotConfigType } from '../types';
import './PlotConfig.css';

interface PlotConfigProps {
  columns: string[];
  columnTypes: Record<string, string>;
  onConfigChange: (config: PlotConfigType) => void;
  initialConfig?: PlotConfigType;
}

function PlotConfig({ columns, columnTypes, onConfigChange, initialConfig }: PlotConfigProps) {
  const [xColumn, setXColumn] = useState(initialConfig?.xColumn || '');
  const [yColumns, setYColumns] = useState<string[]>(initialConfig?.yColumns || []);
  const [plotType, setPlotType] = useState<PlotConfigType['plotType']>(initialConfig?.plotType || 'line');
  const [differentShapes, setDifferentShapes] = useState(initialConfig?.differentShapes ?? true);

  // Get columns suitable for X-axis (numeric, datetime, or text)
  const xAxisColumns = columns;

  // Get columns suitable for Y-axis (numeric only)
  const yAxisColumns = columns.filter(
    (col) => columnTypes[col] === 'numeric'
  );

  useEffect(() => {
    // Auto-select first column as X if available
    if (columns.length > 0 && !xColumn) {
      setXColumn(columns[0]);
    }
  }, [columns, xColumn]);

  useEffect(() => {
    // Emit config when valid, preserving existing customization
    if (xColumn && yColumns.length > 0) {
      onConfigChange({
        ...initialConfig,
        xColumn,
        yColumns,
        plotType,
        differentShapes,
      });
    }
  }, [xColumn, yColumns, plotType, differentShapes, onConfigChange]);

  const handleYColumnToggle = (column: string) => {
    setYColumns((prev) =>
      prev.includes(column)
        ? prev.filter((c) => c !== column)
        : [...prev, column]
    );
  };

  const getColumnTypeLabel = (type: string) => {
    switch (type) {
      case 'numeric':
        return '🔢';
      case 'datetime':
        return '📅';
      case 'text':
        return '📝';
      default:
        return '';
    }
  };

  return (
    <div className="plot-config">
      <h3>⚙️ Plot Configuration</h3>

      <div className="axis-grid">
        {/* X-Axis Selection */}
        <div className="config-group">
          <label htmlFor="x-axis">X-Axis:</label>
          <select
            id="x-axis"
            value={xColumn}
            onChange={(e) => setXColumn(e.target.value)}
            className="config-select"
          >
            <option value="">Select column...</option>
            {xAxisColumns.map((col) => (
              <option key={col} value={col}>
                {getColumnTypeLabel(columnTypes[col])} {col}
              </option>
            ))}
          </select>
        </div>

        {/* Y-Axis Selection - Multiple selection with checkboxes */}
        <div className="config-group">
          <label htmlFor="y-axis">Y-Axis (Select one or more):</label>
          {yAxisColumns.length === 0 ? (
            <p className="no-numeric-warning">
              ⚠️ No numeric columns
            </p>
          ) : (
            <div className="y-axis-multiselect">
              <div className="multiselect-box">
                {yAxisColumns.map((col) => (
                  <label key={col} className="multiselect-option">
                    <input
                      type="checkbox"
                      checked={yColumns.includes(col)}
                      onChange={() => handleYColumnToggle(col)}
                    />
                    <span>
                      {getColumnTypeLabel(columnTypes[col])} {col}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Plot Type Selection */}
      <div className="config-group">
        <label htmlFor="plot-type">Plot Type:</label>
        <select
          id="plot-type"
          value={plotType}
          onChange={(e) => setPlotType(e.target.value as PlotConfigType['plotType'])}
          className="config-select"
        >
          <option value="line">Line Chart</option>
          <option value="scatter">Scatter Plot</option>
          <option value="line+markers">Line + Markers</option>
          <option value="bar">Bar Chart</option>
        </select>
      </div>

      {/* Different Shapes Option */}
      {(plotType === 'scatter' || plotType === 'line+markers') && yColumns.length > 1 && (
        <div className="config-group">
          <label className="config-label">
            <input
              type="checkbox"
              checked={differentShapes}
              onChange={(e) => setDifferentShapes(e.target.checked)}
              className="shape-checkbox"
            />
            <span>Use different marker shapes</span>
          </label>
        </div>
      )}

      {/* Validation Message */}
      {!xColumn && (
        <p className="validation-message">Select X-axis column</p>
      )}
      {xColumn && yColumns.length === 0 && yAxisColumns.length > 0 && (
        <p className="validation-message">Select at least one Y-axis column</p>
      )}
      {xColumn && yColumns.length > 0 && (
        <p className="success-message">
          ✅ Ready to plot
        </p>
      )}
    </div>
  );
}

export default PlotConfig;
