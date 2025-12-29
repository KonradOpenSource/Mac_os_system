import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { WindowService } from './window';
import { Window as WindowInterface, WindowConstraints } from '../interfaces/window';

describe('WindowService', () => {
  let service: WindowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WindowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create window with default values', () => {
    const windowData = {
      title: 'Test Window',
      appId: 'test-app',
    };

    const window = service.createWindow(windowData);

    expect(window.id).toBeTruthy();
    expect(window.title).toBe('Test Window');
    expect(window.appId).toBe('test-app');
    expect(window.x).toBe(100);
    expect(window.y).toBe(100);
    expect(window.width).toBe(800);
    expect(window.height).toBe(600);
    expect(window.isMinimized).toBe(false);
    expect(window.isMaximized).toBe(false);
    expect(window.isFocused).toBe(true);
    expect(window.zIndex).toBeGreaterThan(1000);
    expect(window.isResizing).toBe(false);
    expect(window.resizeDirection).toBeNull();
  });

  it('should create window with custom values', () => {
    const windowData = {
      title: 'Custom Window',
      appId: 'custom-app',
      x: 200,
      y: 300,
      width: 1024,
      height: 768,
    };

    const window = service.createWindow(windowData);

    expect(window.x).toBe(200);
    expect(window.y).toBe(300);
    expect(window.width).toBe(1024);
    expect(window.height).toBe(768);
  });

  it('should track multiple windows', () => {
    const window1 = service.createWindow({ title: 'Window 1', appId: 'app1' });
    const window2 = service.createWindow({ title: 'Window 2', appId: 'app2' });

    service.windows$.subscribe((windows) => {
      expect(windows.length).toBe(2);
      expect(windows[0].title).toBe('Window 1');
      expect(windows[1].title).toBe('Window 2');
    });
  });

  it('should close window', () => {
    const window1 = service.createWindow({ title: 'Window 1', appId: 'app1' });
    const window2 = service.createWindow({ title: 'Window 2', appId: 'app2' });

    service.closeWindow(window1.id);

    service.windows$.subscribe((windows) => {
      expect(windows.length).toBe(1);
      expect(windows[0].id).toBe(window2.id);
    });
  });

  it('should minimize window', () => {
    const window = service.createWindow({ title: 'Test Window', appId: 'test-app' });

    service.minimizeWindow(window.id);

    service.windows$.subscribe((windows) => {
      const updatedWindow = windows.find((w) => w.id === window.id);
      expect(updatedWindow?.isMinimized).toBe(true);
    });
  });

  it('should maximize window', () => {
    const window = service.createWindow({ title: 'Test Window', appId: 'test-app' });

    service.maximizeWindow(window.id);

    service.windows$.subscribe((windows) => {
      const updatedWindow = windows.find((w) => w.id === window.id);
      expect(updatedWindow?.isMaximized).toBe(true);
    });
  });

  it('should toggle maximize window', () => {
    const window = service.createWindow({ title: 'Test Window', appId: 'test-app' });

    service.maximizeWindow(window.id);
    service.windows$.subscribe((windows) => {
      const updatedWindow = windows.find((w) => w.id === window.id);
      expect(updatedWindow?.isMaximized).toBe(true);
    });

    service.maximizeWindow(window.id);
    service.windows$.subscribe((windows) => {
      const updatedWindow = windows.find((w) => w.id === window.id);
      expect(updatedWindow?.isMaximized).toBe(false);
    });
  });

  it('should focus window', () => {
    const window1 = service.createWindow({ title: 'Window 1', appId: 'app1' });
    const window2 = service.createWindow({ title: 'Window 2', appId: 'app2' });

    service.focusWindow(window2.id);

    service.windows$.subscribe((windows) => {
      const focusedWindow = windows.find((w) => w.id === window2.id);
      const unfocusedWindow = windows.find((w) => w.id === window1.id);
      expect(focusedWindow?.isFocused).toBe(true);
      expect(unfocusedWindow?.isFocused).toBe(false);
      expect(focusedWindow?.zIndex).toBeGreaterThan(unfocusedWindow?.zIndex || 0);
    });
  });

  it('should move window', () => {
    const window = service.createWindow({ title: 'Test Window', appId: 'test-app' });

    service.moveWindow(window.id, 500, 400);

    service.windows$.subscribe((windows) => {
      const updatedWindow = windows.find((w) => w.id === window.id);
      expect(updatedWindow?.x).toBe(500);
      expect(updatedWindow?.y).toBe(400);
    });
  });

  it('should resize window', () => {
    const window = service.createWindow({ title: 'Test Window', appId: 'test-app' });

    service.resizeWindow(window.id, 1200, 800);

    service.windows$.subscribe((windows) => {
      const updatedWindow = windows.find((w) => w.id === window.id);
      expect(updatedWindow?.width).toBe(1200);
      expect(updatedWindow?.height).toBe(800);
    });
  });

  it('should resize window with position', () => {
    const window = service.createWindow({ title: 'Test Window', appId: 'test-app' });

    service.resizeWindow(window.id, 1200, 800, 600, 450);

    service.windows$.subscribe((windows) => {
      const updatedWindow = windows.find((w) => w.id === window.id);
      expect(updatedWindow?.width).toBe(1200);
      expect(updatedWindow?.height).toBe(800);
      expect(updatedWindow?.x).toBe(600);
      expect(updatedWindow?.y).toBe(450);
    });
  });

  it('should set window resizing state', () => {
    const window = service.createWindow({ title: 'Test Window', appId: 'test-app' });

    service.setWindowResizing(window.id, true, 'se');

    service.windows$.subscribe((windows) => {
      const updatedWindow = windows.find((w) => w.id === window.id);
      expect(updatedWindow?.isResizing).toBe(true);
      expect(updatedWindow?.resizeDirection).toBe('se');
    });
  });

  it('should update window constraints', () => {
    const window = service.createWindow({ title: 'Test Window', appId: 'test-app' });
    const constraints: WindowConstraints = {
      minWidth: 300,
      minHeight: 200,
      maxWidth: 1920,
      maxHeight: 1080,
      keepAspectRatio: true,
    };

    service.updateWindowConstraints(window.id, constraints);

    service.windows$.subscribe((windows) => {
      const updatedWindow = windows.find((w) => w.id === window.id);
      expect(updatedWindow?.constraints).toEqual(constraints);
    });
  });

  it('should get window by id', () => {
    const window = service.createWindow({ title: 'Test Window', appId: 'test-app' });

    const foundWindow = service.getWindow(window.id);
    expect(foundWindow).toBeTruthy();
    expect(foundWindow?.id).toBe(window.id);
  });

  it('should return undefined for non-existent window', () => {
    const foundWindow = service.getWindow('non-existent-id');
    expect(foundWindow).toBeUndefined();
  });

  it('should generate unique window ids', () => {
    const window1 = service.createWindow({ title: 'Window 1', appId: 'app1' });
    const window2 = service.createWindow({ title: 'Window 2', appId: 'app2' });

    expect(window1.id).not.toBe(window2.id);
  });

  it('should increment z-index for new windows', () => {
    const window1 = service.createWindow({ title: 'Window 1', appId: 'app1' });
    const window2 = service.createWindow({ title: 'Window 2', appId: 'app2' });

    expect(window2.zIndex).toBeGreaterThan(window1.zIndex);
  });
});
