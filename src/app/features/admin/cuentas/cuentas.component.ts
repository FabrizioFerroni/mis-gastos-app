import { Component, inject, OnInit, ViewChild, LOCALE_ID } from '@angular/core';
import { BreadcrumbComponent } from '@app/shared/components/breadcrumb/breadcrumb.component';
import { DashboardNavbarComponent } from '@app/shared/components/navbar/dashboard-navbar/dashboard-navbar.component';
import { CardModule } from 'primeng/card';
import { CuentaService } from './service/cuenta.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { ConfirmationService, SortEvent } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { Cuenta, CuentaResponse } from './dto/response/cuenta.response';
import { Pagination } from '@app/shared/interfaces/pagination';
import { Severity } from '@app/shared/utils/severity';
import { ApiResponse } from '@app/shared/response/api-response-ok';
import { catchError, EMPTY } from 'rxjs';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { Sort } from '@app/shared/types/sort';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es-AR';
import { TipoCuenta } from './utils/tipo-cuentas.enum';
import { AgregarCuentaComponent } from './modals/agregar-cuenta/agregar-cuenta.component';
import { EditarCuentaComponent } from './modals/editar-cuenta/editar-cuenta.component';
import { Countries } from '@app/shared/interfaces/countries';
import { HttpErrorResponse } from '@angular/common/http';

registerLocaleData(localeEs, 'es');

@Component({
  selector: 'app-cuentas',
  standalone: true,
  imports: [
    DashboardNavbarComponent,
    BreadcrumbComponent,
    CardModule,
    TableModule,
    ConfirmDialogModule,
    CommonModule,
    PaginatorModule,
    InputTextModule,
    DropdownModule,
    ButtonModule,
    FormsModule,
    AgregarCuentaComponent,
    EditarCuentaComponent,
  ],
  templateUrl: './cuentas.component.html',
  styleUrl: './cuentas.component.scss',
  providers: [
    CuentaService,
    ConfirmationService,
    { provide: LOCALE_ID, useValue: 'es' },
  ],
})
export default class CuentasComponent implements OnInit {
  private readonly cuentaService = inject(CuentaService);
  private readonly notificationService = inject(NotificationService);
  private readonly confirmationService = inject(ConfirmationService);
  @ViewChild('dt') dt!: Table;
  cuentas!: Cuenta[];
  cuentaInicial: Cuenta[] = [];
  pagination!: Pagination;
  loading = true;
  searchValue: string | undefined;
  addNewAccount = false;
  editAccount = false;
  idAccount = '';
  isSorted: boolean | null = null;
  page = 1;
  limit = 10;
  first = 0;
  totalRecords = 0;
  pageOptions: number[] = [5, 10, 20, 30];
  pageLinkSize = 5;
  tipos: typeof TipoCuenta = TipoCuenta;
  loadingCountries = false;
  countries: Countries[] = [];

  ngOnInit(): void {
    this.getAccounts(this.page, this.limit);
    this.getCountries();
  }

  clear(table: Table) {
    table.clear();
    this.searchValue = '';
  }

  getAccounts(page: number, limit: number) {
    this.cuentaService.getAccounts(page, limit).subscribe({
      next: ({ data: { cuentas, meta } }: CuentaResponse) => {
        this.cuentas = cuentas || [];
        this.cuentaInicial = [...cuentas];
        this.pagination = meta;
        this.loading = false;
        this.totalRecords = meta.totalItems;
      },
      error: error => {
        console.error('Error:', error);
      },
    });
  }

  onModalVisibilityChange(isVisible: boolean) {
    if (isVisible) {
      this.first = 0;
      this.getAccounts(this.page, this.limit);
    }
  }

  showModalEdit(id: string) {
    this.idAccount = id;
    this.editAccount = true;
  }

  getCountries() {
    this.loadingCountries = true;
    this.cuentaService.getCountries().subscribe({
      next: (res: Countries[]) => {
        this.countries = res;
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
      },
      complete: () => {
        this.loadingCountries = false;
      },
    });
  }

  showDialog(id: string, event: Event): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger text-white',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.deleteCategory(id);
      },
    });
  }

  deleteCategory(id: string) {
    this.cuentaService
      .deleteAccount(id)
      .pipe(
        catchError(error => {
          switch (error.statusCode) {
            case 400:
              this.notificationService.showToast(
                Severity.WARNING,
                'Atención!',
                error.message
              );
              break;
            case 404:
              this.notificationService.showToast(
                Severity.ERROR,
                'Error!',
                error.message
              );
              break;
            default:
              this.notificationService.showToast(
                Severity.ERROR,
                'Error!',
                error.message
              );
              break;
          }
          this.loading = false;
          return EMPTY;
        })
      )
      .subscribe({
        next: ({ status_code, data }: ApiResponse<string>) => {
          if (status_code === 200) {
            this.notificationService.showToast(
              Severity.SUCCESS,
              'Exito!',
              data
            );
            this.first = 0;
            this.getAccounts(this.page, this.limit);
          }
        },
        error: error => {
          console.error('Error:', error);
        },
      });
  }

  customSort(event: SortEvent) {
    if (this.isSorted == null || this.isSorted === undefined) {
      this.isSorted = true;
      this.sortTableData(event);
    } else if (this.isSorted == true) {
      this.isSorted = false;
      this.sortTableData(event);
    } else if (this.isSorted == false) {
      this.isSorted = null;
      this.cuentas = [...this.cuentaInicial];
      this.dt.reset();
    }
  }

  sortTableData(event: SortEvent) {
    if (event.field && event.field in event.data![0]) {
      event.data!.sort((data1: Sort, data2: Sort) => {
        const value1 = data1[event.field as keyof Sort] as unknown;
        const value2 = data2[event.field as keyof Sort] as unknown;
        let result = 0;

        if (value1 == null && value2 != null) result = -1;
        else if (value1 != null && value2 == null) result = 1;
        else if (value1 == null && value2 == null) result = 0;
        else if (typeof value1 === 'string' && typeof value2 === 'string')
          result = (value1 as string).localeCompare(value2 as string);
        else
          result =
            (value1 as number) < (value2 as number)
              ? -1
              : (value1 as number) > (value2 as number)
                ? 1
                : 0;

        return event.order! * result;
      });
    } else {
      console.error("El campo de ordenación 'event.field' es undefined");
    }
  }

  onPageChange(event: PaginatorState) {
    this.first = event.first!;
    this.limit = event.rows!;
    this.page = this.first / this.limit + 1;
    this.loading = true;
    this.getAccounts(this.page, this.limit);
  }
}
