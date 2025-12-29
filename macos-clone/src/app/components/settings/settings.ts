import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme';

@Component({
  selector: 'app-settings',
  imports: [CommonModule],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent implements OnInit {
  isDarkMode = false;
  currentWallpaper = 'default';
  availableWallpapers = [
    { id: 'default', name: 'Domyślna', preview: 'assets/wallpapers/default.svg' },
    { id: 'dark', name: 'Ciemna', preview: 'assets/wallpapers/dark.svg' },
    { id: 'ocean', name: 'Ocean', preview: 'assets/wallpapers/ocean.svg' },
    { id: 'forest', name: 'Las', preview: 'assets/wallpapers/forest.svg' },
  ];

  constructor(private themeService: ThemeService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.isDarkMode = this.themeService.getCurrentTheme();

    this.themeService.isDarkMode$.subscribe((isDark) => {
      this.isDarkMode = isDark;
      this.cdr.markForCheck();
    });

    this.themeService.currentWallpaper$.subscribe((wallpaper) => {
      this.currentWallpaper = wallpaper;
      this.cdr.markForCheck();
    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  setWallpaper(wallpaperId: string): void {
    this.themeService.setWallpaper(wallpaperId);
  }

  getWallpaperPreview(wallpaperId: string): string {
    const wallpaper = this.availableWallpapers.find((w) => w.id === wallpaperId);
    return wallpaper ? wallpaper.preview : '';
  }
}
