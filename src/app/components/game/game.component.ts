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
  storyText: string = "Dear Special Parcel Service worker.\nBe sure to deliver the package before 3 days have passed.\n Failure to deliver will grant you a $200 fine. \n\nYou notice you are low on fuel..."
  
  constructor(private route: ActivatedRoute, public gameState: GameStateService){
    this.route.params.subscribe(params => {
      this.gameLength = params['gameLength']});
    this.gameState.CreateGameState(this.gameLength, seed.daysPassed, seed.balance, seed.fuel, seed.shield, seed.weapon, seed.locations, seed.marketItems, seed.inventory, seed.locations[0]);
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
    }, 30);
  }
  
  travel(location: Location) {
    this.gameState.travel(location);
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