import { Injectable, computed } from '@angular/core';
import { signal } from '@angular/core';
import { InventoryItem } from '../models/inventoryItem';
import { MarketItem } from '../models/marketItem';
import { Location } from '../models/location';
import { Shield } from '../models/shield';
import { Weapon } from '../models/weapon';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  gameLength: number = 30;
  daysPassed = signal(0);
  balance = signal(0);
  shield = signal(new Shield("", 0));
  weapon = signal(new Weapon("", 0));
  currentLocation = signal("");
  inventory = signal<InventoryItem[]>([]);
  locations = signal<Location[]>([]);
  allMarketItems = signal<MarketItem[]>([]);
  marketItems = computed(() => {
    const allItems = this.allMarketItems();
    const numberOfItems = Math.floor(Math.random() * 5) + 4;
    const selectedItems = [];
    for (let i = 0; i < numberOfItems; i++) {
      const index = Math.floor(Math.random() * allItems.length);
      selectedItems.push(allItems[index]);
      allItems.splice(index, 1);
    }
    return selectedItems;
  });

  constructor(private router: Router) { }

    CreateGameState(gameLength: number = 30,
        daysPassed: number = 0,
        balance: number = 0,
        shield: Shield,
        weapon: Weapon,
        locations: Location[] = [],
        allMarketItems: MarketItem[] = [],
        inventory: InventoryItem[] = [],
        currentLocation: string = ""){
            this.gameLength = gameLength;
            this.daysPassed.set(daysPassed);
            this.balance.set(balance);
            this.shield.set(shield);
            this.weapon.set(weapon);
            this.locations.set(locations);
            this.allMarketItems.set(allMarketItems);
            this.inventory.set(inventory);
            this.currentLocation.set(currentLocation);
    }

  EndGame() {
    if (this.daysPassed() >= this.gameLength) {
      console.log('Ended game');
      alert("game ended, you scored: " + this.balance())
      this.router.navigate(['/']);
    }
  }

  NextDay() {
    this.daysPassed.update(days => days + 1);
    this.randomizePricesAndQuantities();
    this.randomizeMarketItems();
    if(this.daysPassed() > this.gameLength){
        this.EndGame();
    }
  }

  Travel(location: string) {
    this.currentLocation.update(l => location)
    console.log(`Traveling to ${location}`);
    this.NextDay();
  }

  Buy(item: { name: string; price: number }) {
    if (this.balance() >= item.price) {
      this.balance.update(balance => balance - item.price);
      const inventoryItem = this.inventory().find(i => i.name === item.name);
      const marketItem = this.marketItems().find(i => i.name === item.name);
      if (inventoryItem && marketItem) {
        marketItem.quantity--;
        inventoryItem.quantity++;
      } else {
        this.inventory.update(inventory => [...inventory, { name: item.name, price: item.price, quantity: 1 }]);
      }
      console.log(`Bought ${item.name}`);
    } else {
      console.log('Not enough money');
    }
  }

  Sell(item: { name: string; price: number }) {
    const inventoryItem = this.inventory().find(i => i.name === item.name);
    if(inventoryItem && inventoryItem.quantity >= 1){
      const marketItem = this.marketItems().find(i => i.name === item.name);
      this.balance.update(balance => balance + item.price);
      if (marketItem) {
          marketItem.quantity++;
          inventoryItem.quantity--;
      } else {
        this.allMarketItems.update(allMarketItems => [...allMarketItems, { name: item.name, price: item.price, quantity: 1 }]);
      }
      console.log(`Sold ${item.name}`);
    } else {
      console.log('No item to sell');
    }
  }

  randomizePricesAndQuantities() {
    this.allMarketItems().forEach(element => {
        element.price = Math.round(element.price * (1 + (0.35 * (Math.random() - 0.5))));
        element.quantity = Math.floor(Math.random() * 96) + 5
    });
  }

  randomizeMarketItems() {
    this.marketItems = computed(() => {
      const allItems = this.allMarketItems();
      const numberOfItems = Math.floor(Math.random() * 5) + 6;
      return allItems.filter(() => Math.random() < 0.5).slice(0, numberOfItems);
    });
  }
}