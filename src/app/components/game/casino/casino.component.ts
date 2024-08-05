import { Component, EventEmitter, Output } from '@angular/core';
import { GameStateService } from '../../../services/gameState.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Game {
  name: string;
  play: (bet: number) => void;
}
@Component({
  selector: 'app-casino',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './casino.component.html',
  styleUrl: './casino.component.scss'
})
export class CasinoComponent {
  @Output() statusTextChange = new EventEmitter<string>();

  initialNumber: number = 50;
  betAmount: number = 0;
  betAmounts = [50, 100, 500, 1000, 5000, 10000];
  result: string = '';
  numbers = Array.from({length: 10}, (_, i) => i);
  chosenNumber: number | null = null;
  highOrLowChoice: 'high' | 'low' | null = null;
  games: Game[] = [
    { name: 'High or Low', play: this.playHighOrLow.bind(this) },
    { name: 'Double or Nothing', play: this.playDoubleOrNothing.bind(this) },
    { name: 'Guess the Number', play: this.playGuessTheNumber.bind(this) }
  ];
  highLowBool: boolean = false;
  coinFlipBool: boolean = false;
  guessNumberBool: boolean = false;

  constructor(public gameState: GameStateService) { }

  playGame(game: Game) {
    if (this.betAmount > 0 && this.betAmount <= this.gameState.balance()) {
      game.play(this.betAmount);
    } else {
      this.result = 'Please enter a valid bet amount.';
      this.gameState.setStatusText('Please enter a valid bet amount. \n');
      this.statusTextChange.emit(this.gameState.statusText());
    }
  }

  playHighOrLow(bet: number): void {
    const nextNumber = Math.floor(Math.random() * 100) + 1;
    if (this.highOrLowChoice) {
      const resultText = `Initial number: ${this.initialNumber}, Next number: ${nextNumber}. `;
      if (
        (this.highOrLowChoice === 'high' && nextNumber > this.initialNumber) ||
        (this.highOrLowChoice === 'low' && nextNumber < this.initialNumber)
      ) {
        this.result = resultText + `Congratulations! You won $${bet * 1.5 - bet} in High or Low!`;
        this.gameState.balance.update(v => v - (bet) + (bet * 1.5))
      } else {
        this.result = resultText + `Sorry, you lost $${bet} in High or Low.`;
        this.gameState.balance.update(v => v - (bet))
      }
      this.gameState.setStatusText(this.result + '\n');
      this.statusTextChange.emit(this.gameState.statusText());
    } else {
      this.result = 'Please choose High or Low to play High or Low.';
    }
    this.initialNumber = nextNumber;
  }

  playDoubleOrNothing(bet: number): void {
    const outcome = Math.random() < 0.5;
    if (outcome) {
      this.result = 'Coin Flip: Heads - Congratulations! You doubled your bet and won $' + (bet) + '!';
      this.gameState.balance.update(v => v - (bet) + (bet * 2))
    } else {
      this.result = 'Coin Flip: Tails - Sorry, you lost $' + bet + ' in Double or Nothing.';
      this.gameState.balance.update(v => v - (bet))
    }
    this.gameState.setStatusText(this.result + '\n');
    this.statusTextChange.emit(this.gameState.statusText());
  }

  playGuessTheNumber(bet: number): void {
    const chosenNumber = this.chosenNumber;
    const randomNumber = Math.floor(Math.random() * 10);
    if (chosenNumber !== null) {
      if (chosenNumber === randomNumber) {
        this.result = `You guessed: ${chosenNumber}, Correct number: ${randomNumber} - Amazing! You won $${bet * 10 - bet}!`;
        this.gameState.balance.update(v => v - (bet) + (bet * 10))
      } else {
        this.result = `You guessed: ${chosenNumber}, Correct number: ${randomNumber} - Unlucky! You lost $${bet}.`;
        this.gameState.balance.update(v => v - (bet))
      }
      this.gameState.setStatusText(this.result + '\n');
      this.statusTextChange.emit(this.gameState.statusText());
    } else {
      this.result = 'Please choose a number to play Guess the Number.';
    }
  }

  setChosenNumber(number: number): void {
    this.chosenNumber = number;
  }

  setHighOrLowChoice(choice: 'high' | 'low'): void {
    this.highOrLowChoice = choice;
  }

  openHighLow(){
    this.coinFlipBool = false;
    this.guessNumberBool = false
    this.highLowBool = true;
  }

  openCoinFlip(){
    this.guessNumberBool = false
    this.highLowBool = false;
    this.coinFlipBool = true;
  }

  openGuessNumber(){
    this.coinFlipBool = false;
    this.highLowBool = false;
    this.guessNumberBool = true
  }

  setBetAmount(betAmount: number){
    if(betAmount <= this.gameState.balance()){
      this.betAmount = betAmount;
    }
    else{
      this.gameState.setStatusText("You don't have eough money to place this bet\n");
      this.statusTextChange.emit(this.gameState.statusText());
    }
  }
}