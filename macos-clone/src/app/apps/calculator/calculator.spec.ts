import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { CalculatorComponent } from './calculator';

describe('CalculatorComponent', () => {
  let component: CalculatorComponent;
  let fixture: ComponentFixture<CalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalculatorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CalculatorComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with display "0"', () => {
    expect(component.display).toBe('0');
  });

  it('should input digit', () => {
    component.inputDigit('5');
    expect(component.display).toBe('5');
  });

  it('should input multiple digits', () => {
    component.inputDigit('5');
    component.inputDigit('2');
    component.inputDigit('3');
    expect(component.display).toBe('523');
  });

  it('should replace leading zero', () => {
    component.inputDigit('7');
    expect(component.display).toBe('7');
  });

  it('should input decimal point', () => {
    component.inputDigit('5');
    component.inputDecimal();
    expect(component.display).toBe('5.');
  });

  it('should not add multiple decimal points', () => {
    component.inputDigit('5');
    component.inputDecimal();
    component.inputDecimal();
    expect(component.display).toBe('5.');
  });

  it('should clear all', () => {
    component.inputDigit('5');
    component.inputDigit('2');
    component.performOperation('+');
    component.inputDigit('3');
    component.clear();
    expect(component.display).toBe('0');
    expect(component.previousValue).toBe('');
    expect(component.currentOperation).toBe('');
    expect(component.waitingForOperand).toBe(false);
  });

  it('should clear entry', () => {
    component.inputDigit('5');
    component.inputDigit('2');
    component.clearEntry();
    expect(component.display).toBe('0');
    expect(component.previousValue).toBe('');
    expect(component.currentOperation).toBe('');
    expect(component.waitingForOperand).toBe(false);
  });

  it('should perform addition', () => {
    component.inputDigit('5');
    component.performOperation('+');
    component.inputDigit('3');
    component.performOperation('=');
    expect(component.display).toBe('8');
  });

  it('should perform subtraction', () => {
    component.inputDigit('9');
    component.performOperation('-');
    component.inputDigit('4');
    component.performOperation('=');
    expect(component.display).toBe('5');
  });

  it('should perform multiplication', () => {
    component.inputDigit('6');
    component.performOperation('*');
    component.inputDigit('7');
    component.performOperation('=');
    expect(component.display).toBe('42');
  });

  it('should perform division', () => {
    component.inputDigit('8');
    component.performOperation('/');
    component.inputDigit('2');
    component.performOperation('=');
    expect(component.display).toBe('4');
  });

  it('should handle division by zero', () => {
    component.inputDigit('8');
    component.performOperation('/');
    component.inputDigit('0');
    component.performOperation('=');
    expect(component.display).toBe('0');
  });

  it('should perform percentage', () => {
    component.inputDigit('5');
    component.inputDigit('0');
    component.performOperation('%');
    expect(component.display).toBe('0.5');
  });

  it('should toggle sign', () => {
    component.inputDigit('5');
    component.toggleSign();
    expect(component.display).toBe('-5');
  });

  it('should toggle sign back to positive', () => {
    component.inputDigit('5');
    component.toggleSign();
    component.toggleSign();
    expect(component.display).toBe('5');
  });

  it('should handle consecutive operations', () => {
    component.inputDigit('5');
    component.performOperation('+');
    component.inputDigit('3');
    component.performOperation('-');
    component.inputDigit('2');
    component.performOperation('=');
    expect(component.display).toBe('6');
  });

  it('should set waiting for operand after operation', () => {
    component.inputDigit('5');
    component.performOperation('+');
    expect(component.waitingForOperand).toBe(true);
    expect(component.previousValue).toBe('5');
    expect(component.currentOperation).toBe('+');
  });

  it('should handle decimal input after operation', () => {
    component.inputDigit('5');
    component.performOperation('+');
    component.inputDecimal();
    expect(component.display).toBe('0.');
    expect(component.waitingForOperand).toBe(false);
  });

  it('should format display value correctly', () => {
    component.display = '5.00000000';
    expect(component.getDisplayValue()).toBe('5');
  });

  it('should format decimal display value correctly', () => {
    component.display = '5.12345678';
    expect(component.getDisplayValue()).toBe('5.12345678');
  });

  it('should handle NaN display value', () => {
    component.display = 'invalid';
    expect(component.getDisplayValue()).toBe('0');
  });

  it('should render display in template', () => {
    component.inputDigit('1');
    component.inputDigit('2');
    component.inputDigit('3');
    fixture.detectChanges();

    const displayElement = fixture.debugElement.query(By.css('.calc-display'));
    expect(displayElement.nativeElement.textContent).toContain('123');
  });

  it('should handle button clicks', () => {
    fixture.detectChanges();

    const button7 = fixture.debugElement.query(By.css('[data-key="7"]'));
    button7.triggerEventHandler('click', null);

    expect(component.display).toBe('7');
  });

  it('should handle operation button clicks', () => {
    component.inputDigit('5');
    fixture.detectChanges();

    const plusButton = fixture.debugElement.query(By.css('[data-key="+"]'));
    plusButton.triggerEventHandler('click', null);

    expect(component.currentOperation).toBe('+');
    expect(component.waitingForOperand).toBe(true);
  });

  it('should handle equals button click', () => {
    component.inputDigit('5');
    component.performOperation('+');
    component.inputDigit('3');
    fixture.detectChanges();

    const equalsButton = fixture.debugElement.query(By.css('[data-key="="]'));
    equalsButton.triggerEventHandler('click', null);

    expect(component.display).toBe('8');
  });

  it('should handle clear button click', () => {
    component.inputDigit('5');
    component.performOperation('+');
    component.inputDigit('3');
    fixture.detectChanges();

    const clearButton = fixture.debugElement.query(By.css('[data-key="C"]'));
    clearButton.triggerEventHandler('click', null);

    expect(component.display).toBe('0');
    expect(component.previousValue).toBe('');
    expect(component.currentOperation).toBe('');
  });
});
