import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { seed } from '../../seeder/seed';
import { ActivatedRoute, Router } from '@angular/router';
import { GameStateService } from '../../services/gameState.service';
import { Location } from '../../models/location'
import { ThemeService } from '../../services/theme.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleHalfStroke } from '@fortawesome/free-solid-svg-icons';
import { MarketComponent } from './market/market.component';
import { CasinoComponent } from "./casino/casino.component";
import { LoanSharkComponent } from './loan-shark/loan-shark.component';
import { InventoryItem } from '../../models/inventoryItem';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, MarketComponent, CasinoComponent, LoanSharkComponent],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'] 
})
export class GameComponent implements AfterViewInit {
  gameLength: number = 30;
  tempText: string = "";
  busyTypeWriter: boolean = false;
  selectedTheme: string = 'light';
  themeBool: boolean = !localStorage.getItem('themeBool');
  faCircleHalfStroke = faCircleHalfStroke;

  marketBool: boolean = true;
  casinoBool: boolean = false;
  loanBool: boolean = false;

  @ViewChild('statusContainer') statusContainer!: ElementRef;  
  
  constructor(private route: ActivatedRoute, private router: Router, public gameState: GameStateService, protected themeService: ThemeService) {
    this.route.params.subscribe(params => {
      this.gameLength = params['gameLength']
    });
    this.gameState.CreateGameState(this.gameLength, seed.daysPassed, seed.balance, seed.fuel, seed.shield, seed.weapon, seed.locations, seed.marketItems, seed.inventory, seed.locations[2], seed.statusText);
  }

  ngOnInit(){
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('selectedTheme');
      this.selectedTheme = storedTheme ? storedTheme : 'light';
      this.themeService.set(this.selectedTheme);
    }
  }

  ngAfterViewInit() {
    this.typeWriter(this.gameState.statusText());
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  typeWriter(text: string) {
    if (!this.busyTypeWriter) {
      this.busyTypeWriter = true;
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
          this.busyTypeWriter = false;
        }
      }, 10);
    }
  }

  scrollToBottom() {
    try {
      this.statusContainer.nativeElement.scrollTop = this.statusContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Scroll to bottom failed', err);
    }
  }

  travel(location: Location) {
    this.gameState.travel(location);
    this.typeWriter(this.gameState.statusText());
  }

  restartGame() {
    this.gameState.clearGameState();
    this.gameState.CreateGameState(this.gameLength, seed.daysPassed, seed.balance, seed.fuel, seed.shield, seed.weapon, seed.locations, seed.marketItems, [
      new InventoryItem('Raktajino', 5, 5),
      new InventoryItem('Space biscuits', 8, 3),
      new InventoryItem('Communications', 60, 1),
  ], seed.locations[2], seed.statusText);
    this.tempText = ""; 
    this.typeWriter(this.gameState.statusText());
  }

  quitGame() {
    this.gameState.clearGameState()
    this.router.navigate(['/']);
  }

  openMarket() {
    this.casinoBool = false;
    this.loanBool = false;
    this.marketBool = true;
  }

  openCasino() {
    this.loanBool = false;
    this.marketBool = false;
    this.casinoBool = true;
  }

  openLoanShark() {
    this.marketBool = false;
    this.casinoBool = false;
    this.loanBool = true;
  }

  waitADay() {
    this.gameState.travel(this.gameState.currentLocation());
    this.typeWriter(this.gameState.statusText());
  }

  toggleTheme() {
    this.themeService.change();
  }

  handleTypeWriter(text: string) {
    this.typeWriter(text);
  }
}
