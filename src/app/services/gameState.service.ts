import { Injectable, computed } from '@angular/core';
import { signal } from '@angular/core';
import { InventoryItem } from '../models/inventoryItem';
import { MarketItem } from '../models/marketItem';
import { Location } from '../models/location';
import { Shield } from '../models/shield';
import { Weapon } from '../models/weapon';
import { Router } from '@angular/router';
import { SpecialDelivery } from '../models/specialDelivery';
import { ApiService } from './api.service';
import { LoanShark } from '../models/loanShark';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  gameLength: number = 30;
  daysPassed = signal(0);
  balance = signal(0);
  loan = signal(0);
  interestRate = signal(0);
  chosenLoanShark = signal(new LoanShark("",0,0,false))
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
  specialPrint: string = "";
  
  showModal = false;
  gameScore = 0;

  constructor(private router: Router, private apiService: ApiService) {}

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
      this.randomizeMarketItems();
      this.createRandomSpecialDelivery(this.specialDelivery());
      this.statusText.set(statusText + this.specialPrint);
      this.specialPrint = "";
      this.loan.set(0)
      this.interestRate.set(0);
      this.chosenLoanShark.set(new LoanShark("",0,0,false))
    }


  endGame() {
    if (this.daysPassed() >= this.gameLength) {
      this.router.navigate(['/endgame']);
    }
  }

  nextDay() {
    this.daysPassed.update(days => days + 1);
    if(this.daysPassed() > this.gameLength){
        this.endGame();
    }
    this.updateLoanShark();
    this.randomizePricesAndQuantities();
    this.randomizeMarketItems();
    this.checkSpecialDelivery(this.specialDelivery());
    this.setStatusText(this.specialPrint);
    this.specialPrint = "";
  }

  travel(location: Location) {
    if(this.usedFuel(this.currentLocation(), location)){
      if(this.currentLocation().name == location.name){
        this.specialPrint = `\nYou have stayed on ${this.currentLocation().name}.\n`;
      }
      else{
        this.currentLocation.update(l => location)
        this.specialPrint = `\nYou traveled to ${this.currentLocation().name}.\n`;
      }
      this.nextDay();
    } else {
      this.setStatusText(`You dont have enough fuel to travel to ${location.name}.\n`)
    }
    return this.marketItems, this.inventory;
  }

  setStatusText(text: string){
    this.statusText.set("");
    this.statusText.update(s => s + text);
  }

  usedFuel(currentLocation: Location, newLocation: Location) {
    var difference = Math.abs(currentLocation.distance - newLocation.distance);
    if (difference === 0) {
          return true;
      }
    var spendFuel = difference;
        if (this.fuel() >= spendFuel) {
            this.fuel.update(fuel => fuel - spendFuel);
            return true;
        } else {
            return false;
        }
  }

  buy(item: { name: string; price: number }, quantity: number ) {
    if (this.balance() >= item.price * quantity) {
        const marketItem = this.marketItems().find(i => i.name === item.name);
        if(marketItem && marketItem.quantity >= 1){
          if(marketItem.quantity < quantity){
            this.setStatusText(`You can't buy ${quantity} of ${item.name}. The seller only has ${marketItem.quantity} of ${item.name}.\n`);
            return;
          }
          const inventoryItem = this.inventory().find(i => i.name === item.name);
          marketItem.quantity = marketItem.quantity - quantity;
          if (inventoryItem) {
              inventoryItem.quantity = inventoryItem.quantity + quantity;
          } else {
            if(item.name === "Fuel"){
              for(let i = 1; i <= quantity; i++){
                if(this.fuel() >= 10){
                  this.setStatusText(`You have bought ${i} amount of fuel.\n` + "You can't store any more fuel, it's just spilling away\n")
                  marketItem.quantity = marketItem.quantity + (quantity - i);
                  return;
                } else{
                  this.fuel.update(fuel => fuel + 1)
                  this.balance.update(balance => balance - (item.price));
                }
              }
              this.setStatusText(`You have bought ${quantity} of ${item.name}.\n`);
              return;
            } else{
              this.inventory.update(inventory => [...inventory, { name: item.name, price: item.price, quantity: quantity }]);
              this.inventory().sort((a, b) => {
                return a.name.localeCompare(b.name);});
            }
          }
          this.balance.update(balance => balance - (item.price * quantity));
          this.setStatusText(`You have bought ${quantity} of ${item.name}.\n`);
        } 
    } else {
      if(quantity == 1){
        this.setStatusText(`You don't have enough money to buy ${item.name}.\n`);
      } else {
        this.setStatusText(`You don't have enough money to buy ${quantity} of ${item.name}.\n`);
      }
    }
  }

  sell(item: { name: string; price: number }, quantity: number) {
    const inventoryItem = this.inventory().find(i => i.name === item.name);
    if(inventoryItem && inventoryItem.quantity >= 1){
      if(inventoryItem.quantity < quantity){
        this.setStatusText(`You can't sell ${quantity} of ${item.name}. You only have ${inventoryItem.quantity} of ${item.name}.\n`);
        return;
      }
      const marketItem = this.marketItems().find(i => i.name === item.name);
      inventoryItem.quantity = inventoryItem.quantity - quantity;
      if (marketItem) {
          marketItem.quantity = inventoryItem.quantity + quantity;
      } else {
        this.marketItems.update(marketItems => [...marketItems, { name: item.name, price: item.price, quantity: 1 }]);
      }
      this.balance.update(balance => balance + (item.price * quantity));
      this.setStatusText(`You have sold ${quantity} of ${item.name}.\n`);
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
      this.specialPrint += `${this.specialFireSale()} IS ON FIRESALE!!!!\n`
      };
    
    if(chanceScarcity >= 7){
      multiplier = Math.random() * (5 - 1.7) + 1.7; // Range: 170% to 500%
      var marketItem = this.allMarketItems()[randomNum2];
      marketItem.price = Math.round(marketItem.price * multiplier);
      this.specialScarcity.set(marketItem.name)
      this.specialPrint += `${this.specialScarcity()} IS SCARSE!!!!\n`
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
      this.specialPrint += "SPS - Failed to deliver special parcel. \n You get a $500 fine.\n"
      this.balance.update(balance => balance - 500);
      this.createRandomSpecialDelivery(previous);
    }
    else if(previous.count === 0 && previous.name == "Pending.."){
      this.createRandomSpecialDelivery(previous);
    }
    else{
      previous.countDown();
      if(previous.name != "Pending.."){
        this.specialPrint += `SPS - You have ${this.specialDelivery().count} days left to deliver ${this.specialDelivery().name} to ${this.specialDelivery().destination}...\n`
      }
      else{
        this.specialPrint += `SPS - No package to deliver.\n`
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
    this.specialPrint += `A new delivery is ready.\n Please deliver ${this.specialDelivery().name} to ${this.specialDelivery().destination}...\n`
    return;
  }

  sellSpecialParcel(){
    this.setStatusText(`SPS - Good job delivering the ${this.specialDelivery().name} to ${this.specialDelivery().destination}.\n You have earned $${this.specialDelivery().price}...\n`)
    this.balance.update(balance => balance + this.specialDelivery().price);
    this.specialDelivery.update(s => new SpecialDelivery("Pending..", "Pending..", 0));
    this.specialDelivery().countDown();
  }

  updateLoanShark(){
    if(this.loan() >= 0){
      this.loan.update(v => v + (v * this.interestRate()))
    }
  }

  clearGameState() {
    this.daysPassed.set(0);
    this.balance.set(0);
    this.loan.set(0);
    this.interestRate.set(0);
    this.chosenLoanShark.set(new LoanShark("", 0, 0, false));
    this.fuel.set(30);
    this.shield.set(new Shield("", 0));
    this.weapon.set(new Weapon("", 0));
    this.currentLocation.set(new Location("", 0));
    this.inventory.set([]);
    this.locations.set([]);
    this.allMarketItems.set([]);
    this.marketItems.set([]);
    this.specialFireSale.set("");
    this.specialScarcity.set("");
    this.specialDelivery.set(new SpecialDelivery("","",3));
    this.statusText.set("");
    this.specialPrint = "";
  }
}