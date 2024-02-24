import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  gameLength = 30;
  daysPassed = 0;
  balance = 100;
  shield = 0;
  weapon = 0;
  inventory = [
    { name: 'Raktajino', price: 3, quantity: 5 },
    { name: 'Space biscuits', price: 7, quantity: 3 },
    { name: 'Warp core', price: 25, quantity: 1 }
  ];
  locations = ['Earth', 'Mars', 'Io', 'Sun station'];
  marketItems = [
    { name: 'Space biscuits', price: 5, quantity: 5 },
    { name: 'Bolts', price: 10, quantity: 5 },
    { name: 'Iron', price: 15, quantity: 5 }
  ];

  EndGame(){
    console.log('Ended game');
  }

  NextDay(){
    this.daysPassed++;
    if(this.daysPassed >= this.gameLength){
      this.EndGame();
    }
  }

  Travel(location: string) {
    console.log(`Traveling to ${location}`);
    this.NextDay();
  }

  Buy(item: { name: string; price: number }) {
    if (this.balance >= item.price) {
      this.balance -= item.price;
      const inventoryItem = this.inventory.find(i => i.name === item.name);
      const marketItem = this.marketItems.find(i => i.name === item.name);
      if (inventoryItem && marketItem) {
        marketItem.quantity--;
        inventoryItem.quantity++;
      } else {
        this.inventory.push({ name: item.name, price: item.price, quantity: 1 });
      }
      console.log(`Bought ${item.name}`);
    } else {
      console.log('Not enough money');
    }
  }

  Sell(item: { name: string; price: number }){
    const marketItem = this.marketItems.find(i => i.name === item.name);
    const inventoryItem = this.inventory.find(i => i.name === item.name);
    this.balance += item.price;
    if (inventoryItem && marketItem) {
      inventoryItem.quantity--;
      marketItem.quantity++;
    } else {
      this.marketItems.push({ name: item.name, price: item.price, quantity: 1 });
    }
    console.log(`Sold ${item.name}`);
  }
}