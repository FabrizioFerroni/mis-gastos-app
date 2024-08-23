import { CommonModule, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es-AR';
import {
  Component,
  inject,
  LOCALE_ID,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { BreadcrumbComponent } from '@app/shared/components/breadcrumb/breadcrumb.component';
import { DashboardNavbarComponent } from '@app/shared/components/navbar/dashboard-navbar/dashboard-navbar.component';
import { Pagination } from '@app/shared/interfaces/pagination';
import { ApiResponse } from '@app/shared/response/api-response-ok';
import { NotificationService } from '@app/shared/services/notification.service';
import { Severity } from '@app/shared/utils/severity';
import { ConfirmationService, SortEvent } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { Table, TableModule } from 'primeng/table';
import { catchError, EMPTY, Subscription } from 'rxjs';
import { MovimientosService } from './service/movimientos.service';
import {
  Movimiento,
  MovimientoData,
  MovimientoExport,
} from './dto/response/movimiento.response';
import { Calendar, CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { Categoria } from '@app/features/admin/categorias/response/categoria.response';
import { Cuenta } from '../cuentas/dto/response/cuenta.response';
import { CategoriaMovResponse } from './dto/response/categoria.response';
import { CuentaMovResponse } from './dto/response/cuentas.response';
import { AgregarMovimientoComponent } from './modals/agregar-movimiento/agregar-movimiento.component';
import { TooltipModule } from 'primeng/tooltip';
import { EditarMovimientoComponent } from './modals/editar-movimiento/editar-movimiento.component';
import { getDate } from '@app/shared/utils/getDate';

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

registerLocaleData(localeEs, 'es');

@Component({
  selector: 'app-movimientos',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    DashboardNavbarComponent,
    CardModule,
    TableModule,
    ConfirmDialogModule,
    CommonModule,
    PaginatorModule,
    CalendarModule,
    FormsModule,
    TooltipModule,
    AgregarMovimientoComponent,
    EditarMovimientoComponent,
  ],
  templateUrl: './movimientos.component.html',
  styleUrl: './movimientos.component.scss',
  providers: [
    MovimientosService,
    ConfirmationService,
    { provide: LOCALE_ID, useValue: 'es' },
  ],
})
export default class MovimientosComponent implements OnInit, OnDestroy {
  private readonly movimientosService = inject(MovimientosService);
  private readonly notificationService = inject(NotificationService);
  private readonly confirmationService = inject(ConfirmationService);
  @ViewChild('dt') dt!: Table;
  movimientos!: Movimiento[];
  movimientoInicial: Movimiento[] = [];
  movimientoInicialExport: MovimientoExport[] = [];
  categorias: Categoria[] = [];
  cuentas: Cuenta[] = [];
  pagination!: Pagination;
  loading = true;
  searchValue: string | undefined;
  addNewMovement = false;
  editMovement = false;
  idMovement = '';
  isSorted: boolean | null = null;
  page = 1;
  limit = 10;
  first = 0;
  totalRecords = 0;
  pageOptions: number[] = [5, 10, 20, 30];
  pageLinkSize = 5;
  filtroFecha: Date | null = null;
  subAccounts: Subscription | undefined;
  subMovements: Subscription | undefined;
  subCategories: Subscription | undefined;
  cuentasLength = 0;
  categoriasLength = 0;
  nameExport = '';
  cols!: Column[];

  formatDate(date: Date): string {
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  ngOnInit(): void {
    Calendar.prototype.getDateFormat = () => 'dd/mm/yy';
    this.getMovements(this.page, this.limit);
    this.getAllCategories();
    this.getAllAccounts();
    this.nameExport = `movimientos_${getDate()}`;
    this.cols = [
      { field: 'concepto', header: 'Concepto' },
      { field: 'tipo', header: 'Tipo' },
      { field: 'movimiento', header: 'Movimiento' },
      { field: 'fecha', header: 'Fecha' },
      { field: 'categoria.nombre', header: 'Categoria' },
      { field: 'cuenta.nombre', header: 'Cuenta' },
    ];

    /* const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    }; */

    /* this.movimientoInicialExport = this.movimientoInicialExport.map(
      (mov: MovimientoExport) => {
        const date = new Date(mov.fecha);
        const fecha = date.toLocaleDateString(undefined, options);
        return {
          ...mov,
          fecha,
        };
      }
    ); */
  }
  /* prepareDataForExport(): Movimiento[] {
    return this.movimientoInicialExport.map((mov: Movimiento) => ({
      ...mov,
      fecha: this.formatDate(mov.fecha) // Formatea solo la fecha
    }));
  } */

  getAllCategories() {
    this.subCategories = this.movimientosService.getAllCategories().subscribe({
      next: ({ data: { categorias } }: CategoriaMovResponse) => {
        this.categorias = categorias;
        this.categoriasLength = categorias.length;
      },
      error: error => {
        console.error('Error:', error);
      },
    });
  }

  getAllAccounts() {
    this.subAccounts = this.movimientosService.getAllAccounts().subscribe({
      next: ({ data: { cuentas } }: CuentaMovResponse) => {
        this.cuentas = cuentas;
        this.cuentasLength = cuentas.length;
      },
      error: error => {
        console.error('Error:', error);
      },
    });
  }

  clear(table: Table) {
    table.clear();
    this.dt.reset();
    this.first = 0;
    this.isSorted = null;
    this.searchValue = '';
  }

  convertToMovimientoExport(movimientos: Movimiento[]): MovimientoExport[] {
    return movimientos.map(mov => ({
      ...mov,
      fecha: this.formatDate(mov.fecha),
    }));
  }

  getMovements(page: number, limit: number) {
    this.subMovements = this.movimientosService
      .getMovements(page, limit)
      .subscribe({
        next: ({ movimientos, meta }: MovimientoData) => {
          this.movimientos = movimientos || [];
          this.movimientoInicial = [...movimientos];
          this.movimientoInicialExport =
            this.convertToMovimientoExport(movimientos);
          this.pagination = meta;
          this.loading = false;
          this.totalRecords = meta.totalItems;
        },
        error: error => {
          console.error('Error:', error);
        },
      });
  }

  exportCSV(): void {
    /*  if (this.dt) {
      // Usa los datos formateados para exportar
      this.dt.value = this.movimientoInicialExport;
      this.dt.exportCSV({ allValues: true });
    } */
  }

  onModalVisibilityChange(isVisible: boolean) {
    if (isVisible) {
      this.first = 0;
      this.getMovements(this.page, this.limit);
    }
  }

  showModalEdit(id: string) {
    this.idMovement = id;
    this.editMovement = true;
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
    this.movimientosService
      .deleteMovement(id)
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
            this.getMovements(this.page, this.limit);
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
      this.movimientos = [...this.movimientoInicial];
      this.dt.reset();
    }
  }

  sortTableData(event: SortEvent) {
    if (event.field && event.data && event.data.length > 0) {
      const fieldParts = event.field.split('.');

      event.data.sort((data1, data2) => {
        const value1 = this.getNestedValue(data1, fieldParts);
        const value2 = this.getNestedValue(data2, fieldParts);

        let result = 0;

        if (value1 == null && value2 != null) {
          result = -1;
        } else if (value1 != null && value2 == null) {
          result = 1;
        } else if (value1 == null && value2 == null) {
          result = 0;
        } else {
          result = this.compareValues(value1, value2, event.field!);
        }

        return event.order! * result;
      });
    } else {
      console.error(
        "El campo de ordenación 'event.field' es undefined o los datos están vacíos"
      );
    }
  }

  compareValues(value1: unknown, value2: unknown, field: string): number {
    if (field.includes('fecha')) {
      const date1 = new Date(value1 as string);
      const date2 = new Date(value2 as string);

      if (!isNaN(date1.getTime()) && !isNaN(date2.getTime())) {
        return date1.getTime() - date2.getTime();
      }
    }

    if (typeof value1 === 'string' && typeof value2 === 'string') {
      const numValue1 = parseFloat(value1);
      const numValue2 = parseFloat(value2);

      if (!isNaN(numValue1) && !isNaN(numValue2)) {
        return numValue1 < numValue2 ? -1 : numValue1 > numValue2 ? 1 : 0;
      }

      return value1.localeCompare(value2);
    }

    if (typeof value1 === 'number' && typeof value2 === 'number') {
      return value1 < value2 ? -1 : value1 > value2 ? 1 : 0;
    }

    return 0;
  }

  getNestedValue<T>(obj: T, fieldParts: string[]): unknown {
    return fieldParts.reduce((value, key) => {
      if (value && typeof value === 'object' && key in value) {
        return (value as Record<string, unknown>)[key];
      }
      return null;
    }, obj as unknown);
  }

  onPageChange(event: PaginatorState) {
    this.first = event.first!;
    this.limit = event.rows!;
    this.page = this.first / this.limit + 1;
    this.loading = true;
    this.getMovements(this.page, this.limit);
  }

  ngOnDestroy(): void {
    this.subAccounts!.unsubscribe();
    this.subMovements!.unsubscribe();
    this.subCategories!.unsubscribe();
  }
}
