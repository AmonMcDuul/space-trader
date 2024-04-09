import { Component, ElementRef, ViewChild } from '@angular/core';
import { GameState } from '../../models/gameState';
import { CommonModule } from '@angular/common';
import { seed } from '../../seeder/seed';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {
  gameState = new GameState();
  gameLength: number = 30;
  tempText: string = "";
  storyText: string = "Your spaceship is preparing for its journey to explore the wonders of space...\nYou have lots of goods to trade and should make big buck!\n\nYou notice you are low on fuel...\n..."
  
  constructor(private route: ActivatedRoute){
    this.route.params.subscribe(params => {
      this.gameLength = params['gameLength']});
    this.gameState = new GameState(this.gameLength, seed.daysPassed, seed.balance, seed.shield, seed.weapon, seed.locations, seed.inventory, seed.marketItems, seed.currentLocation);
  }


  ngAfterViewInit() {
    this.typeWriter(this.storyText);
  }

  typeWriter(text: string) {
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        this.tempText += text.charAt(index);
        if (text.charAt(index) === '\n') {
          this.tempText += '<br>';
        }
        index++;
      } else {
        clearInterval(interval);
      }
    }, 50);
  }
  
  NextDay() {
    this.gameState.NextDay();
  }

  Travel(location: string) {
    this.gameState.Travel(location);
    this.gameState.currentLocation.update(l => location)
  }

  Buy(item: { name: string; price: number }) {
    this.gameState.Buy(item);
  }

  Sell(item: { name: string; price: number }) {
    this.gameState.Sell(item);
  }
}
