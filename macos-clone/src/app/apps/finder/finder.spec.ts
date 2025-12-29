import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinderComponent } from './finder';

describe('FinderComponent', () => {
  let component: FinderComponent;
  let fixture: ComponentFixture<FinderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinderComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
