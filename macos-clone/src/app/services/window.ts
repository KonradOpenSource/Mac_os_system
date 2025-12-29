import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Window as WindowInterface, WindowConstraints } from '../interfaces/window';

@Injectable({
  providedIn: 'root',
})
export class WindowService {
  private windowsSubject = new BehaviorSubject<WindowInterface[]>([]);
  public windows$ = this.windowsSubject.asObservable();

  private highestZIndex = 1000;

  constructor() {}

  createWindow(windowData: Partial<WindowInterface>): WindowInterface {
    const newWindow: WindowInterface = {
      id: windowData.id || this.generateWindowId(),
      title: windowData.title || 'New Window',
      appId: windowData.appId || '',
      x: windowData.x || 100,
      y: windowData.y || 100,
      width: windowData.width || 800,
      height: windowData.height || 600,
      isMinimized: false,
      isMaximized: false,
      isFocused: true,
      zIndex: this.getNextZIndex(),
      isResizing: false,
      resizeDirection: null,
      constraints: windowData.constraints || {
        minWidth: 200,
        minHeight: 150,
        keepAspectRatio: false,
      },
    };

    const currentWindows = this.windowsSubject.value;
    this.windowsSubject.next([...currentWindows, newWindow]);

    return newWindow;
  }

  closeWindow(windowId: string): void {
    const currentWindows = this.windowsSubject.value;
    this.windowsSubject.next(currentWindows.filter((w) => w.id !== windowId));
  }

  minimizeWindow(windowId: string): void {
    const currentWindows = this.windowsSubject.value;
    this.windowsSubject.next(
      currentWindows.map((w) => (w.id === windowId ? { ...w, isMinimized: true } : w))
    );
  }

  maximizeWindow(windowId: string): void {
    const currentWindows = this.windowsSubject.value;
    this.windowsSubject.next(
      currentWindows.map((w) => (w.id === windowId ? { ...w, isMaximized: !w.isMaximized } : w))
    );
  }

  focusWindow(windowId: string): void {
    const currentWindows = this.windowsSubject.value;
    const targetWindow = currentWindows.find((w) => w.id === windowId);

    // Only update if window exists and focus actually needs to change
    if (targetWindow && !targetWindow.isFocused) {
      this.windowsSubject.next(
        currentWindows.map((w) => ({
          ...w,
          isFocused: w.id === windowId,
          zIndex: w.id === windowId ? this.getNextZIndex() : w.zIndex,
        }))
      );
    }
  }

  moveWindow(windowId: string, x: number, y: number): void {
    const currentWindows = this.windowsSubject.value;
    this.windowsSubject.next(currentWindows.map((w) => (w.id === windowId ? { ...w, x, y } : w)));
  }

  resizeWindow(windowId: string, width: number, height: number, x?: number, y?: number): void {
    const currentWindows = this.windowsSubject.value;
    this.windowsSubject.next(
      currentWindows.map((w) => {
        if (w.id === windowId) {
          const updatedWindow = { ...w, width, height };
          if (x !== undefined) updatedWindow.x = x;
          if (y !== undefined) updatedWindow.y = y;
          return updatedWindow;
        }
        return w;
      })
    );
  }

  setWindowResizing(
    windowId: string,
    isResizing: boolean,
    direction?: WindowInterface['resizeDirection']
  ): void {
    const currentWindows = this.windowsSubject.value;
    this.windowsSubject.next(
      currentWindows.map((w) =>
        w.id === windowId ? { ...w, isResizing, resizeDirection: direction || null } : w
      )
    );
  }

  updateWindowConstraints(windowId: string, constraints: WindowConstraints): void {
    const currentWindows = this.windowsSubject.value;
    this.windowsSubject.next(
      currentWindows.map((w) => (w.id === windowId ? { ...w, constraints } : w))
    );
  }

  getWindow(windowId: string): WindowInterface | undefined {
    return this.windowsSubject.value.find((w) => w.id === windowId);
  }

  private generateWindowId(): string {
    return `window-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private getNextZIndex(): number {
    return ++this.highestZIndex;
  }
}
