import { Injectable, signal } from '@angular/core';
import { InventoryItem } from './inventoryItem';
import { MarketItem } from './marketItem';
import { Location } from './location';

export class GameState {
  gameLength = signal(0);
  daysPassed = signal(0);
  balance = signal(0);
  shield = signal(0);
  weapon = signal(0);
  currentLocation = signal("");
  inventory = signal<InventoryItem[]>([]);
  locations = signal<Location[]>([]);
  marketItems = signal<MarketItem[]>([]);

  constructor(
    gameLength: number = 0,
    daysPassed: number = 0,
    balance: number = 0,
    shield: number = 0,
    weapon: number = 0,
    locations: Location[] = [],
    marketItems: MarketItem[] = [],
    inventory: InventoryItem[] = [],
    currentLocation: string = ""
  ) {
    this.gameLength.set(gameLength);
    this.daysPassed.set(daysPassed);
    this.balance.set(balance);
    this.shield.set(shield);
    this.weapon.set(weapon);
    this.locations.set(locations);
    this.marketItems.set(marketItems);
    this.inventory.set(inventory);
    this.currentLocation.set(currentLocation);
  }

  EndGame() {
    if (this.daysPassed() >= this.gameLength()) {
      console.log('Ended game');
    }
  }

  NextDay() {
    this.daysPassed.update(days => days + 1);
    this.EndGame();
  }

  Travel(location: string) {
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
    const marketItem = this.marketItems().find(i => i.name === item.name);
    const inventoryItem = this.inventory().find(i => i.name === item.name);
    this.balance.update(balance => balance + item.price);
    if (inventoryItem && marketItem) {
      inventoryItem.quantity--;
      marketItem.quantity++;
    } else {
      this.marketItems.update(marketItems => [...marketItems, { name: item.name, price: item.price, quantity: 1 }]);
    }
    console.log(`Sold ${item.name}`);
  }
}