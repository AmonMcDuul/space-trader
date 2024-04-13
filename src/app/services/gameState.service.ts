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
  fuel = signal(0);
  shield = signal(new Shield("", 0));
  weapon = signal(new Weapon("", 0));
  currentLocation = signal(new Location("", 0));
  inventory = signal<InventoryItem[]>([]);
  locations = signal<Location[]>([]);
  allMarketItems = signal<MarketItem[]>([]);
  marketItems = signal<MarketItem[]>([]);

  constructor(private router: Router) { }

    CreateGameState(gameLength: number = 30,
        daysPassed: number = 0,
        balance: number = 0,
        fuel: number = 30,
        shield: Shield,
        weapon: Weapon,
        locations: Location[] = [],
        allMarketItems: MarketItem[] = [],
        inventory: InventoryItem[] = [],
        currentLocation: Location){
            this.gameLength = gameLength;
            this.daysPassed.set(daysPassed);
            this.balance.set(balance);
            this.fuel.set(fuel);
            this.shield.set(shield);
            this.weapon.set(weapon);
            this.locations.set(locations);
            this.allMarketItems.set(allMarketItems);
            this.inventory.set(inventory);
            this.currentLocation.set(currentLocation);
            this.randomizeMarketItems();
            this.randomizePricesAndQuantities();
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

  Travel(location: Location) {
    if(this.usedFuel(this.currentLocation(), location)){
      this.currentLocation.update(l => location)
      console.log(`Traveling to ${location}`);
      this.NextDay();
    } else {
      console.log('Not enough fuel');
      alert('Not enough fuel');
    }
    
  }

  usedFuel(currentLocation: Location, newLocation: Location) {
    var difference = Math.abs(currentLocation.distance - newLocation.distance);
    if (difference === 0) {
          return true;
      }
    var spendFuel = difference * 3;
    if (difference === 1) {
        if (this.checkFuel(spendFuel)) {
            this.fuel.update(fuel => fuel - spendFuel);
            return true;
        } else {
            return false;
        }
    } else if (difference === 2) {
        if (this.checkFuel(spendFuel)) {
            this.fuel.update(fuel => fuel - spendFuel);
            return true;
        } else {
            return false;
        }
    } else if (difference === 3) {
        if (this.checkFuel(spendFuel)) {
            this.fuel.update(fuel => fuel - spendFuel);
            return true;
        } else {
            return false;
        }
    } else if (difference === 4) {
        if (this.checkFuel(spendFuel)) {
            this.fuel.update(fuel => fuel - spendFuel);
            return true;
        } else {
            return false;
        }
    } else if (difference === 5) {
        if (this.checkFuel(spendFuel)) {
            this.fuel.update(fuel => fuel - spendFuel);
            return true;
        } else {
            return false;
        }
    } else if (difference === 6) {
        if (this.checkFuel(spendFuel)) {
            this.fuel.update(fuel => fuel - spendFuel);
            return true;
        } else {
            return false;
        }
    } else if (difference === 7) {
        if (this.checkFuel(spendFuel)) {
            this.fuel.update(fuel => fuel - spendFuel);
            return true;
        } else {
            return false;
        }
    } return false;
}


  checkFuel(usedFuel: number){
    if(this.fuel() < usedFuel){
      return false;
    }
    return true;
  }

  Buy(item: { name: string; price: number }) {
    if (this.balance() >= item.price) {
        const marketItem = this.marketItems().find(i => i.name === item.name);
        if(marketItem && marketItem.quantity >= 1){
            const inventoryItem = this.inventory().find(i => i.name === item.name);
            this.balance.update(balance => balance - item.price);
            marketItem.quantity--;
            if (inventoryItem) {
                inventoryItem.quantity++;
            } else {
              if(item.name === "Fuel"){
                this.fuel.update(fuel => fuel + 1)
              } else{
                this.inventory.update(inventory => [...inventory, { name: item.name, price: item.price, quantity: 1 }]);
              }
            }
            console.log(`Bought ${item.name}`);
            } else {
            console.log('Not enough money');
            }
        }
    }

  Sell(item: { name: string; price: number }) {
    const inventoryItem = this.inventory().find(i => i.name === item.name);
    if(inventoryItem && inventoryItem.quantity >= 1){
      const marketItem = this.marketItems().find(i => i.name === item.name);
      this.balance.update(balance => balance + item.price);
      inventoryItem.quantity--;
      if (marketItem) {
          marketItem.quantity++;
      } else {
        this.marketItems.update(marketItems => [...marketItems, { name: item.name, price: item.price, quantity: 1 }]);
      }
      console.log(`Sold ${item.name}`);
    } else {
      console.log('No item to sell');
    }
  }

  randomizePricesAndQuantities() {
    var randomNumberPrijs = 1 + (0.35 * (Math.random() - 0.5));
    this.allMarketItems().forEach(element => {
        element.price = Math.round(element.price * randomNumberPrijs);
        element.quantity = Math.floor(Math.random() * 40) + 5;
    });
    this.inventory().forEach(element => {
        element.price = Math.round(element.price * randomNumberPrijs);
    })
  }

  randomizeMarketItems() {
    this.marketItems.update(marketItems => [])
    var fuelPrice = Math.round(3 * (1 + 1 * (Math.random() - 0.5)));
    var fuelQuantity = Math.floor(Math.random() * 95 + 5);
    this.marketItems.update(marketItems => [...marketItems, {name: "Fuel", price: fuelPrice, quantity: fuelQuantity}]);
      const allItems = this.allMarketItems();
      const numberOfItems = Math.floor(Math.random() * 5) + 5;
      var selectedMarketItems = allItems.filter(() => Math.random() < 0.5).slice(0, numberOfItems);
      selectedMarketItems.forEach(item => {
          this.marketItems.update(selectedMarketItems => [...selectedMarketItems, { name: item.name, price: item.price, quantity: item.quantity }]);
      });
  }
}