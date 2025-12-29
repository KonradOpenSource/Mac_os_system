import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { App } from '../../interfaces/app';
import { Window as WindowInterface } from '../../interfaces/window';
import { WindowService } from '../../services/window';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';

@Component({
  selector: 'app-dock',
  imports: [CommonModule, ClickOutsideDirective],
  templateUrl: './dock.html',
  styleUrl: './dock.scss',
})
export class DockComponent implements OnInit {
  dockApps: App[] = [
    {
      id: 'finder',
      name: 'Finder',
      icon: 'finder',
      component: 'finder',
      isRunning: false,
      isOpen: false,
    },
    {
      id: 'settings',
      name: 'Ustawienia',
      icon: 'settings',
      component: 'settings',
      isRunning: false,
      isOpen: false,
    },
    {
      id: 'photos',
      name: 'Zdjęcia',
      icon: 'photos',
      component: 'photos',
      isRunning: false,
      isOpen: false,
    },
    {
      id: 'calculator',
      name: 'Kalkulator',
      icon: 'calculator',
      component: 'calculator',
      isRunning: false,
      isOpen: false,
    },
    {
      id: 'notes',
      name: 'Notatki',
      icon: 'notes',
      component: 'notes',
      isRunning: false,
      isOpen: false,
    },
  ];

  windows$: Observable<WindowInterface[]>;
  activeContextMenu: string | null = null;
  hoveredApp: string | null = null;

  constructor(private windowService: WindowService) {
    this.windows$ = this.windowService.windows$;
  }

  ngOnInit(): void {
  
    this.windows$.subscribe((windows) => {
      this.updateAppStates(windows);
    });
  }

  openApp(app: App): void {
    const window = this.windowService.createWindow({
      title: app.name,
      appId: app.id,
      width: 800,
      height: 600,
      x: 100 + this.dockApps.indexOf(app) * 50,
      y: 100 + this.dockApps.indexOf(app) * 50,
    });

    app.isOpen = true;
    app.isRunning = true;
    app.windowId = window.id;
  }

  isAppOpen(appId: string): boolean {
    return this.dockApps.some((app) => app.isOpen && app.id === appId);
  }

  onContextMenu(event: MouseEvent, app: App): void {
    event.preventDefault();
    this.activeContextMenu = app.id;
  }

  closeContextMenu(): void {
    this.activeContextMenu = null;
  }

  onDockContextAction(action: string, app: App): void {
    console.log('Dock context action:', action, app.id);

    switch (action) {
      case 'open':
        this.openApp(app);
        break;
      case 'quit':
        if (app.windowId) {
          this.windowService.closeWindow(app.windowId);
        }
        app.isOpen = false;
        app.isRunning = false;
        app.windowId = undefined;
        break;
      case 'show-in-finder':
        console.log('Show in finder:', app.name);
        break;
      case 'options':
        console.log('Options for:', app.name);
        break;
    }

    this.closeContextMenu();
  }

  onAppHover(appId: string): void {
    this.hoveredApp = appId;
  }

  onAppLeave(): void {
    this.hoveredApp = null;
  }

  private updateAppStates(windows: WindowInterface[]): void {
    this.dockApps.forEach((app) => {
      const window = windows.find((w) => w.appId === app.id);

      if (!window) {
        
        if (app.isOpen) {
          app.isOpen = false;
          app.isRunning = false;
          app.windowId = undefined;
        }
      } else {
        
        app.windowId = window.id;
        app.isOpen = true;
        app.isRunning = true;
      }
    });
  }
}
