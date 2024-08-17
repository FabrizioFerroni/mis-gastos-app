import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { BreadcrumbComponent } from '@app/shared/components/breadcrumb/breadcrumb.component';
import { DashboardNavbarComponent } from '@app/shared/components/navbar/dashboard-navbar/dashboard-navbar.component';
import { ConfirmationService, MenuItem, SortEvent } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { CategoriasService } from './service/categorias.service';
import { Categoria, CategoriaResponse } from './response/categoria.response';
import { Table } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { Pagination } from '@app/shared/interfaces/pagination';
import { FormsModule } from '@angular/forms';
import { ColorPickerModule } from 'primeng/colorpicker';
import { AgregarCategoriaComponent } from './modals/agregar-categoria/agregar-categoria.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { NotificationService } from '@app/shared/services/notification.service';
import { catchError, EMPTY } from 'rxjs';
import { Severity } from '@app/shared/utils/severity';
import { ApiResponse } from '@app/shared/response/api-response-ok';
import { EditarCategoriaComponent } from './modals/editar-categoria/editar-categoria.component';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { Sort } from '@app/shared/types/sort';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [
    DashboardNavbarComponent,
    BreadcrumbComponent,
    CardModule,
    TableModule,
    CommonModule,
    InputTextModule,
    TagModule,
    DropdownModule,
    MultiSelectModule,
    ProgressBarModule,
    ButtonModule,
    FormsModule,
    ColorPickerModule,
    AgregarCategoriaComponent,
    ConfirmDialogModule,
    EditarCategoriaComponent,
    PaginatorModule,
  ],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.scss',
  providers: [CategoriasService, ConfirmationService],
})
export default class CategoriasComponent implements OnInit {
  private readonly categoriaService = inject(CategoriasService);
  private readonly notificationService = inject(NotificationService);
  private readonly confirmationService = inject(ConfirmationService);
  @ViewChild('dt') dt!: Table;
  categoria: MenuItem[] | undefined;
  categorias!: Categoria[];
  initialValue: Categoria[] = [];
  pagination!: Pagination;
  loading = true;
  searchValue: string | undefined;
  addNewCategory = false;
  editCategory = false;
  idCategory = '';
  isSorted: boolean | null = null;
  page = 1;
  limit = 10;
  first = 0;
  totalRecords = 0;
  pageOptions: number[] = [5, 10, 20, 30];
  pageLinkSize = 5;

  ngOnInit(): void {
    this.categoria = [
      {
        label: 'Categorias',
      },
    ];

    this.getCategories(this.page, this.limit);
  }

  clear(table: Table) {
    table.clear();
    this.searchValue = '';
  }

  getCategories(page: number, limit: number) {
    this.categoriaService.getCategories(page, limit).subscribe({
      next: ({ data: { categorias, meta } }: CategoriaResponse) => {
        this.categorias = categorias || [];
        this.initialValue = [...categorias];
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
      this.getCategories(this.page, this.limit);
    }
  }

  showModalEdit(id: string) {
    this.idCategory = id;
    this.editCategory = true;
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
    this.categoriaService
      .deleteCategory(id)
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
            this.getCategories(this.page, this.limit);
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
      this.categorias = [...this.initialValue];
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
    const page = this.first / this.limit + 1;
    this.loading = true;
    this.getCategories(page, this.limit);
  }
}
