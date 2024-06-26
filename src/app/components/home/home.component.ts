import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  showOptionsPanel = false;
  showCreditsPanel = false;
  showHowToPlayPanel = false;
  gameLength = 30;
  gameLengthOptions = [15, 30, 60, 90];

  constructor(private router: Router) {}
  
  newGame() {
    this.router.navigate(['/game', { gameLength: this.gameLength }]);
  }

  showOptions() {
    this.showOptionsPanel = true;
    this.showCreditsPanel = false;
    this.showHowToPlayPanel = false;
  }

  selectGameLength(length: number) {
    this.gameLength = length;
  }

  showCredits() {
    this.showOptionsPanel = false;
    this.showCreditsPanel = true;
    this.showHowToPlayPanel = false;
  }

  showHowToPlay() {
    this.showOptionsPanel = false;
    this.showCreditsPanel = false;
    this.showHowToPlayPanel = true;
  }
}