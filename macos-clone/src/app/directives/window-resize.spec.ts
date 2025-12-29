import { WindowResizeDirective } from './window-resize';
import { ElementRef } from '@angular/core';

describe('WindowResizeDirective', () => {
  it('should create an instance', () => {
    const mockElementRef = new ElementRef(document.createElement('div'));
    const directive = new WindowResizeDirective(mockElementRef);
    expect(directive).toBeTruthy();
  });
});
