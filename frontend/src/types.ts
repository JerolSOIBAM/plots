export interface DataInfo {
  success: boolean;
  filename: string;
  rows: number;
  columns: string[];
  column_types: Record<string, string>;
  preview: Record<string, any>[];
  preview_rows: number;
  data: Record<string, any>[];
}

export interface PlotAnnotation {
  x: number | string;
  y: number;
  text: string;
  color?: string;
  fontSize?: number;
  xanchor?: 'auto' | 'left' | 'center' | 'right';
  yanchor?: 'auto' | 'top' | 'middle' | 'bottom';
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
  annotations?: PlotAnnotation[];
}

export interface SubplotConfig {
  xColumn: string;
  yColumns: string[];
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  differentShapes?: boolean;
}

export interface SubplotsConfig {
  numPlots: number;
  rows: number;
  cols: number;
  plots: SubplotConfig[];
  plotType: 'line' | 'scatter' | 'line+markers' | 'bar';  // Global plot type
  // Global font settings
  titleFontSize?: number;
  titleFontWeight?: 'normal' | 'bold';
  titleFontStyle?: 'normal' | 'italic';
  axisFontSize?: number;
  axisFontWeight?: 'normal' | 'bold';
  axisFontStyle?: 'normal' | 'italic';
}

export type ColumnType = 'numeric' | 'datetime' | 'text';
