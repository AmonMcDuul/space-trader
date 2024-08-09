import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-endgame-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './endgame-modal.component.html',
  styleUrl: './endgame-modal.component.scss'
})
export class EndgameModalComponent {
  @Input() score!: number;
  @Output() onClose = new EventEmitter<void>();

  username: string = '';

  constructor(private apiService: ApiService) {}

  submit() {
    if (this.username.length > 0 && this.username.length <= 10) {
      this.apiService.sendHighScore(this.score, this.username, 1).subscribe(
        response => {
          console.log('High score submitted successfully', response);
          this.close();
        },
        error => {
          console.error('Error submitting high score', error);
        }
      );
    } else {
      alert('Username must be between 1 and 10 characters.');
    }
  }

  close() {
    this.onClose.emit();
  }
}