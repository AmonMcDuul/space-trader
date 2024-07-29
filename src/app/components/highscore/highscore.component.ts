import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { HighScore } from '../../models/highscore';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-highscore',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './highscore.component.html',
  styleUrl: './highscore.component.scss'
})
export class HighscoreComponent {
  highScores: HighScore[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getHighScore().subscribe((data: HighScore[]) => {
      this.highScores = data;
    }, error => {
      console.error('Error fetching high scores', error);
    });
  }
}
