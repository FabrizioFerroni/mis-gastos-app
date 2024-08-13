import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Rutas } from '@app/shared/utils/rutas';
import { environment } from '@env/environment';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { RippleModule } from 'primeng/ripple';

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
  ],
  templateUrl: './home-navbar.component.html',
  styleUrl: './home-navbar.component.scss',
})
export class HomeNavbarComponent implements OnInit {
  items: MenuItem[] | undefined;
  isLoggedIn = false;
  homeRoute = Rutas.HOME;
  rutaLogin = Rutas.LOGIN;
  titleSite = environment.name;
  ngOnInit() {
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        routerLink: '/',
      },
      {
        label: 'Features',
        icon: 'pi pi-star',
        routerLink: '/',
        fragment: 'features',
      },
      {
        label: 'Pricing',
        icon: 'pi pi-dollar',
        routerLink: '/',
        fragment: 'pricing',
      },
      {
        label: 'About',
        icon: 'pi pi-question-circle',
        routerLink: '/',
        fragment: 'about',
      },
      {
        label: 'Contact',
        icon: 'pi pi-envelope',
        routerLink: '/',
        fragment: 'contact',
      },
    ];
  }
}
