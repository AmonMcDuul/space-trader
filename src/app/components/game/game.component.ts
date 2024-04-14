import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { seed } from '../../seeder/seed';
import { ActivatedRoute } from '@angular/router';
import { GameStateService } from '../../services/gameState.service';
import { Location } from '../../models/location'

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {
  gameLength: number = 30;
  tempText: string = "";
  
  constructor(private route: ActivatedRoute, public gameState: GameStateService){
    this.route.params.subscribe(params => {
      this.gameLength = params['gameLength']});
    this.gameState.CreateGameState(this.gameLength, seed.daysPassed, seed.balance, seed.fuel, seed.shield, seed.weapon, seed.locations, seed.marketItems, seed.inventory, seed.locations[0], seed.statusText);
  }

  ngAfterViewInit() {
    this.typeWriter(this.gameState.statusText());
  }

  typeWriter(text: string) {
    this.tempText = "";
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
    }, 10);
  }
  
  travel(location: Location) {
    this.gameState.statusText.set("");
    this.gameState.travel(location);
    this.typeWriter(this.gameState.statusText());
  }

  buy(item: { name: string; price: number }) {
    this.gameState.buy(item);
  }

  sell(item: { name: string; price: number }) {
    this.gameState.sell(item);
  }

  deliverSpecialDelivery(){
    this.gameState.sellSpecialParcel();
  }
}
