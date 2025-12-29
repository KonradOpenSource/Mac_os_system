import { TestBed } from '@angular/core/testing';

import { ThemeService } from './theme';

describe('ThemeService', () => {
  let service: ThemeService;
  let localStorageMock: { [key: string]: string } = {};
  let matchMediaMock: any;

  beforeEach(() => {
    // Mock localStorage
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      return localStorageMock[key] || null;
    });
    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => {
      localStorageMock[key] = value;
    });

    // Mock window.matchMedia
    matchMediaMock = spyOn(window, 'matchMedia').and.callFake((query: string) => {
      return {
        matches: query === '(prefers-color-scheme: dark)' ? false : false,
        media: query,
        onchange: null,
        addListener: jasmine.createSpy('addListener'),
        removeListener: jasmine.createSpy('removeListener'),
        addEventListener: jasmine.createSpy('addEventListener'),
        removeEventListener: jasmine.createSpy('removeEventListener'),
        dispatchEvent: jasmine.createSpy('dispatchEvent'),
      } as MediaQueryList;
    });

    // Mock document methods
    spyOn(document.documentElement, 'setAttribute');
    spyOn(document.body.classList, 'add');
    spyOn(document.body.classList, 'remove');

    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  afterEach(() => {
    localStorageMock = {};
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with light theme by default', () => {
    expect(service.getCurrentTheme()).toBe(false);
  });

  it('should initialize with dark theme from localStorage', () => {
    localStorageMock['macos-theme'] = 'dark';

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);

    expect(service.getCurrentTheme()).toBe(true);
    expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
    expect(document.body.classList.add).toHaveBeenCalledWith('dark-mode');
  });

  it('should initialize with light theme from localStorage', () => {
    localStorageMock['macos-theme'] = 'light';

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);

    expect(service.getCurrentTheme()).toBe(false);
    expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'light');
    expect(document.body.classList.remove).toHaveBeenCalledWith('dark-mode');
  });

  it('should use system preference when no saved theme', () => {
    matchMediaMock.and.callFake((query: string) => {
      return {
        matches: query === '(prefers-color-scheme: dark)' ? true : false,
        media: query,
        onchange: null,
        addListener: jasmine.createSpy('addListener'),
        removeListener: jasmine.createSpy('removeListener'),
        addEventListener: jasmine.createSpy('addEventListener'),
        removeEventListener: jasmine.createSpy('removeEventListener'),
        dispatchEvent: jasmine.createSpy('dispatchEvent'),
      } as MediaQueryList;
    });

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);

    expect(service.getCurrentTheme()).toBe(true);
    expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
    expect(document.body.classList.add).toHaveBeenCalledWith('dark-mode');
  });

  it('should initialize with default wallpaper', () => {
    expect(service.getCurrentWallpaper()).toBe('default');
  });

  it('should initialize with wallpaper from localStorage', () => {
    localStorageMock['macos-wallpaper'] = 'ocean';

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);

    expect(service.getCurrentWallpaper()).toBe('ocean');
  });

  it('should toggle theme to dark', () => {
    service.toggleTheme();

    expect(service.getCurrentTheme()).toBe(true);
    expect(localStorage.setItem).toHaveBeenCalledWith('macos-theme', 'dark');
    expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
    expect(document.body.classList.add).toHaveBeenCalledWith('dark-mode');
  });

  it('should toggle theme to light', () => {
    // Start with dark theme
    localStorageMock['macos-theme'] = 'dark';
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);

    service.toggleTheme();

    expect(service.getCurrentTheme()).toBe(false);
    expect(localStorage.setItem).toHaveBeenCalledWith('macos-theme', 'light');
    expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'light');
    expect(document.body.classList.remove).toHaveBeenCalledWith('dark-mode');
  });

  it('should set wallpaper', () => {
    service.setWallpaper('forest');

    expect(service.getCurrentWallpaper()).toBe('forest');
    expect(localStorage.setItem).toHaveBeenCalledWith('macos-wallpaper', 'forest');
  });

  it('should get available wallpapers', () => {
    const wallpapers = service.getWallpapers();

    expect(wallpapers).toEqual(['default', 'dark', 'ocean', 'forest']);
  });

  it('should emit theme changes', () => {
    let emittedValue: boolean | undefined;

    service.isDarkMode$.subscribe((value) => {
      emittedValue = value;
    });

    service.toggleTheme();

    expect(emittedValue).toBe(true);
  });

  it('should emit wallpaper changes', () => {
    let emittedValue: string | undefined;

    service.currentWallpaper$.subscribe((value) => {
      emittedValue = value;
    });

    service.setWallpaper('ocean');

    expect(emittedValue).toBe('ocean');
  });

  it('should apply dark theme correctly', () => {
    localStorageMock['macos-theme'] = 'dark';

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);

    expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
    expect(document.body.classList.add).toHaveBeenCalledWith('dark-mode');
    expect(document.body.classList.remove).not.toHaveBeenCalledWith('dark-mode');
  });

  it('should apply light theme correctly', () => {
    localStorageMock['macos-theme'] = 'light';

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);

    expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'light');
    expect(document.body.classList.remove).toHaveBeenCalledWith('dark-mode');
    expect(document.body.classList.add).not.toHaveBeenCalledWith('dark-mode');
  });
});
