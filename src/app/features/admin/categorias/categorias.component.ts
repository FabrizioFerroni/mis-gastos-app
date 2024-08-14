import { Component, OnInit } from '@angular/core';
import { BreadcrumbComponent } from '@app/shared/components/breadcrumb/breadcrumb.component';
import { DashboardNavbarComponent } from '@app/shared/components/navbar/dashboard-navbar/dashboard-navbar.component';
import { MenuItem } from 'primeng/api';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [DashboardNavbarComponent, BreadcrumbComponent, CardModule],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.scss',
})
export default class CategoriasComponent implements OnInit {
  categoria: MenuItem[] | undefined;

  ngOnInit(): void {
    this.categoria = [
      {
        label: 'Categoria',
      },
    ];

    // borrar
  }
}
