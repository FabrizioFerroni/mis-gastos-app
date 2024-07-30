import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { StyleClassModule } from 'primeng/styleclass';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),provideAnimations(), BrowserAnimationsModule, StyleClassModule]
};
