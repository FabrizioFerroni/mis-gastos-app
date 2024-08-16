import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';

const THEME_KEY = 'theme';

@Injectable({
  providedIn: 'root',
})
export class CustomizationService {
  private readonly primengConfig = inject(PrimeNGConfig);
  private readonly document = inject(DOCUMENT);

  preferColorUser(): string {
    if (
      !(THEME_KEY in localStorage) &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      return 'dark';
    } else {
      return 'light';
    }
  }

  getTheme(): string {
    return localStorage.getItem(THEME_KEY) || '';
  }

  setTheme(theme: string): void {
    localStorage.setItem(THEME_KEY, theme);

    const currentActiveTheme = this.document.querySelector(
      '.active-theme'
    ) as HTMLLinkElement;

    if (currentActiveTheme) {
      currentActiveTheme.classList.remove('active-theme');
    }

    const themeEnlace = this.document.getElementById(theme) as HTMLLinkElement;

    if (themeEnlace) {
      themeEnlace.classList.add('active-theme');
    }

    const themeLink = this.document.getElementById(
      'app-theme'
    ) as HTMLLinkElement;

    if (themeLink) {
      themeLink.href = `${theme}.css`;
    }
  }
}
