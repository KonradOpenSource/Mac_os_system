import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private isDarkModeSubject = new BehaviorSubject<boolean>(false);
  public isDarkMode$ = this.isDarkModeSubject.asObservable();

  private currentWallpaperSubject = new BehaviorSubject<string>('default');
  public currentWallpaper$ = this.currentWallpaperSubject.asObservable();

  constructor() {
    this.initializeTheme();
  }

  private initializeTheme(): void {
  
    const savedTheme = localStorage.getItem('macos-theme');
    const isDark =
      savedTheme === 'dark' ||
      (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);

    this.isDarkModeSubject.next(isDark);
    this.applyTheme(isDark);

    const savedWallpaper = localStorage.getItem('macos-wallpaper');
    if (savedWallpaper) {
      this.currentWallpaperSubject.next(savedWallpaper);
    }
  }

  private applyTheme(isDark: boolean): void {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.classList.add('dark-mode');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      document.body.classList.remove('dark-mode');
    }
  }

  toggleTheme(): void {
    const newTheme = !this.isDarkModeSubject.value;
    this.isDarkModeSubject.next(newTheme);
    this.applyTheme(newTheme);
    localStorage.setItem('macos-theme', newTheme ? 'dark' : 'light');
  }

  setWallpaper(wallpaper: string): void {
    this.currentWallpaperSubject.next(wallpaper);
    localStorage.setItem('macos-wallpaper', wallpaper);
  }

  getCurrentTheme(): boolean {
    return this.isDarkModeSubject.value;
  }

  getCurrentWallpaper(): string {
    return this.currentWallpaperSubject.value;
  }

  getWallpapers(): string[] {
    return ['default', 'dark', 'ocean', 'forest'];
  }
}
