import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { theme } from '../models/theme';

@Injectable({
  providedIn: 'root',
})

export class ThemeService {
  private activeThemeSubject = new BehaviorSubject<string | undefined>(
    undefined
  );
  activeTheme$ = this.activeThemeSubject.asObservable();

  get activeTheme(): string | undefined {
    return this.activeThemeSubject.getValue();
  }

  set(themeName: string): void {
    if (
      this.activeTheme === themeName ||
      !this.themeNames.includes(themeName)
    ) {
      return;
    }

    this.activeThemeSubject.next(themeName);
    document.documentElement.classList.remove(...Object.values(theme));
    document.documentElement.classList.add(theme[themeName]);
  }

  change(){
    if(this.activeTheme === 'light'){
      this.set('dark')
    }
    else{
      this.set('light')
    }
  }

  get themeNames(): string[] {
    return Object.keys(theme);
  }
}