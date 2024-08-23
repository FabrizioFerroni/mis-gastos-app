import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { UserProfile } from '@app/features/auth/response/ProfileResponse';
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
import { ConfigThemeComponent } from '../../../config-theme/config-theme.component';
import { TooltipModule } from 'primeng/tooltip';
import { TokenInfo } from '@app/shared/interfaces/token-info';
import { Storage } from '@app/shared/utils/storage';

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
    TooltipModule,
    ConfigThemeComponent,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  @Output() toggleSidebarEvent = new EventEmitter<void>();
  menuNavbar: MenuItem[] | undefined;
  menuProfile: MenuItem[] | undefined;
  notifications: MenuItem[] | undefined;
  showConfigs = false;
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
        label: 'Perfil',
        icon: 'pi pi-fw pi-user',
        routerLink: `/${Rutas.APP}/${Rutas.PROFILE}`,
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
    const { source }: TokenInfo = this.tokenService.getTokenLogin();

    if (source === Storage.SESSION_STORAGE) {
      const user = this.tokenService.getUserSS();
      this.user = user!;
    } else if (source === Storage.LOCAL_STORAGE) {
      const user = this.tokenService.getUserLS();
      this.user = user!;
    }
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
