import { Component } from '@angular/core';
import { GameStateService } from '../../services/gameState.service';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { faCircleHalfStroke } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-endgame',
  standalone: true,
  imports: [FontAwesomeModule, FormsModule, CommonModule],
  templateUrl: './endgame.component.html',
  styleUrl: './endgame.component.scss'
})
export class EndgameComponent {
  username: string = '';
  gamestate: number = 0;
  faCircleHalfStroke = faCircleHalfStroke;

  private gameLengthToStateMap = new Map<number, number>([
    [15, 0],
    [30, 1],
    [60, 2],
    [90, 3]
  ]);

  constructor(public gameState: GameStateService, private apiservice: ApiService, private router: Router, protected themeService: ThemeService) { }

  onSubmit() {
    this.gamestate = this.gameLengthToStateMap.get(this.gameState.gameLength) ?? 0;
    this.apiservice.sendHighScore(this.gameState.balance(), this.username, this.gamestate)
      .subscribe(() => {
        this.router.navigate(['/']);
      }, error => {
        alert("Failed to submit score");
        this.router.navigate(['/']);
      });
  }

  exit(){
    this.router.navigate(['/']);
  }

  toggleTheme() {
    this.themeService.change();
  }
}
