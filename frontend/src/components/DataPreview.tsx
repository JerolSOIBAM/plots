import './DataPreview.css';

interface DataPreviewProps {
  data: Record<string, any>[];
  columns: string[];
}

function DataPreview({ data, columns }: DataPreviewProps) {
  if (data.length === 0) {
    return (
      <div className="data-preview">
        <h3>📋 Data Preview</h3>
        <p>No data to display</p>
      </div>
    );
  }

  return (
    <div className="data-preview">
      <h3>📋 Data Preview</h3>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th className="row-number">#</th>
              {columns.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx}>
                <td className="row-number">{idx + 1}</td>
                {columns.map((col) => (
                  <td key={col}>
                    {row[col] !== null && row[col] !== undefined
                      ? String(row[col])
                      : '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataPreview;
