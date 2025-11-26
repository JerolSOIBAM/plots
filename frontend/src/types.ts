export interface DataInfo {
  success: boolean;
  filename: string;
  rows: number;
  columns: string[];
  column_types: Record<string, string>;
  preview: Record<string, any>[];
  preview_rows: number;
}

export interface PlotConfig {
  xColumn: string;
  yColumns: string[];
  plotType: 'line' | 'scatter' | 'line+markers' | 'bar';
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  titleFontSize?: number;
  titleFontWeight?: 'normal' | 'bold';
  titleFontStyle?: 'normal' | 'italic';
  axisFontSize?: number;
  axisFontWeight?: 'normal' | 'bold';
  axisFontStyle?: 'normal' | 'italic';
  differentShapes?: boolean;
}

export type ColumnType = 'numeric' | 'datetime' | 'text';
