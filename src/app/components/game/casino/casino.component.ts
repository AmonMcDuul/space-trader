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

  betAmount: number = 0;
  result: string = '';
  chosenNumber: number | null = null;
  highOrLowChoice: 'high' | 'low' | null = null;
  games: Game[] = [
    { name: 'High or Low', play: this.playHighOrLow.bind(this) },
    { name: 'Double or Nothing', play: this.playDoubleOrNothing.bind(this) },
    { name: 'Guess the Number', play: this.playGuessTheNumber.bind(this) }
  ];

  constructor(public gameState: GameStateService) { }

  playGame(game: Game) {
    if (this.betAmount > 0) {
      game.play(this.betAmount);
    } else {
      this.result = 'Please enter a valid bet amount.';
    }
  }

  playHighOrLow(bet: number): void {
    const initialNumber = Math.floor(Math.random() * 100) + 1;
    const nextNumber = Math.floor(Math.random() * 100) + 1;
    if (this.highOrLowChoice) {
      const resultText = `Initial number: ${initialNumber}, Next number: ${nextNumber}. `;
      if (
        (this.highOrLowChoice === 'high' && nextNumber > initialNumber) ||
        (this.highOrLowChoice === 'low' && nextNumber < initialNumber)
      ) {
        this.result = resultText + `Congratulations! You won $${bet * 2} in High or Low!`;
      } else {
        this.result = resultText + `Sorry, you lost $${bet} in High or Low.`;
      }
    } else {
      this.result = 'Please choose High or Low to play High or Low.';
    }
  }

  playDoubleOrNothing(bet: number): void {
    const outcome = Math.random() < 0.5;
    if (outcome) {
      this.result = 'Coin Flip: Heads - Congratulations! You doubled your bet and won $' + (bet * 2) + '!';
    } else {
      this.result = 'Coin Flip: Tails - Sorry, you lost $' + bet + ' in Double or Nothing.';
    }
  }

  playGuessTheNumber(bet: number): void {
    const chosenNumber = this.chosenNumber;
    const randomNumber = Math.floor(Math.random() * 10) + 1;
    if (chosenNumber !== null) {
      if (chosenNumber === randomNumber) {
        this.result = `You guessed: ${chosenNumber}, Correct number: ${randomNumber} - Amazing! You won $${bet * 10}!`;
      } else {
        this.result = `You guessed: ${chosenNumber}, Correct number: ${randomNumber} - Unlucky! You lost $${bet}.`;
      }
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
}