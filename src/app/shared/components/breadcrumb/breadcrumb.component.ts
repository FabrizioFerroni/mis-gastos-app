import { Component, Input, OnInit } from '@angular/core';
import { Rutas } from '@app/shared/utils/rutas';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [BreadcrumbModule],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
})
export class BreadcrumbComponent implements OnInit {
  @Input() items: MenuItem[] | undefined;

  home: MenuItem | undefined;

  ngOnInit() {
    this.home = {
      icon: 'pi pi-home',
      routerLink: `/${Rutas.APP}/${Rutas.TABLERO}`,
    };
  }
}
