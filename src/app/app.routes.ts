import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { GameComponent } from './components/game/game.component';

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
];