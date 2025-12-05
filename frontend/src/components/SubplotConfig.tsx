import { useState, useEffect } from 'react';
import { SubplotConfig as SubplotConfigType } from '../types';
import './SubplotConfig.css';

interface SubplotConfigProps {
  subplotIndex: number;
  columns: string[];
  columnTypes: Record<string, string>;
  config: SubplotConfigType;
  onChange: (config: SubplotConfigType) => void;
  onRemove: () => void;
  canRemove: boolean;
}

function SubplotConfig({ 
  subplotIndex, 
  columns, 
  columnTypes, 
  config, 
  onChange, 
  onRemove,
  canRemove 
}: SubplotConfigProps) {
  const [xColumn, setXColumn] = useState(config.xColumn || '');
  const [yColumn, setYColumn] = useState(config.yColumns?.[0] || '');
  const [differentShapes, setDifferentShapes] = useState(config.differentShapes ?? true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const xAxisColumns = columns;
  const yAxisColumns = columns.filter((col) => columnTypes[col] === 'numeric');

  useEffect(() => {
    if (xColumn && yColumn) {
      onChange({
        xColumn,
        yColumns: [yColumn],
        differentShapes,
        title: config.title,
        xAxisLabel: config.xAxisLabel,
        yAxisLabel: config.yAxisLabel,
      });
    }
  }, [xColumn, yColumn, differentShapes]);

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
    <div className="subplot-config-item">
      <div className="subplot-header">
        <div className="subplot-title-area" onClick={() => setIsCollapsed(!isCollapsed)}>
          <button className="collapse-btn" title={isCollapsed ? "Expand" : "Collapse"}>
            {isCollapsed ? '▶' : '▼'}
          </button>
          <h4>Subplot {subplotIndex + 1}</h4>
          {xColumn && yColumn && (
            <span className="subplot-preview">({yColumn} vs {xColumn})</span>
          )}
        </div>
        {canRemove && (
          <button onClick={onRemove} className="remove-subplot-btn" title="Remove subplot">
            ✕
          </button>
        )}
      </div>

      {!isCollapsed && (
        <div className="subplot-controls">
        <div className="config-group">
          <label htmlFor={`x-axis-${subplotIndex}`}>X-Axis:</label>
          <select
            id={`x-axis-${subplotIndex}`}
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

        <div className="config-group">
          <label htmlFor={`y-axis-${subplotIndex}`}>Y-Axis:</label>
          {yAxisColumns.length === 0 ? (
            <p className="no-numeric-warning">⚠️ No numeric columns</p>
          ) : (
            <select
              id={`y-axis-${subplotIndex}`}
              value={yColumn}
              onChange={(e) => setYColumn(e.target.value)}
              className="config-select"
            >
              <option value="">Select column...</option>
              {yAxisColumns.map((col) => (
                <option key={col} value={col}>
                  {getColumnTypeLabel(columnTypes[col])} {col}
                </option>
              ))}
            </select>
          )}
        </div>

        {xColumn && !yColumn && yAxisColumns.length > 0 && (
          <p className="validation-message">Select Y-axis column</p>
        )}
        {xColumn && yColumn && (
          <p className="success-message">✅ Ready</p>
        )}
      </div>
      )}
    </div>
  );
}

export default SubplotConfig;
