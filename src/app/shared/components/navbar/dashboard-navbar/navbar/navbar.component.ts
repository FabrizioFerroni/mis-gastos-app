import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import {
  ProfileResponse,
  UserProfile,
} from '@app/features/auth/response/ProfileResponse';
import { AuthService } from '@app/features/auth/services/auth.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { TokenService } from '@app/shared/services/token.service';
import { Rutas } from '@app/shared/utils/rutas';
import { Severity } from '@app/shared/utils/severity';
import { environment } from '@env/environment';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { RippleModule } from 'primeng/ripple';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MenubarModule,
    AvatarModule,
    ButtonModule,
    TieredMenuModule,
    RippleModule,
    BadgeModule,
    SidebarComponent,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  @Output() toggleSidebarEvent = new EventEmitter<void>();
  menuNavbar: MenuItem[] | undefined;
  menuProfile: MenuItem[] | undefined;
  notifications: MenuItem[] | undefined;
  count = 4;
  user: UserProfile = {
    id: '',
    nombre: '',
    apellido: '',
    avatar: '',
    email: '',
    pais: '',
    localizacion: '',
    active: false,
  };
  readonly defaultImage =
    'https://res.cloudinary.com/fabrizio-dev/image/upload/v1671107994/fabrizio-dev/default_user_acmdr1.webp';
  readonly homeRoute = `/${Rutas.APP}/${Rutas.TABLERO}`;
  readonly titleSite = environment.name;
  private readonly tokenService = inject(TokenService);
  private readonly ns = inject(NotificationService);
  private readonly authService = inject(AuthService);

  ngOnInit() {
    this.getUserProfile();

    this.menuNavbar = [
      {
        icon: 'pi pi-bars',
      },
    ];

    this.menuProfile = [
      {
        label: 'Profile',
        icon: 'pi pi-fw pi-user',
      },
      {
        label: 'Inbox',
        icon: 'pi pi-fw pi-pencil',
      },
      {
        label: 'Settings',
        icon: 'pi pi-fw pi-cog',
      },
      {
        separator: true,
      },
      {
        label: 'Logout',
        icon: 'pi pi-fw pi-power-off',
        command: () => this.onLogout(),
      },
    ];

    this.notifications = [
      {
        label: 'Agregaste una nueva cuenta',
        icon: 'pi pi-fw pi-wallet',
      },
      {
        label: 'Agregaste un ingreso',
        icon: 'pi pi-fw pi-arrow-down-left',
      },
      {
        label: 'Agregaste un nuevo egreso',
        icon: 'pi pi-fw pi-arrow-up-right',
      },
      {
        label: 'Hiciste una transferencia a otra cuenta',
        icon: 'pi pi-fw pi-dollar',
      },
      {
        separator: true,
      },
      {
        label: 'Ver más',
        icon: 'pi pi-fw pi-plus',
        command: () => (this.count = 0),
      },
    ];
  }

  getUserProfile(): void {
    this.authService.profile().subscribe({
      next: ({ data }: ProfileResponse) => {
        this.user = data;
      },
      error: () => {
        this.ns.showToast(
          Severity.ERROR,
          'Error!',
          'No se pudo obtener el profile'
        );
      },
    });
  }

  toggleSidebar() {
    this.toggleSidebarEvent.emit();
  }

  onLogout(): void {
    this.ns.showToast(
      Severity.SUCCESS,
      'Éxito!',
      'Se ha cerrado la sesión con éxito. Esperamos volver a verte pronto'
    );
    this.tokenService.logOut();
  }
}
