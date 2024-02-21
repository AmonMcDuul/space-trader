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
  balance = 100;
  inventory = [
    { name: 'Raktajino', quantity: 5 },
    { name: 'Space biscuits', quantity: 3 },
    { name: 'Warp core', quantity: 1 }
  ];
  locations = ['Earth', 'Mars', 'Io', 'Sun station'];
  marketItems = [
    { name: 'Space biscuits', price: 5 },
    { name: 'Bolts', price: 10 },
    { name: 'Iron', price: 15 }
  ];

  travel(location: string) {
    console.log(`Traveling to ${location}`);
  }

  buy(item: { name: string; price: number }) {
    if (this.balance >= item.price) {
      this.balance -= item.price;
      const inventoryItem = this.inventory.find(i => i.name === item.name);
      if (inventoryItem) {
        inventoryItem.quantity++;
      } else {
        this.inventory.push({ name: item.name, quantity: 1 });
      }
      console.log(`Bought ${item.name}`);
    } else {
      console.log('Not enough money');
    }
  }
}