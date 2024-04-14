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
  specialFireSale = signal("");
  specialScarcity = signal("");
  originalItems = [
    new MarketItem('Raktajino', 25, 0),
    new MarketItem('Space biscuits', 25, 0),
    new MarketItem('Warp core', 1000, 0),
    new MarketItem('Space fruit', 20, 0),
    new MarketItem('Bolts', 100, 0),
    new MarketItem('Iron', 150, 0),
    new MarketItem('Plasma torch', 200, 0),
    new MarketItem('Fuel rods', 50, 0),
    new MarketItem('Medical supplies', 300, 0),
    new MarketItem('Communications', 350, 0),
    new MarketItem('Life support system', 500, 0),
    new MarketItem('Navigation system', 200, 0),
    new MarketItem('Robot arm', 180, 0),
    new MarketItem('Solar panels', 120, 0),
    new MarketItem('Artificial gravity', 800, 0),
    new MarketItem('Hydroponics system', 400, 0),
  ]

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

  endGame() {
    if (this.daysPassed() >= this.gameLength) {
      console.log('Ended game');
      alert("game ended, you scored: " + this.balance())
      this.router.navigate(['/']);
    }
  }

  nextDay() {
    this.daysPassed.update(days => days + 1);
    this.randomizePricesAndQuantities();
    this.randomizeMarketItems();
    if(this.daysPassed() > this.gameLength){
        this.endGame();
    }
  }

  travel(location: Location) {
    if(this.usedFuel(this.currentLocation(), location)){
      this.currentLocation.update(l => location)
      console.log(`Traveling to ${location.name}`);
      this.nextDay();
    } else {
      console.log('Not enough fuel');
      alert('Not enough fuel');
    }
    return this.marketItems, this.inventory;
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

  buy(item: { name: string; price: number }) {
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
                this.inventory().sort((a, b) => {
                  return a.name.localeCompare(b.name);});
              }
            }
            console.log(`Bought ${item.name}`);
            } else {
            console.log('Not enough money');
            }
        }
    }

  sell(item: { name: string; price: number }) {
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
    this.setMarketItemPrices();
    this.allMarketItems().forEach(element => {
      var randomPrice = Math.round(element.price * (1 + (0.4 * Math.random() - 0.2)));
      if(randomPrice < 5){
        randomPrice = 5;
      }
        element.price = randomPrice;
        element.quantity = Math.floor(Math.random() * 40) + 5;
    });
    this.specialMarketItems();
    this.setInventoryPrices();
  }

  randomizeMarketItems() {
    this.marketItems.update(marketItems => [])
    var fuelPrice = Math.round(3 * (1 + 1 * (Math.random() - 0.5)));
    var fuelQuantity = Math.floor(Math.random() * 95 + 5);
    this.marketItems.update(marketItems => [...marketItems, {name: "Fuel", price: fuelPrice, quantity: fuelQuantity}]);
      const allItems = this.allMarketItems();
      const numberOfItems = Math.floor(Math.random() * 5) + 5;
      var selectedMarketItems = allItems.filter(() => Math.random() < 0.5).slice(0, numberOfItems);
      selectedMarketItems.sort((a, b) => {
        return a.name.localeCompare(b.name);});
      selectedMarketItems.forEach(item => {
          this.marketItems.update(selectedMarketItems => [...selectedMarketItems, { name: item.name, price: item.price, quantity: item.quantity }]);
      });
  }

  specialMarketItems() {
    if(this.daysPassed() < 1){
      return;
    }
    this.specialFireSale.set("");
    this.specialScarcity.set("");
    var chanceFireSale = Math.round(Math.random() * 20);
    var chanceScarcity = Math.round(Math.random() * 20);
    var multiplier;
    var randomNum = Math.floor(Math.random() * this.allMarketItems().length);
    var randomNum2;
    do {
      randomNum2 = Math.floor(Math.random() * this.allMarketItems().length);
    } while (randomNum === randomNum2);
    
    if(randomNum !== 0){
      randomNum--;
    }
    if(chanceFireSale >= 17){
      multiplier = Math.random() * (0.75 - 0.20) + 0.20; // Range: 20% to 75%
      var marketItem = this.allMarketItems()[randomNum];
      marketItem.price = Math.round(marketItem.price * multiplier);
      this.specialFireSale.set(marketItem.name)
      console.log(this.specialFireSale(), " IS ON FIRESALE!!!!")
      };
    
    if(chanceScarcity >= 17){
      multiplier = Math.random() * (5 - 1.7) + 1.7; // Range: 170% to 500%
      var marketItem = this.allMarketItems()[randomNum2];
      marketItem.price = Math.round(marketItem.price * multiplier);
      this.specialScarcity.set(marketItem.name)
      console.log(this.specialScarcity(), " IS SCARSE!!!!")
    }
  }

  setInventoryPrices(){
    this.inventory().forEach(inventoryItem => {
      var allMarketItems = this.allMarketItems().find(m => m.name == inventoryItem.name)
      if(allMarketItems){
        inventoryItem.price = allMarketItems.price;
      }
    })
  }

  setMarketItemPrices(){
    this.originalItems.forEach(origElement => {
      this.allMarketItems().forEach(element => {
        if(element.name === origElement.name){
          element.price = origElement.price;
        }
      });
    });
  }
}