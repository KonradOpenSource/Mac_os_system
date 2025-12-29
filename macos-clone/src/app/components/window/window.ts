import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DragDropModule,
  CdkDragEnd,
  CdkDragMove,
  CdkDrag,
  CdkDragHandle,
} from '@angular/cdk/drag-drop';
import { Subject } from 'rxjs';
import { Window as WindowInterface, ResizeDirection } from '../../interfaces/window';
import { FinderComponent } from '../../apps/finder/finder';
import { SettingsComponent } from '../settings/settings';
import { CalculatorComponent } from '../../apps/calculator/calculator';
import { PhotosComponent } from '../../apps/photos/photos';
import { TerminalComponent } from '../../apps/terminal/terminal';
import { NotesComponent } from '../../apps/notes/notes';
import { WindowResizeDirective } from '../../directives/window-resize';

@Component({
  selector: 'app-window',
  imports: [CommonModule, DragDropModule, CdkDrag, CdkDragHandle],
  templateUrl: './window.html',
  styleUrls: ['./window.scss'],
})
export class WindowComponent implements OnInit, OnDestroy {
  @Input() windowData!: WindowInterface;
  @Output() windowClose = new EventEmitter<string>();
  @Output() windowMinimize = new EventEmitter<string>();
  @Output() windowMaximize = new EventEmitter<string>();
  @Output() windowFocus = new EventEmitter<string>();
  @Output() windowMove = new EventEmitter<{ windowId: string; x: number; y: number }>();
  @Output() windowResize = new EventEmitter<{
    windowId: string;
    width: number;
    height: number;
    x?: number;
    y?: number;
  }>();

  private destroy$ = new Subject<void>();
  public isResizing = false;
  private resizeDirection: ResizeDirection = 'se';
  private startX = 0;
  private startY = 0;
  private startWidth = 0;
  private startHeight = 0;
  private startXPos = 0;
  private startYPos = 0;
  private resizeRAFId: number | null = null;

  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {
    if (this.windowData.isFocused) {
      this.bringToFront();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.resizeRAFId !== null) {
      cancelAnimationFrame(this.resizeRAFId);
    }
  }

  onClose(): void {
    this.bringToFront();
    this.windowClose.emit(this.windowData.id);
  }

  onMinimize(): void {
    this.bringToFront();
    this.windowMinimize.emit(this.windowData.id);
  }

  onMaximize(): void {
    this.bringToFront();
    this.windowMaximize.emit(this.windowData.id);
  }

  onFocus(): void {
    this.windowFocus.emit(this.windowData.id);
  }

  onWindowFocus(): void {
    if (!this.windowData.isFocused) {
      this.onFocus();
    }
  }

  onWindowDragEnded(event: CdkDragEnd): void {
    const transform = event.source.getFreeDragPosition();
    const newX = this.windowData.x + transform.x;
    const newY = this.windowData.y + transform.y;

   
    const element = event.source.element.nativeElement;
    element.style.transform = '';

    this.windowMove.emit({
      windowId: this.windowData.id,
      x: newX,
      y: newY,
    });

    event.source.reset();
  }

  onWindowDragMoved(event: CdkDragMove): void {
    this.ngZone.runOutsideAngular(() => {
      const transform = event.source.getFreeDragPosition();
      const newX = this.windowData.x + transform.x;
      const newY = this.windowData.y + transform.y;

     
      const element = event.source.element.nativeElement;
      element.style.transform = `translate(${transform.x}px, ${transform.y}px)`;
    });
  }

  onResizeStart(event: MouseEvent, direction: ResizeDirection): void {
    event.preventDefault();
    event.stopPropagation();

    console.log('Resize handle clicked, direction:', direction);
    console.log('Window state:', {
      isMaximized: this.windowData.isMaximized,
      isMinimized: this.windowData.isMinimized,
      isFocused: this.windowData.isFocused,
    });

    
    if (this.windowData.isMaximized || this.windowData.isMinimized) {
      console.log('Resize blocked - window is maximized or minimized');
      return;
    }

    console.log('Resize started with direction:', direction);
    this.isResizing = true;
    this.resizeDirection = direction;
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.startWidth = this.windowData.width;
    this.startHeight = this.windowData.height;
    this.startXPos = this.windowData.x;
    this.startYPos = this.windowData.y;

    
    document.body.style.cursor = this.getCursorForDirection(direction);

    this.ngZone.runOutsideAngular(() => {
      const onMouseMove = (e: MouseEvent) => this.onResizeMove(e);
      const onMouseUp = () => this.onResizeEnd(onMouseMove, onMouseUp);

      document.addEventListener('mousemove', onMouseMove, { passive: true });
      document.addEventListener('mouseup', onMouseUp, { passive: true });
    });

    this.bringToFront();
  }

  onResizeHandleHover(direction: ResizeDirection): void {
    console.log('Mouse entered resize handle:', direction);
  }

  private onResizeMove(event: MouseEvent): void {
    if (!this.isResizing) return;

    if (this.resizeRAFId !== null) {
      cancelAnimationFrame(this.resizeRAFId);
    }

    this.resizeRAFId = requestAnimationFrame(() => {
      const deltaX = event.clientX - this.startX;
      const deltaY = event.clientY - this.startY;

      let newWidth = this.startWidth;
      let newHeight = this.startHeight;
      let newX = this.startXPos;
      let newY = this.startYPos;

      switch (this.resizeDirection) {
        case 'e':
          newWidth = this.startWidth + deltaX;
          break;
        case 'w':
          newWidth = this.startWidth - deltaX;
          newX = this.startXPos + deltaX;
          break;
        case 's':
          newHeight = this.startHeight + deltaY;
          break;
        case 'n':
          newHeight = this.startHeight - deltaY;
          newY = this.startYPos + deltaY;
          break;
        case 'se':
          newWidth = this.startWidth + deltaX;
          newHeight = this.startHeight + deltaY;
          break;
        case 'sw':
          newWidth = this.startWidth - deltaX;
          newHeight = this.startHeight + deltaY;
          newX = this.startXPos + deltaX;
          break;
        case 'ne':
          newWidth = this.startWidth + deltaX;
          newHeight = this.startHeight - deltaY;
          newY = this.startYPos + deltaY;
          break;
        case 'nw':
          newWidth = this.startWidth - deltaX;
          newHeight = this.startHeight - deltaY;
          newX = this.startXPos + deltaX;
          newY = this.startYPos + deltaY;
          break;
      }

      newWidth = Math.max(this.windowData.constraints.minWidth, newWidth);
      newHeight = Math.max(this.windowData.constraints.minHeight, newHeight);

      this.ngZone.run(() => {
        this.windowResize.emit({
          windowId: this.windowData.id,
          width: newWidth,
          height: newHeight,
          x: newX,
          y: newY,
        });
      });
    });
  }

  private onResizeEnd(mouseMoveHandler: any, mouseUpHandler: any): void {
    this.isResizing = false;
    document.body.style.cursor = '';
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
    if (this.resizeRAFId !== null) {
      cancelAnimationFrame(this.resizeRAFId);
      this.resizeRAFId = null;
    }
  }

  private bringToFront(): void {
    this.windowFocus.emit(this.windowData.id);
  }

  getAppComponent(): any {
    switch (this.windowData.appId) {
      case 'finder':
        return FinderComponent;
      case 'settings':
        return SettingsComponent;
      case 'calculator':
        return CalculatorComponent;
      case 'photos':
        return PhotosComponent;
      case 'terminal':
        return TerminalComponent;
      case 'notes':
        return NotesComponent;
      default:
        return null;
    }
  }

  getResizeHandles(): Array<{ direction: ResizeDirection; class: string }> {
    return [
      { direction: 'n', class: 'resize-n' },
      { direction: 'ne', class: 'resize-ne' },
      { direction: 'e', class: 'resize-e' },
      { direction: 'se', class: 'resize-se' },
      { direction: 's', class: 'resize-s' },
      { direction: 'sw', class: 'resize-sw' },
      { direction: 'w', class: 'resize-w' },
      { direction: 'nw', class: 'resize-nw' },
    ];
  }

  private getCursorForDirection(direction: ResizeDirection): string {
    const cursors: Record<ResizeDirection, string> = {
      n: 'n-resize',
      ne: 'ne-resize',
      e: 'e-resize',
      se: 'se-resize',
      s: 's-resize',
      sw: 'sw-resize',
      w: 'w-resize',
      nw: 'nw-resize',
    };
    return cursors[direction];
  }
}
