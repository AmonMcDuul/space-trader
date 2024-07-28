import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleHalfStroke } from '@fortawesome/free-solid-svg-icons';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  showOptionsPanel = false;
  showCreditsPanel = false;
  showHowToPlayPanel = false;
  gameLength = 30;
  gameLengthOptions = [15, 30, 60, 90];
  themeBool: boolean = false;
  faCircleHalfStroke = faCircleHalfStroke;

  constructor(private router: Router, protected themeService: ThemeService) {}
  
  ngOnInit(){
    if (typeof window !== 'undefined') {
      const storedThemeBool = localStorage.getItem('themeBool');
      this.themeBool = storedThemeBool ? JSON.parse(storedThemeBool) : false;
    }
    if(this.themeBool){
      this.themeService.set('light');
    }
    else{
      this.themeService.set('dark');
    }
  }

  newGame() {
    this.router.navigate(['/game', { gameLength: this.gameLength }]);
  }

  showOptions() {
    this.showOptionsPanel = true;
    this.showCreditsPanel = false;
    this.showHowToPlayPanel = false;
  }

  selectGameLength(length: number) {
    this.gameLength = length;
  }

  showCredits() {
    this.showOptionsPanel = false;
    this.showCreditsPanel = true;
    this.showHowToPlayPanel = false;
  }

  showHowToPlay() {
    this.showOptionsPanel = false;
    this.showCreditsPanel = false;
    this.showHowToPlayPanel = true;
  }

  setTheme(){
    this.themeBool = !this.themeBool;
    localStorage.setItem('themeBool', JSON.stringify(this.themeBool));
    this.themeService.change();
  }
}