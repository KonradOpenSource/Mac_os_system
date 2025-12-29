import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme';
import { WindowService } from '../../services/window';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { Observable, take } from 'rxjs';
import { Window as WindowInterface } from '../../interfaces/window';

@Component({
  selector: 'app-menu-bar',
  imports: [CommonModule, ClickOutsideDirective],
  templateUrl: './menu-bar.html',
  styleUrl: './menu-bar.scss',
})
export class MenuBarComponent implements OnInit {
  currentTime = new Date();
  isDarkMode = false;
  activeDropdown: string | null = null;
  windows$;

 
  wifiEnabled = true;
  bluetoothEnabled = true;
  volumeLevel = 75;
  batteryLevel = Math.floor(Math.random() * 40) + 60; // 60-100%
  notificationsEnabled = true;

  constructor(private themeService: ThemeService, private windowService: WindowService) {
    this.windows$ = this.windowService.windows$;
  }

  ngOnInit(): void {
    this.themeService.isDarkMode$.subscribe((isDark) => {
      this.isDarkMode = isDark;
    });

    setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('pl-PL', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('pl-PL', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  }

  onMenuClick(menuItem: string): void {
    console.log('Menu clicked:', menuItem);
 
  }

  onAppleMenuClick(): void {
    console.log('Apple menu clicked');
    this.toggleDropdown('apple');
  }

  toggleDropdown(menu: string): void {
    this.activeDropdown = this.activeDropdown === menu ? null : menu;
  }

  closeDropdown(): void {
    this.activeDropdown = null;
  }

  onDropdownAction(action: string): void {
    console.log('Dropdown action:', action);

    switch (action) {
      case 'wifi':
        this.wifiEnabled = !this.wifiEnabled;
        console.log('WiFi:', this.wifiEnabled ? 'Włączony' : 'Wyłączony');
        break;
      case 'bluetooth':
        this.bluetoothEnabled = !this.bluetoothEnabled;
        console.log('Bluetooth:', this.bluetoothEnabled ? 'Włączony' : 'Wyłączony');
        break;
      case 'volume':
        this.volumeLevel = this.volumeLevel > 0 ? 0 : 75;
        console.log('Głośność:', this.volumeLevel + '%');
        break;
      case 'notifications':
        this.notificationsEnabled = !this.notificationsEnabled;
        console.log('Powiadomienia:', this.notificationsEnabled ? 'Włączone' : 'Wyłączone');
        break;
      case 'battery':
        console.log('Poziom baterii:', this.batteryLevel + '%');
        break;
      case 'zoom':
        this.zoomFocusedWindow();
        break;
      case 'minimize':
        this.minimizeFocusedWindow();
        break;
      case 'bring-all':
        this.bringAllToFront();
        break;
    }

    this.closeDropdown();
  }

  private zoomFocusedWindow(): void {
    this.windows$.pipe(take(1)).subscribe((windows) => {
      const focusedWindow = windows.find((w: WindowInterface) => w.isFocused);
      if (focusedWindow) {
        this.windowService.maximizeWindow(focusedWindow.id);
        console.log('Zoomed window:', focusedWindow.title);
      }
    });
  }

  private minimizeFocusedWindow(): void {
    this.windows$.pipe(take(1)).subscribe((windows) => {
      const focusedWindow = windows.find((w: WindowInterface) => w.isFocused);
      if (focusedWindow) {
        this.windowService.minimizeWindow(focusedWindow.id);
        console.log('Minimized window:', focusedWindow.title);
      }
    });
  }

  private bringAllToFront(): void {
    this.windows$.pipe(take(1)).subscribe((windows) => {
      windows.forEach((window: WindowInterface) => {
        if (!window.isMinimized) {
          this.windowService.focusWindow(window.id);
        }
      });
      console.log('Brought all windows to front');
    });
  }
}
