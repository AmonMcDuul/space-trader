import { Component, EventEmitter, Output } from '@angular/core';
import { GameStateService } from '../../../services/gameState.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-market',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './market.component.html',
  styleUrl: './market.component.scss',
})
export class MarketComponent {
  @Output() statusTextChange = new EventEmitter<string>();
  buyQuantity: number = 1;
  sellQuantity: number = 1;
  maxBuySelected: boolean = false;
  maxSellSelected: boolean = false;

  constructor(public gameState: GameStateService) { }

  buy(item: { name: string; price: number, quantity: number }) {
    if(this.maxBuySelected){
      this.buyQuantity = this.maxQuantity(item.price, item.quantity);
    }
    this.gameState.buy(item, this.buyQuantity);
    this.statusTextChange.emit(this.gameState.statusText());
  }

  sell(item: { name: string; price: number, quantity: number }) {
    if(this.maxSellSelected){
      this.sellQuantity = item.quantity;
    }
    this.gameState.sell(item, this.sellQuantity);
    this.statusTextChange.emit(this.gameState.statusText());
  }

  deliverSpecialDelivery() {
    this.gameState.sellSpecialParcel();
    this.statusTextChange.emit(this.gameState.statusText());
  }

  maxQuantity(price: number, quantity: number){
    let max = (this.gameState.balance() / price);
    if(max < quantity){
      return max;
    }
    return quantity;
  }

  setMaxSell(){
    this.maxSellSelected = !this.maxSellSelected;
  }

  setMaxBuy(){
    this.maxBuySelected = !this.maxBuySelected;
  }
}