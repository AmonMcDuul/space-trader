import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { GameComponent } from './components/game/game.component';
import { EndgameComponent } from './components/endgame/endgame.component';

export const routes: Routes = [  
    {
    path: '',
    component: HomeComponent,
    title: 'Home',
  },
  {
    path: 'game',
    component: GameComponent,
    title: 'Game',
  },
  { path: 'endgame', 
    component: EndgameComponent, 
    title: 'EndGame', 
  },
];