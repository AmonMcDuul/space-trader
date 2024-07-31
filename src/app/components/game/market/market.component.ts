import { Component, EventEmitter, Output } from '@angular/core';
import { GameStateService } from '../../../services/gameState.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-market',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './market.component.html',
  styleUrl: './market.component.scss',
})
export class MarketComponent {
  @Output() statusTextChange = new EventEmitter<string>();
  
  constructor(public gameState: GameStateService) { }

  buy(item: { name: string; price: number }) {
    this.gameState.buy(item);
    this.statusTextChange.emit(this.gameState.statusText());
  }

  sell(item: { name: string; price: number }) {
    this.gameState.sell(item);
    this.statusTextChange.emit(this.gameState.statusText());
  }

  deliverSpecialDelivery() {
    this.gameState.sellSpecialParcel();
    this.statusTextChange.emit(this.gameState.statusText());
  }
}