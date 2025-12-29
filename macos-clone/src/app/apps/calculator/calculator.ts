import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-calculator',
  imports: [CommonModule, FormsModule],
  templateUrl: './calculator.html',
  styleUrl: './calculator.scss',
})
export class CalculatorComponent implements OnInit {
  display = '0';
  previousValue = '';
  currentOperation = '';
  waitingForOperand = false;

  ngOnInit(): void {
    this.clear();
  }

  inputDigit(digit: string): void {
    if (this.waitingForOperand) {
      this.display = digit;
      this.waitingForOperand = false;
    } else {
      this.display = this.display === '0' ? digit : this.display + digit;
    }
  }

  inputDecimal(): void {
    if (this.waitingForOperand) {
      this.display = '0.';
      this.waitingForOperand = false;
      return;
    }

    if (this.display.indexOf('.') === -1) {
      this.display += '.';
    }
  }

  clear(): void {
    this.display = '0';
    this.previousValue = '';
    this.currentOperation = '';
    this.waitingForOperand = false;
  }

  clearEntry(): void {
    this.display = '0';
  }

  performOperation(operation: string): void {
    const inputValue = parseFloat(this.display);

    if (this.previousValue === '') {
      this.previousValue = inputValue.toString();
    } else if (this.currentOperation) {
      const result = this.calculate(parseFloat(this.previousValue), inputValue, this.currentOperation);
      this.display = result.toString();
      this.previousValue = result.toString();
    }

    this.waitingForOperand = true;
    this.currentOperation = operation;
  }

  calculate(first: number, second: number, operation: string): number {
    switch (operation) {
      case '+':
        return first + second;
      case '-':
        return first - second;
      case '*':
        return first * second;
      case '/':
        return second !== 0 ? first / second : 0;
      case '%':
        return first % second;
      case '=':
        return second;
      default:
        return second;
    }
  }

  toggleSign(): void {
    const newValue = parseFloat(this.display) * -1;
    this.display = newValue.toString();
  }

  percentage(): void {
    const newValue = parseFloat(this.display) / 100;
    this.display = newValue.toString();
  }

  getDisplayValue(): string {
    const number = parseFloat(this.display);
    if (isNaN(number)) return '0';
    
    
    if (number % 1 !== 0) {
      return number.toFixed(8).replace(/\.?0+$/, '');
    }
    return number.toString();
  }
}
