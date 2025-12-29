import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { WindowService } from '../../services/window';
import { ThemeService } from '../../services/theme';
import { Window as WindowInterface } from '../../interfaces/window';
import { MenuBarComponent } from '../menu-bar/menu-bar';
import { DockComponent } from '../dock/dock';
import { WindowComponent } from '../window/window';

@Component({
  selector: 'app-desktop',
  imports: [CommonModule, MenuBarComponent, DockComponent, WindowComponent],
  templateUrl: './desktop.html',
  styleUrl: './desktop.scss',
})
export class Desktop implements OnInit {
  windows$: Observable<WindowInterface[]>;
  isDarkMode = false;
  currentWallpaper = 'assets/wallpapers/default.svg';

  constructor(private windowService: WindowService, private themeService: ThemeService) {
    this.windows$ = this.windowService.windows$;
  }

  ngOnInit(): void {
    this.themeService.isDarkMode$.subscribe((isDark) => {
      this.isDarkMode = isDark;
    });

    this.themeService.currentWallpaper$.subscribe((wallpaper) => {
      this.currentWallpaper = `assets/wallpapers/${wallpaper}.svg`;
    });
  }

  onWindowClose(windowId: string): void {
    this.windowService.closeWindow(windowId);
  }

  onWindowMinimize(windowId: string): void {
    this.windowService.minimizeWindow(windowId);
  }

  onWindowMaximize(windowId: string): void {
    this.windowService.maximizeWindow(windowId);
  }

  onWindowFocus(windowId: string): void {
    this.windowService.focusWindow(windowId);
  }

  onWindowMove(event: { windowId: string; x: number; y: number }): void {
    this.windowService.moveWindow(event.windowId, event.x, event.y);
  }

  onWindowResize(event: {
    windowId: string;
    width: number;
    height: number;
    x?: number;
    y?: number;
  }): void {
    this.windowService.resizeWindow(event.windowId, event.width, event.height, event.x, event.y);
  }
}
