import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { seed } from '../../seeder/seed';
import { ActivatedRoute, Router } from '@angular/router';
import { GameStateService } from '../../services/gameState.service';
import { Location } from '../../models/location'
import { ThemeService } from '../../services/theme.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleHalfStroke } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'] // Corrected the attribute name to styleUrls
})
export class GameComponent implements AfterViewInit {
  gameLength: number = 30;
  tempText: string = "";
  busyTypeWriter: boolean = false;
  selectedTheme: string = 'light';
  themeBool: boolean = !localStorage.getItem('themeBool');
  faCircleHalfStroke = faCircleHalfStroke;

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

  buy(item: { name: string; price: number }) {
    this.gameState.buy(item);
    this.typeWriter(this.gameState.statusText());
  }

  sell(item: { name: string; price: number }) {
    this.gameState.sell(item);
    this.typeWriter(this.gameState.statusText());
  }

  deliverSpecialDelivery() {
    this.gameState.sellSpecialParcel();
    this.typeWriter(this.gameState.statusText());
  }

  restartGame() {
    this.gameState.CreateGameState(this.gameLength, seed.daysPassed, seed.balance, seed.fuel, seed.shield, seed.weapon, seed.locations, seed.marketItems, seed.inventory, seed.locations[2], seed.statusText);
    this.tempText = ""; 
    this.typeWriter(this.gameState.statusText());
  }

  quitGame() {
    this.router.navigate(['/']);
  }

  notYet() {
    alert('Not yet implemented')
  }

  waitADay() {
    this.gameState.travel(this.gameState.currentLocation());
    this.typeWriter(this.gameState.statusText());
  }

  toggleTheme() {
    this.themeService.change();
  }
}
