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
  gameMode: number = 0;
  faCircleHalfStroke = faCircleHalfStroke;

  constructor(public gameState: GameStateService, private apiservice: ApiService, private router: Router, protected themeService: ThemeService) { }

  onSubmit() {
    if(this.gameState.gameLength() == 15){
      this.gameMode = 0;
    }
    if(this.gameState.gameLength() == 30){
      this.gameMode = 1;
    }
    if(this.gameState.gameLength() == 60){
      this.gameMode = 2;
    }
    if(this.gameState.gameLength() == 90){
      this.gameMode = 3;
    }
    this.apiservice.sendHighScore((this.gameState.balance() - this.gameState.loan()), this.username, this.gameMode)
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
