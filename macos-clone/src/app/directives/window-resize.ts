import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { ResizeDirection, WindowConstraints } from '../interfaces/window';

@Directive({
  selector: '[windowResize]',
})
export class WindowResizeDirective implements OnInit, OnDestroy {
  @Input() windowData: any;
  @Input() resizeDirection: ResizeDirection = 'se';
  @Input() constraints: WindowConstraints = {
    minWidth: 200,
    minHeight: 150,
    keepAspectRatio: false,
  };
  @Output() resizeStart = new EventEmitter<void>();
  @Output() resizeMove = new EventEmitter<{
    width: number;
    height: number;
    x: number;
    y: number;
  }>();
  @Output() resizeEnd = new EventEmitter<void>();

  private isResizing = false;
  private startX = 0;
  private startY = 0;
  private startWidth = 0;
  private startHeight = 0;
  private startXPos = 0;
  private startYPos = 0;
  private aspectRatio = 1;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.aspectRatio = this.windowData.width / this.windowData.height;
    this.updateCursor();
  }

  ngOnDestroy(): void {
    this.stopResize();
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    event.preventDefault();
    this.startResize(event);
  }

  private startResize(event: MouseEvent): void {
    this.isResizing = true;
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.startWidth = this.windowData.width;
    this.startHeight = this.windowData.height;
    this.startXPos = this.windowData.x;
    this.startYPos = this.windowData.y;

    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);

    this.resizeStart.emit();
  }

  private onMouseMove = (event: MouseEvent): void => {
    if (!this.isResizing) return;

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

   
    if (this.constraints.keepAspectRatio) {
      const aspectRatio = this.startWidth / this.startHeight;
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        newHeight = newWidth / aspectRatio;
      } else {
        newWidth = newHeight * aspectRatio;
      }
    }

    newWidth = Math.max(this.constraints.minWidth, newWidth);
    newHeight = Math.max(this.constraints.minHeight, newHeight);

    if (this.constraints.maxWidth) {
      newWidth = Math.min(this.constraints.maxWidth, newWidth);
    }
    if (this.constraints.maxHeight) {
      newHeight = Math.min(this.constraints.maxHeight, newHeight);
    }

    this.resizeMove.emit({
      width: newWidth,
      height: newHeight,
      x: newX,
      y: newY,
    });
  };

  private onMouseUp = (): void => {
    this.stopResize();
  };

  private stopResize(): void {
    if (this.isResizing) {
      this.isResizing = false;
      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('mouseup', this.onMouseUp);
      this.resizeEnd.emit();
    }
  }

  private updateCursor(): void {
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

    this.el.nativeElement.style.cursor = cursors[this.resizeDirection];
  }
}
