export interface Window {
  id: string;
  title: string;
  appId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isMinimized: boolean;
  isMaximized: boolean;
  isFocused: boolean;
  zIndex: number;
  isResizing: boolean;
  resizeDirection: ResizeDirection | null;
  constraints: WindowConstraints;
}

export interface WindowConstraints {
  minWidth: number;
  minHeight: number;
  maxWidth?: number;
  maxHeight?: number;
  keepAspectRatio: boolean;
}

export type ResizeDirection = 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw';
