import { Component, inject } from '@angular/core';
import { GameState } from '../models/gameState';
import { CommonModule } from '@angular/common';
import { seed } from '../seeder/seed';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  gameState = new GameState();

  constructor(){
    this.gameState = new GameState(seed.gameLength, seed.daysPassed, seed.balance, seed.shield, seed.weapon, seed.locations, seed.inventory, seed.marketItems, seed.currentLocation);
  }

  NextDay() {
    this.gameState.NextDay();
  }

  Travel(location: string) {
    this.gameState.Travel(location);
  }

  Buy(item: { name: string; price: number }) {
    this.gameState.Buy(item);
  }

  Sell(item: { name: string; price: number }) {
    this.gameState.Sell(item);
  }
}