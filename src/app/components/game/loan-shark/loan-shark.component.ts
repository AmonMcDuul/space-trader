import { Component, EventEmitter, Output } from '@angular/core';
import { GameStateService } from '../../../services/gameState.service';
import { CommonModule } from '@angular/common';

interface LoanShark {
  name: string;
  loanAmount: number;
  interestRate: number; 
  chosen: boolean;
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
    { name: 'Sharky Joe', loanAmount: 500, interestRate: 0.05, chosen: false },
    { name: 'Mean Mike', loanAmount: 2000, interestRate: 0.04, chosen: false },
    { name: 'Big Tony', loanAmount: 5000, interestRate: 0.03, chosen: false },
    { name: 'Boss Don', loanAmount: 10000, interestRate: 0.02, chosen: false }
  ];
  result: string = '';
  daysPassed: number = 0;
  
  constructor(public gameState: GameStateService) { 
   }

  chooseLoanShark(loanShark: LoanShark) {
    this.gameState.chosenLoanShark.update(v => v = { name: loanShark.name, loanAmount: loanShark.loanAmount, interestRate: loanShark.interestRate, chosen: true });
    this.result = `You chose ${loanShark.name} and received a loan of $${loanShark.loanAmount} with an interest rate of ${loanShark.interestRate * 100}%.`;
    loanShark.chosen = true;
    this.gameState.setStatusText(this.result + '\n');
    this.statusTextChange.emit(this.gameState.statusText());
    this.gameState.balance.update(v => v + loanShark.loanAmount);
    this.gameState.loan.update(v => v + loanShark.loanAmount);
    this.gameState.interestRate.update(v => loanShark.interestRate);
  }

  payOffLoan(){
    if(this.gameState.loan() <= this.gameState.balance()){
      this.gameState.balance.update(v => v - this.gameState.loan())
      this.gameState.loan.update(v => 0);
      this.gameState.setStatusText("You payed off your loan of" + this.gameState.loan() + "! \n");
      this.statusTextChange.emit(this.gameState.statusText());
      this.gameState.chosenLoanShark.update(v => v = { name: "", loanAmount: 0, interestRate: 0, chosen: false });
    }
    else {
      this.gameState.setStatusText("You can't pay off your loan yet! \n");
      this.statusTextChange.emit(this.gameState.statusText());
    }
  }
}
