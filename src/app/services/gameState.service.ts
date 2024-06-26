import { Injectable, computed } from '@angular/core';
import { signal } from '@angular/core';
import { InventoryItem } from '../models/inventoryItem';
import { MarketItem } from '../models/marketItem';
import { Location } from '../models/location';
import { Shield } from '../models/shield';
import { Weapon } from '../models/weapon';
import { Router } from '@angular/router';
import { SpecialDelivery } from '../models/specialDelivery';

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
  specialDelivery = signal(new SpecialDelivery("","",3));
  statusText = signal("");
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
    currentLocation: Location,
    statusText: string){
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
      this.specialDelivery = signal(new SpecialDelivery("","",3));
      this.statusText.set(statusText);
      this.randomizeMarketItems();
      this.createRandomSpecialDelivery(this.specialDelivery());
    }

  endGame() {
    if (this.daysPassed() >= this.gameLength) {
      alert("game ended, you scored: " + this.balance())
      this.router.navigate(['/']);
    }
  }

  nextDay() {
    this.daysPassed.update(days => days + 1);
    if(this.daysPassed() > this.gameLength){
        this.endGame();
    }
    this.statusText.set("");
    this.setStatusText(`You traveled to ${this.currentLocation().name}.\n`)
    this.randomizePricesAndQuantities();
    this.randomizeMarketItems();
    this.checkSpecialDelivery(this.specialDelivery());
  }

  travel(location: Location) {
    if(this.usedFuel(this.currentLocation(), location)){
      this.currentLocation.update(l => location)
      console.log(`Traveling to ${location.name}`);
      this.nextDay();
    } else {
      console.log('Not enough fuel');
      this.setStatusText(`You dont have enough fuel to travel to ${location.name}.\n`)
    }
    return this.marketItems, this.inventory;
  }

setStatusText(text: string){
  this.statusText.update(s => s + text);
}

  usedFuel(currentLocation: Location, newLocation: Location) {
    var difference = Math.abs(currentLocation.distance - newLocation.distance);
    if (difference === 0) {
          return true;
      }
    var spendFuel = difference * 1;
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
            marketItem.quantity--;
            if (inventoryItem) {
                inventoryItem.quantity++;
            } else {
              if(item.name === "Fuel"){
                if(this.fuel() >= 10){
                  console.log("You can't store any more fuel, it's just spilling away");
                  this.statusText.set("");
                  this.setStatusText("You can't store any more fuel, it's just spilling away\n")
                } else{
                  this.fuel.update(fuel => fuel + 1)
                  marketItem.quantity = marketItem.quantity;
                }
              } else{
                this.inventory.update(inventory => [...inventory, { name: item.name, price: item.price, quantity: 1 }]);
                this.inventory().sort((a, b) => {
                  return a.name.localeCompare(b.name);});
              }
            }
            this.balance.update(balance => balance - item.price);
            console.log(`Bought ${item.name}`);
            } 
    }else {
      console.log('Not enough money');
      this.statusText.set("");
      this.setStatusText(`You don't have enough money to buy ${item.name}.\n`);
    }
  }

  sell(item: { name: string; price: number }) {
    const inventoryItem = this.inventory().find(i => i.name === item.name);
    if(inventoryItem && inventoryItem.quantity >= 1){
      const marketItem = this.marketItems().find(i => i.name === item.name);
      inventoryItem.quantity--;
      if (marketItem) {
          marketItem.quantity++;
      } else {
        this.marketItems.update(marketItems => [...marketItems, { name: item.name, price: item.price, quantity: 1 }]);
      }
      this.balance.update(balance => balance + item.price);
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
    var fuelPrice = Math.round(75 * (1 + 1 * (Math.random() - 0.5)));
    var fuelQuantity = Math.floor(Math.random() *  10) * 10;
    if(fuelQuantity === 0){
      fuelQuantity = 10;
    }
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
    if(chanceFireSale >= 7){
      multiplier = Math.random() * (0.75 - 0.20) + 0.20; // Range: 20% to 75%
      var marketItem = this.allMarketItems()[randomNum];
      marketItem.price = Math.round(marketItem.price * multiplier);
      this.specialFireSale.set(marketItem.name)
      console.log(this.specialFireSale(), " IS ON FIRESALE!!!!")
      this.setStatusText(`${this.specialFireSale()} IS ON FIRESALE!!!!\n`)
      };
    
    if(chanceScarcity >= 7){
      multiplier = Math.random() * (5 - 1.7) + 1.7; // Range: 170% to 500%
      var marketItem = this.allMarketItems()[randomNum2];
      marketItem.price = Math.round(marketItem.price * multiplier);
      this.specialScarcity.set(marketItem.name)
      console.log(this.specialScarcity(), " IS SCARSE!!!!")
      this.setStatusText(`${this.specialScarcity()} IS SCARSE!!!!\n`)
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

  checkSpecialDelivery(previous: SpecialDelivery){
    if(previous.count === 0 && previous.name != "Pending.."){
      console.log("Failed to deliver special parcel. $500 fine.");
      this.setStatusText("SPS - Failed to deliver special parcel. \n You get a $500 fine.\n")
      this.balance.update(balance => balance - 500);
      this.createRandomSpecialDelivery(previous);
    }
    else if(previous.count === 0 && previous.name == "Pending.."){
      this.createRandomSpecialDelivery(previous);
    }
    else{
      previous.countDown();
      if(previous.name != "Pending.."){
        this.setStatusText(`SPS - You have ${this.specialDelivery().count} days left to deliver ${this.specialDelivery().name} to ${this.specialDelivery().destination}...\n`)
      }
      else{
        this.setStatusText(`SPS - No package to deliver.\n`)
      }
    }
  }

  createRandomSpecialDelivery(previous: SpecialDelivery) {
    const destinations: string[] = ['Sun station', 'Mercury refinery', 'Earth', 'Mars base', 'Asteroid belt colony', 'Saturn ring city', 'Neptune shipyard', 'Pluto ice mines'];
    const prices: number[] = [100, 150, 250, 350, 500, 550, 600, 650, 750, 850, 1000];
    
    let name: string;
    let destination: string;
    let price: number;

    do {
      const randomNumber = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
      name = `SPS-${randomNumber}`;
    } while (previous && previous.name === name);
    
    do {
      let num = Math.floor(Math.random() * destinations.length);
      destination = destinations[num];
    } while (previous && previous.destination === destination || destination === this.currentLocation().name);
    
    do {
      price = prices[Math.floor(Math.random() * prices.length)];
    } while (previous && previous.price === price);
    
    this.specialDelivery.update(sd => new SpecialDelivery(name, destination, price));
    this.setStatusText(`A new delivery is ready.\n Please deliver ${this.specialDelivery().name} to ${this.specialDelivery().destination}...\n`)

    return;
  }

  sellSpecialParcel(){
    this.setStatusText(`SPS - Good job delivering the ${this.specialDelivery().name} to ${this.specialDelivery().destination}.\n You have earned $${this.specialDelivery().price}...\n`)
    this.balance.update(balance => balance + this.specialDelivery().price);
    this.specialDelivery.update(s => new SpecialDelivery("Pending..", "Pending..", 0));
    this.specialDelivery().countDown();
  }
}