import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {
  BrowserAnimationsModule,
  provideAnimations,
} from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { StyleClassModule } from 'primeng/styleclass';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { errorHandlerInterceptor } from './core/interceptors/error-handler.interceptor';
import { refreshInterceptor } from './core/interceptors/refresh.interceptor';
import { AuthService } from './features/auth/services/auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideAnimations(),
    provideHttpClient(
      withInterceptors([errorHandlerInterceptor, refreshInterceptor])
    ),
    ReactiveFormsModule,
    BrowserAnimationsModule,
    StyleClassModule,
    MessageService,
    AuthService,
  ],
};
