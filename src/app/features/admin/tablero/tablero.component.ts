import { Component, OnInit } from '@angular/core';
import { DashboardNavbarComponent } from '@app/shared/components/navbar/dashboard-navbar/dashboard-navbar.component';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-tablero',
  standalone: true,
  imports: [
    DashboardNavbarComponent,
    ButtonModule,
    ConfirmDialogModule,
    CardModule,
    BreadcrumbComponent,
  ],
  templateUrl: './tablero.component.html',
  styleUrl: './tablero.component.scss',
  providers: [ConfirmationService],
})
export default class TableroComponent implements OnInit {
  visible = false;
  tablero: MenuItem[] | undefined;

  ngOnInit(): void {
    this.tablero = [
      {
        label: 'Tablero',
      },
    ];
  }
}
