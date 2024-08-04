export class LoanShark {
    name: string;
    loanAmount: number;
    interestRate: number; 
    chosen: boolean;

    constructor(name: string, loanAmount: number, interestRate: number, chosen: boolean) {
        this.name = name;
        this.loanAmount = loanAmount;
        this.interestRate = interestRate;
        this.chosen = chosen;
      }
  }