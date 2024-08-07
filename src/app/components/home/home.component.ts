import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleHalfStroke } from '@fortawesome/free-solid-svg-icons';
import { ThemeService } from '../../services/theme.service';
import { HighscoreComponent } from "../highscore/highscore.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule, HighscoreComponent],
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  showOptionsPanel = false;
  showCreditsPanel = false;
  showHowToPlayPanel = false;
  showHighScoresPanel = false;
  gameLength = 30;
  gameLengthOptions = [15, 30, 60, 90];
  selectedTheme: string = 'space';
  themeOptions: string[] = [
    'space', 
    'light', 
    'dark', 
    'matrix', 
    'desert', 
    'cyberpunk', 
  ];
    faCircleHalfStroke = faCircleHalfStroke;

  constructor(private router: Router, protected themeService: ThemeService) {}

  ngOnInit() {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('selectedTheme');
      this.selectedTheme = storedTheme ? storedTheme : 'space';
      this.themeService.set(this.selectedTheme);
    }
  }

  newGame() {
    this.router.navigate(['/game', { gameLength: this.gameLength }]);
  }

  showOptions() {
    this.showOptionsPanel = true;
    this.showCreditsPanel = false;
    this.showHowToPlayPanel = false;
    this.showHighScoresPanel = false;
  }

  selectGameLength(length: number) {
    this.gameLength = length;
  }

  showCredits() {
    this.showOptionsPanel = false;
    this.showCreditsPanel = true;
    this.showHowToPlayPanel = false;
    this.showHighScoresPanel = false;
  }

  showHowToPlay() {
    this.showOptionsPanel = false;
    this.showCreditsPanel = false;
    this.showHowToPlayPanel = true;
    this.showHighScoresPanel = false;
  }

  showHighScores() {
    this.showOptionsPanel = false;
    this.showCreditsPanel = false;
    this.showHowToPlayPanel = false;
    this.showHighScoresPanel = true;
  }

  setTheme(theme: string) {
    this.selectedTheme = theme;
    this.themeService.set(theme);
    localStorage.setItem('selectedTheme', theme);
  }

  toggleTheme() {
    this.themeService.change();
  }
}
