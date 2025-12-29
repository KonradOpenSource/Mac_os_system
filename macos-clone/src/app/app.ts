import { Component, OnInit } from '@angular/core';
import { Desktop } from './components/desktop/desktop';
import { ThemeService } from './services/theme';

@Component({
  selector: 'app-root',
  imports: [Desktop],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  title = 'macOS Clone';

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.initializeTheme();
    this.setupKeyboardShortcuts();
  }

  private initializeTheme(): void {
    
    this.themeService.isDarkMode$.subscribe((isDark) => {
      
    });
  }

  private setupKeyboardShortcuts(): void {
    document.addEventListener('keydown', (event) => {
      if (event.metaKey || event.ctrlKey) {
        switch (event.key) {
          case 'q':
            event.preventDefault();
            this.quitApp();
            break;
          case 'w':
            event.preventDefault();
            this.closeFocusedWindow();
            break;
          case 'm':
            event.preventDefault();
            this.minimizeFocusedWindow();
            break;
        }
      }
    });
  }

  private quitApp(): void {
    if (confirm('Czy na pewno chcesz zamknąć macOS Clone?')) {
      window.close();
    }
  }

  private closeFocusedWindow(): void {
    const focusedWindow = document.querySelector('.window.focused');
    if (focusedWindow) {
      const closeButton = focusedWindow.querySelector('.window-control.close') as HTMLElement;
      if (closeButton) {
        closeButton.click();
      }
    }
  }

  private minimizeFocusedWindow(): void {
    const focusedWindow = document.querySelector('.window.focused');
    if (focusedWindow) {
      const minimizeButton = focusedWindow.querySelector('.window-control.minimize') as HTMLElement;
      if (minimizeButton) {
        minimizeButton.click();
      }
    }
  }
}
