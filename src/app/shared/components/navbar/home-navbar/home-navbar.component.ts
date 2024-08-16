import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TokenService } from '@app/shared/services/token.service';
import { Rutas } from '@app/shared/utils/rutas';
import { environment } from '@env/environment';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { RippleModule } from 'primeng/ripple';
import { ConfigThemeComponent } from '../../config-theme/config-theme.component';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-home-navbar',
  standalone: true,
  imports: [
    MenubarModule,
    BadgeModule,
    AvatarModule,
    InputTextModule,
    RippleModule,
    CommonModule,
    ButtonModule,
    RouterLink,
    TooltipModule,
    ConfigThemeComponent,
  ],
  templateUrl: './home-navbar.component.html',
  styleUrl: './home-navbar.component.scss',
})
export class HomeNavbarComponent implements OnInit {
  items: MenuItem[] | undefined;
  showConfigs = false;
  isLoggedIn = false;
  readonly homeRoute = Rutas.HOME;
  readonly rutaLogin = Rutas.LOGIN;
  readonly rutaTablero = `${Rutas.APP}/${Rutas.TABLERO}`;
  readonly titleSite = environment.name;
  private readonly tokenService = inject(TokenService);
  ngOnInit() {
    this.isLoggedIn = this.tokenService.isLogged();
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        routerLink: '/',
        command: () => {
          this.showConfigs = false;
        },
      },
      {
        label: 'Features',
        icon: 'pi pi-star',
        routerLink: '/',
        fragment: 'features',
        command: () => {
          this.showConfigs = false;
        },
      },
      {
        label: 'Pricing',
        icon: 'pi pi-dollar',
        routerLink: '/',
        fragment: 'pricing',
        command: () => {
          this.showConfigs = false;
        },
      },
      {
        label: 'About',
        icon: 'pi pi-question-circle',
        routerLink: '/',
        fragment: 'about',
        command: () => {
          this.showConfigs = false;
        },
      },
      {
        label: 'Contact',
        icon: 'pi pi-envelope',
        routerLink: '/',
        fragment: 'contact',
        command: () => {
          this.showConfigs = false;
        },
      },
    ];
  }
}
