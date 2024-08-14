import {
  Component,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { Rutas } from '@app/shared/utils/rutas';
import { environment } from 'environments/environment';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { Sidebar, SidebarModule } from 'primeng/sidebar';
import { StyleClassModule } from 'primeng/styleclass';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    ButtonModule,
    SidebarModule,
    RippleModule,
    AvatarModule,
    RouterLink,
    RouterModule,
    AvatarModule,
    StyleClassModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  @Input() sidebarVisible = true;
  @ViewChild('sidebarRef') sidebarRef!: Sidebar;
  width = 0;
  closeOnEscape = true;
  // rutas
  readonly homeRoute = `/${Rutas.HOME}`;
  readonly tableroRoute = `/${Rutas.APP}/${Rutas.TABLERO}`;
  readonly categoriaRoute = `/${Rutas.APP}/${Rutas.CATEGORIAS}`;
  readonly cuentaRoute = `/${Rutas.APP}/${Rutas.CUENTAS}`;
  readonly movimientosRoute = `/${Rutas.APP}/${Rutas.MOVIMIENTOS}`;
  readonly reportesRoute = `/${Rutas.APP}/${Rutas.REPORTES}`;
  readonly title = environment.name;
  readonly version = environment.version;

  ngOnInit(): void {
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize(): void {
    this.width = window.innerWidth;
    this.sidebarVisible = this.width >= 768;
    if (this.width >= 768) {
      this.closeOnEscape = false;
    }
  }
}
