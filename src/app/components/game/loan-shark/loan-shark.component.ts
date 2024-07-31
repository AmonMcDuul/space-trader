import { Component, EventEmitter, Output } from '@angular/core';
import { GameStateService } from '../../../services/gameState.service';
import { CommonModule } from '@angular/common';

interface LoanShark {
  name: string;
  loanAmount: number;
  interestRate: number; 
}

@Component({
  selector: 'app-loan-shark',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loan-shark.component.html',
  styleUrl: './loan-shark.component.scss'
})
export class LoanSharkComponent {
  @Output() statusTextChange = new EventEmitter<string>();

  loanSharks: LoanShark[] = [
    { name: 'Sharky Joe', loanAmount: 500, interestRate: 0.1 },
    { name: 'Mean Mike', loanAmount: 2000, interestRate: 0.08 },
    { name: 'Big Tony', loanAmount: 5000, interestRate: 0.06 },
    { name: 'Boss Don', loanAmount: 10000, interestRate: 0.04 }
  ];
  chosenLoanShark: LoanShark | null = null;
  result: string = '';
  daysPassed: number = 0;

  constructor(public gameState: GameStateService) { }

  
  chooseLoanShark(loanShark: LoanShark) {
    this.chosenLoanShark = loanShark;
    this.result = `You chose ${loanShark.name} and received a loan of $${loanShark.loanAmount} with an interest rate of ${loanShark.interestRate * 100}%.`;
  }

  passDay() {
    this.daysPassed++;
    if (this.chosenLoanShark) {
      const interestAccrued = this.chosenLoanShark.loanAmount * this.chosenLoanShark.interestRate * this.daysPassed;
      this.result = `You chose ${this.chosenLoanShark.name}. Days passed: ${this.daysPassed}. Interest accrued: $${interestAccrued.toFixed(2)}. Total debt: $${(this.chosenLoanShark.loanAmount + interestAccrued).toFixed(2)}.`;
    }
  }
}
