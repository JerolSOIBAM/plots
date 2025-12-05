import { useState, useEffect } from 'react';
import { SubplotsConfig, SubplotConfig } from '../types';
import SubplotConfigComponent from './SubplotConfig';
import './SubplotsManager.css';

interface SubplotsManagerProps {
  columns: string[];
  columnTypes: Record<string, string>;
  onConfigChange: (config: SubplotsConfig | null) => void;
  initialConfig?: SubplotsConfig;
}

function SubplotsManager({ columns, columnTypes, onConfigChange, initialConfig }: SubplotsManagerProps) {
  const [numPlots, setNumPlots] = useState(initialConfig?.numPlots || 2);
  const [rows, setRows] = useState(initialConfig?.rows || 2);
  const [cols, setCols] = useState(initialConfig?.cols || 1);
  const [plotType, setPlotType] = useState<'line' | 'scatter' | 'line+markers' | 'bar'>(initialConfig?.plotType || 'line');
  const [differentShapes, setDifferentShapes] = useState(true);
  const [isFontSettingsCollapsed, setIsFontSettingsCollapsed] = useState(true);
  const [titleFontSize, setTitleFontSize] = useState(initialConfig?.titleFontSize || 16);
  const [titleFontWeight, setTitleFontWeight] = useState<'normal' | 'bold'>(initialConfig?.titleFontWeight || 'bold');
  const [titleFontStyle, setTitleFontStyle] = useState<'normal' | 'italic'>(initialConfig?.titleFontStyle || 'normal');
  const [axisFontSize, setAxisFontSize] = useState(initialConfig?.axisFontSize || 12);
  const [axisFontWeight, setAxisFontWeight] = useState<'normal' | 'bold'>(initialConfig?.axisFontWeight || 'normal');
  const [axisFontStyle, setAxisFontStyle] = useState<'normal' | 'italic'>(initialConfig?.axisFontStyle || 'normal');
  const [plots, setPlots] = useState<SubplotConfig[]>(initialConfig?.plots || [
    {
      xColumn: '',
      yColumns: [],
      differentShapes: true,
    },
    {
      xColumn: '',
      yColumns: [],
      differentShapes: true,
    },
  ]);

  useEffect(() => {
    // Adjust plots array when numPlots changes
    if (numPlots > plots.length) {
      const newPlots = [...plots];
      for (let i = plots.length; i < numPlots; i++) {
        newPlots.push({
          xColumn: '',
          yColumns: [],
          differentShapes: true,
        });
      }
      setPlots(newPlots);
    } else if (numPlots < plots.length) {
      setPlots(plots.slice(0, numPlots));
    }
  }, [numPlots]);

  useEffect(() => {
    // Check if all plots are configured
    const allConfigured = plots.every(
      (plot) => plot.xColumn && plot.yColumns.length > 0
    );

    if (allConfigured) {
      onConfigChange({
        numPlots,
        rows,
        cols,
        plots,
        plotType,
        titleFontSize,
        titleFontWeight,
        titleFontStyle,
        axisFontSize,
        axisFontWeight,
        axisFontStyle,
      });
    } else {
      onConfigChange(null);
    }
  }, [plots, numPlots, rows, cols, plotType, titleFontSize, titleFontWeight, titleFontStyle, axisFontSize, axisFontWeight, axisFontStyle, onConfigChange]);

  const handlePlotChange = (index: number, config: SubplotConfig) => {
    const newPlots = [...plots];
    newPlots[index] = config;
    setPlots(newPlots);
  };

  const handleRemovePlot = (index: number) => {
    if (plots.length > 1) {
      const newPlots = plots.filter((_, i) => i !== index);
      setPlots(newPlots);
      setNumPlots(newPlots.length);
    }
  };

  const handleAddPlot = () => {
    if (plots.length < 6) {
      setNumPlots(plots.length + 1);
    }
  };

  return (
    <div className="subplots-manager">
      <div className="subplots-header">
        <h3>🎛️ Subplots Configuration</h3>
        
        <div className="subplots-controls">
          <div className="control-row">
            <div className="control-group">
              <label htmlFor="rows">Rows:</label>
              <select
                id="rows"
                value={rows}
                onChange={(e) => setRows(Number(e.target.value))}
                className="control-select"
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            <div className="control-group">
              <label htmlFor="cols">Columns:</label>
              <select
                id="cols"
                value={cols}
                onChange={(e) => setCols(Number(e.target.value))}
                className="control-select"
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            <div className="control-group">
              <label htmlFor="num-plots">Subplots:</label>
              <select
                id="num-plots"
                value={numPlots}
                onChange={(e) => setNumPlots(Number(e.target.value))}
                className="control-select"
              >
                {Array.from({ length: Math.min(rows * cols, 36) }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            <div className="control-group">
              <label htmlFor="plot-type">Plot Type (All):</label>
              <select
                id="plot-type"
                value={plotType}
                onChange={(e) => setPlotType(e.target.value as 'line' | 'scatter' | 'line+markers' | 'bar')}
                className="control-select"
              >
                <option value="line">Line Chart</option>
                <option value="scatter">Scatter Plot</option>
                <option value="line+markers">Line + Markers</option>
                <option value="bar">Bar Chart</option>
              </select>
            </div>
          </div>

          {(plotType === 'scatter' || plotType === 'line+markers') && (
            <div className="control-group">
              <label className="config-label">
                <input
                  type="checkbox"
                  checked={differentShapes}
                  onChange={(e) => setDifferentShapes(e.target.checked)}
                  className="shape-checkbox"
                />
                <span>Use different marker shapes for multiple Y-axis</span>
              </label>
            </div>
          )}
        </div>

        {/* Global Font Settings */}
        <div className="global-font-settings">
          <div className="font-settings-header" onClick={() => setIsFontSettingsCollapsed(!isFontSettingsCollapsed)}>
            <button className="collapse-btn" title={isFontSettingsCollapsed ? "Expand" : "Collapse"}>
              {isFontSettingsCollapsed ? '▶' : '▼'}
            </button>
            <h4>🎨 Global Font Settings</h4>
          </div>
          
          {!isFontSettingsCollapsed && (
            <>
              <div className="font-section">
                <h5>Title Font</h5>
            <div className="font-controls-row">
              <label>
                Size:
                <input
                  type="number"
                  value={titleFontSize}
                  onChange={(e) => setTitleFontSize(Number(e.target.value))}
                  min="10"
                  max="32"
                  className="font-input"
                />
              </label>
              <label>
                Weight:
                <select
                  value={titleFontWeight}
                  onChange={(e) => setTitleFontWeight(e.target.value as 'normal' | 'bold')}
                  className="font-select"
                >
                  <option value="normal">Normal</option>
                  <option value="bold">Bold</option>
                </select>
              </label>
              <label>
                Style:
                <select
                  value={titleFontStyle}
                  onChange={(e) => setTitleFontStyle(e.target.value as 'normal' | 'italic')}
                  className="font-select"
                >
                  <option value="normal">Normal</option>
                  <option value="italic">Italic</option>
                </select>
              </label>
            </div>
          </div>

          <div className="font-section">
            <h5>Axis Labels Font</h5>
            <div className="font-controls-row">
              <label>
                Size:
                <input
                  type="number"
                  value={axisFontSize}
                  onChange={(e) => setAxisFontSize(Number(e.target.value))}
                  min="8"
                  max="24"
                  className="font-input"
                />
              </label>
              <label>
                Weight:
                <select
                  value={axisFontWeight}
                  onChange={(e) => setAxisFontWeight(e.target.value as 'normal' | 'bold')}
                  className="font-select"
                >
                  <option value="normal">Normal</option>
                  <option value="bold">Bold</option>
                </select>
              </label>
              <label>
                Style:
                <select
                  value={axisFontStyle}
                  onChange={(e) => setAxisFontStyle(e.target.value as 'normal' | 'italic')}
                  className="font-select"
                >
                  <option value="normal">Normal</option>
                  <option value="italic">Italic</option>
                </select>
              </label>
            </div>
          </div>
          </>
          )}
        </div>
      </div>

      <div className="subplots-list">
        {plots.map((plot, index) => (
          <SubplotConfigComponent
            key={index}
            subplotIndex={index}
            columns={columns}
            columnTypes={columnTypes}
            config={plot}
            onChange={(config) => handlePlotChange(index, config)}
            onRemove={() => handleRemovePlot(index)}
            canRemove={plots.length > 1}
          />
        ))}
      </div>

      {plots.length < 6 && (
        <button onClick={handleAddPlot} className="add-subplot-btn">
          ➕ Add Another Subplot
        </button>
      )}
    </div>
  );
}

export default SubplotsManager;
