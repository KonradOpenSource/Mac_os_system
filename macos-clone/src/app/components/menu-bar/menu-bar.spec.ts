import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { MenuBarComponent } from './menu-bar';
import { ThemeService } from '../../services/theme';
import { WindowService } from '../../services/window';
import { Window as WindowInterface } from '../../interfaces/window';

describe('MenuBarComponent', () => {
  let component: MenuBarComponent;
  let fixture: ComponentFixture<MenuBarComponent>;
  let mockThemeService: any;
  let mockWindowService: any;

  beforeEach(async () => {
    mockThemeService = {
      isDarkMode$: of(false),
      toggleTheme: jasmine.createSpy('toggleTheme'),
      currentWallpaper$: of('default'),
      setWallpaper: jasmine.createSpy('setWallpaper'),
    };

    mockWindowService = {
      windows$: of([]),
      maximizeWindow: jasmine.createSpy('maximizeWindow'),
      minimizeWindow: jasmine.createSpy('minimizeWindow'),
      focusWindow: jasmine.createSpy('focusWindow'),
    };

    await TestBed.configureTestingModule({
      imports: [MenuBarComponent],
      providers: [
        { provide: ThemeService, useValue: mockThemeService },
        { provide: WindowService, useValue: mockWindowService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with current time', () => {
    expect(component.currentTime).toBeInstanceOf(Date);
  });

  it('should initialize with system icon states', () => {
    expect(component.wifiEnabled).toBe(true);
    expect(component.bluetoothEnabled).toBe(true);
    expect(component.volumeLevel).toBe(75);
    expect(component.notificationsEnabled).toBe(true);
    expect(component.batteryLevel).toBeGreaterThan(59);
    expect(component.batteryLevel).toBeLessThanOrEqual(100);
  });

  it('should format time correctly', () => {
    const testDate = new Date('2023-12-25T14:30:00');
    const formattedTime = component.formatTime(testDate);
    expect(formattedTime).toMatch(/^\d{2}:\d{2}$/);
  });

  it('should format date correctly', () => {
    const testDate = new Date('2023-12-25');
    const formattedDate = component.formatDate(testDate);
    expect(formattedDate).toContain('pon');
    expect(formattedDate).toContain('gru');
    expect(formattedDate).toContain('25');
  });

  it('should toggle apple menu dropdown', () => {
    component.toggleDropdown('apple');
    expect(component.activeDropdown).toBe('apple');

    component.toggleDropdown('apple');
    expect(component.activeDropdown).toBeNull();
  });

  it('should close dropdown', () => {
    component.activeDropdown = 'apple';
    component.closeDropdown();
    expect(component.activeDropdown).toBeNull();
  });

  it('should toggle wifi state', () => {
    const initialState = component.wifiEnabled;
    component.onDropdownAction('wifi');
    expect(component.wifiEnabled).toBe(!initialState);
    expect(component.activeDropdown).toBeNull();
  });

  it('should toggle bluetooth state', () => {
    const initialState = component.bluetoothEnabled;
    component.onDropdownAction('bluetooth');
    expect(component.bluetoothEnabled).toBe(!initialState);
    expect(component.activeDropdown).toBeNull();
  });

  it('should toggle volume state', () => {
    component.onDropdownAction('volume');
    expect(component.volumeLevel).toBe(0);

    component.onDropdownAction('volume');
    expect(component.volumeLevel).toBe(75);
    expect(component.activeDropdown).toBeNull();
  });

  it('should toggle notifications state', () => {
    const initialState = component.notificationsEnabled;
    component.onDropdownAction('notifications');
    expect(component.notificationsEnabled).toBe(!initialState);
    expect(component.activeDropdown).toBeNull();
  });

  it('should zoom focused window', () => {
    const mockWindows: WindowInterface[] = [
      {
        id: 'window1',
        title: 'Test Window',
        appId: 'test',
        x: 0,
        y: 0,
        width: 800,
        height: 600,
        isMinimized: false,
        isMaximized: false,
        isFocused: true,
        zIndex: 1000,
        isResizing: false,
        resizeDirection: null,
        constraints: { minWidth: 200, minHeight: 150, keepAspectRatio: false },
      },
    ];
    mockWindowService.windows$ = of(mockWindows);

    component.onDropdownAction('zoom');
    expect(mockWindowService.maximizeWindow).toHaveBeenCalledWith('window1');
    expect(component.activeDropdown).toBeNull();
  });

  it('should minimize focused window', () => {
    const mockWindows: WindowInterface[] = [
      {
        id: 'window1',
        title: 'Test Window',
        appId: 'test',
        x: 0,
        y: 0,
        width: 800,
        height: 600,
        isMinimized: false,
        isMaximized: false,
        isFocused: true,
        zIndex: 1000,
        isResizing: false,
        resizeDirection: null,
        constraints: { minWidth: 200, minHeight: 150, keepAspectRatio: false },
      },
    ];
    mockWindowService.windows$ = of(mockWindows);

    component.onDropdownAction('minimize');
    expect(mockWindowService.minimizeWindow).toHaveBeenCalledWith('window1');
    expect(component.activeDropdown).toBeNull();
  });

  it('should bring all windows to front', () => {
    const mockWindows: WindowInterface[] = [
      {
        id: 'window1',
        title: 'Test Window 1',
        appId: 'test',
        x: 0,
        y: 0,
        width: 800,
        height: 600,
        isMinimized: false,
        isMaximized: false,
        isFocused: false,
        zIndex: 1000,
        isResizing: false,
        resizeDirection: null,
        constraints: { minWidth: 200, minHeight: 150, keepAspectRatio: false },
      },
      {
        id: 'window2',
        title: 'Test Window 2',
        appId: 'test',
        x: 100,
        y: 100,
        width: 800,
        height: 600,
        isMinimized: true,
        isMaximized: false,
        isFocused: false,
        zIndex: 1001,
        isResizing: false,
        resizeDirection: null,
        constraints: { minWidth: 200, minHeight: 150, keepAspectRatio: false },
      },
    ];
    mockWindowService.windows$ = of(mockWindows);

    component.onDropdownAction('bring-all');
    expect(mockWindowService.focusWindow).toHaveBeenCalledWith('window1');
    expect(mockWindowService.focusWindow).not.toHaveBeenCalledWith('window2');
    expect(component.activeDropdown).toBeNull();
  });

  it('should render apple logo', () => {
    const appleLogo = fixture.debugElement.query(By.css('.apple-logo'));
    expect(appleLogo).toBeTruthy();
  });

  it('should render system icons', () => {
    const systemIcons = fixture.debugElement.queryAll(By.css('.system-icon'));
    expect(systemIcons.length).toBeGreaterThan(0);
  });

  it('should render datetime', () => {
    const datetime = fixture.debugElement.query(By.css('.datetime'));
    expect(datetime).toBeTruthy();

    const timeElement = datetime.query(By.css('.time'));
    const dateElement = datetime.query(By.css('.date'));
    expect(timeElement).toBeTruthy();
    expect(dateElement).toBeTruthy();
  });

  it('should handle apple menu click', () => {
    spyOn(component, 'onAppleMenuClick');

    const appleLogo = fixture.debugElement.query(By.css('.apple-logo'));
    appleLogo.triggerEventHandler('click', null);

    expect(component.onAppleMenuClick).toHaveBeenCalled();
  });

  it('should handle dropdown action', () => {
    spyOn(component, 'onDropdownAction');

    component.onDropdownAction('wifi');
    expect(component.onDropdownAction).toHaveBeenCalledWith('wifi');
  });

  it('should handle menu click', () => {
    spyOn(component, 'onMenuClick');

    component.onMenuClick('test-menu');
    expect(component.onMenuClick).toHaveBeenCalledWith('test-menu');
  });

  it('should update time every second', (done: () => void) => {
    const initialTime = component.currentTime;

    setTimeout(() => {
      expect(component.currentTime).not.toBe(initialTime);
      done();
    }, 1100); // Wait slightly more than 1 second
  });

  it('should not zoom when no focused window', () => {
    const mockWindows: WindowInterface[] = [
      {
        id: 'window1',
        title: 'Test Window',
        appId: 'test',
        x: 0,
        y: 0,
        width: 800,
        height: 600,
        isMinimized: false,
        isMaximized: false,
        isFocused: false,
        zIndex: 1000,
        isResizing: false,
        resizeDirection: null,
        constraints: { minWidth: 200, minHeight: 150, keepAspectRatio: false },
      },
    ];
    mockWindowService.windows$ = of(mockWindows);

    component.onDropdownAction('zoom');
    expect(mockWindowService.maximizeWindow).not.toHaveBeenCalled();
  });

  it('should not minimize when no focused window', () => {
    const mockWindows: WindowInterface[] = [
      {
        id: 'window1',
        title: 'Test Window',
        appId: 'test',
        x: 0,
        y: 0,
        width: 800,
        height: 600,
        isMinimized: false,
        isMaximized: false,
        isFocused: false,
        zIndex: 1000,
        isResizing: false,
        resizeDirection: null,
        constraints: { minWidth: 200, minHeight: 150, keepAspectRatio: false },
      },
    ];
    mockWindowService.windows$ = of(mockWindows);

    component.onDropdownAction('minimize');
    expect(mockWindowService.minimizeWindow).not.toHaveBeenCalled();
  });
});
