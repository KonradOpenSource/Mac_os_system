import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DockComponent } from './dock';

describe('DockComponent', () => {
  let component: DockComponent;
  let fixture: ComponentFixture<DockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DockComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DockComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
