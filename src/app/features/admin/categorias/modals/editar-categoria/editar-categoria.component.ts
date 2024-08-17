import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ColorPickerModule } from 'primeng/colorpicker';
import { DialogModule } from 'primeng/dialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { CategoriasService } from '../../service/categorias.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { Severity } from '@app/shared/utils/severity';
import { ICategoria } from '../../dto/categoria.dto';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiResponse } from '@app/shared/response/api-response-ok';
import { catchError, EMPTY } from 'rxjs';
import { Categoria } from '../../response/categoria.response';

@Component({
  selector: 'app-editar-categoria',
  standalone: true,
  imports: [
    DialogModule,
    ButtonModule,
    ReactiveFormsModule,
    CommonModule,
    RippleModule,
    ColorPickerModule,
    RadioButtonModule,
  ],
  templateUrl: './editar-categoria.component.html',
  styleUrl: './editar-categoria.component.scss',
  providers: [CategoriasService],
})
export class EditarCategoriaComponent implements OnChanges {
  @Input() visible = false;
  @Input() id = '';
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() saved = new EventEmitter<boolean>();
  fb = inject(FormBuilder);
  private readonly notificacionService = inject(NotificationService);
  private readonly categoriaService = inject(CategoriasService);
  loading = false;
  editCategoryForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    descripcion: ['', [Validators.minLength(5)]],
    color: [''],
    icono: [null],
    tipo: ['', [Validators.required]],
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['id'] && changes['id'].currentValue) {
      this.getCategory(this.id);
    }
  }

  onEditCategory() {
    if (this.editCategoryForm.invalid) {
      this.notificacionService.showToast(
        Severity.WARNING,
        'Advertencia',
        'Todos los campos son obligatorios'
      );
      return;
    }
    this.loading = true;

    const body: ICategoria = {
      nombre: this.nombreField!.value!,
      descripcion: this.descripcionField?.value,
      color: this.colorField?.value,
      icono: this.iconoField?.value,
      tipo: this.tipoField!.value!,
    };

    this.categoriaService
      .updateCategory(this.id, body)
      .pipe(
        catchError(error => {
          switch (error.statusCode) {
            case 400:
              this.notificacionService.showToast(
                Severity.WARNING,
                'Atención!',
                error.message
              );
              break;
            case 404:
              this.notificacionService.showToast(
                Severity.ERROR,
                'Error!',
                error.message
              );
              break;
            default:
              this.notificacionService.showToast(
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
        next: ({ data, status_code }: ApiResponse<string>) => {
          if (status_code === 200) {
            this.loading = false;
            this.onHide();
            this.saved.emit(true);
            this.notificacionService.showToast(Severity.SUCCESS, 'Exito', data);
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error(error);
        },
      });
  }

  getCategory(id: string) {
    this.categoriaService.getCategory(id).subscribe({
      next: ({ status_code, data }: ApiResponse<Categoria>) => {
        if (status_code === 200) {
          this.editCategoryForm.patchValue(data);
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
      },
    });
  }

  get nombreField() {
    return this.editCategoryForm.get('nombre');
  }

  get descripcionField() {
    return this.editCategoryForm.get('descripcion') || null;
  }

  get colorField() {
    return this.editCategoryForm.get('color') || null;
  }

  get iconoField() {
    return this.editCategoryForm.get('icono') || null;
  }

  get tipoField() {
    return this.editCategoryForm.get('tipo');
  }

  onHide() {
    this.loading = false;
    this.visibleChange.emit(false);
  }
}
