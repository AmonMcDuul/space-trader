import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { HighScore } from '../../models/highscore';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-highscore',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './highscore.component.html',
  styleUrls: ['./highscore.component.scss']
})
export class HighscoreComponent implements OnInit {
  highScores: HighScore[] = [];
  filteredHighScores: HighScore[] = [];
  selectedTab: number = 0;
  tabs: number[] = [0, 1, 2, 3];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getHighScore().subscribe((data: HighScore[]) => {
      this.highScores = data;
      this.filterHighScores();
    }, error => {
      console.error('Error fetching high scores', error);
      this.highScores = this.getDummyHighScores();
      this.filterHighScores();
    });
  }

  getDummyHighScores(): HighScore[] {
    return [
      new HighScore('Player1', 1500, 1),
      new HighScore('Player2', 1450, 1),
      new HighScore('Player3', 1420, 0),
      new HighScore('Player4', 1380, 2),
      new HighScore('Player5', 1350, 1),
      new HighScore('Player6', 1300, 3),
      new HighScore('Player7', 1250, 3),
      new HighScore('Player8', 1200, 2),
      new HighScore('Player9', 1150, 1),
      new HighScore('Player10', 1100, 3),
    ];
  }

  selectTab(tabIndex: number): void {
    this.selectedTab = tabIndex;
    this.filterHighScores();
  }

  filterHighScores(): void {
    this.filteredHighScores = this.highScores.filter(highScore => highScore.gameTypeState === this.selectedTab);
  }

  getTabText(gametype: number): string {
    switch (gametype) {
      case 0: return '15 days';
      case 1: return '30 days';
      case 2: return '60 days';
      case 3: return '90 days';
      default: return 'Game Type';
    }
  }
}
