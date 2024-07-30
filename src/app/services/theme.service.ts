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
    document.documentElement.classList.remove(...this.themeNames.map(t => theme[t]));
    document.documentElement.classList.add(theme[themeName]);
    localStorage.setItem('selectedTheme', themeName); // Save theme to localStorage
  }

  change(nextTheme?: string): void {
    if (!nextTheme) {
      nextTheme = this.nextTheme();
    }
    this.set(nextTheme);
  }

  private nextTheme(): string {
    const currentIndex = this.themeNames.indexOf(this.activeTheme || 'light');
    const nextIndex = (currentIndex + 1) % this.themeNames.length;
    return this.themeNames[nextIndex];
  }

  get themeNames(): string[] {
    return Object.keys(theme);
  }
}
