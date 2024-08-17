import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificationService } from '@app/shared/services/notification.service';
import { Severity } from '@app/shared/utils/severity';
import { ButtonModule } from 'primeng/button';
import { ColorPickerModule } from 'primeng/colorpicker';
import { DialogModule } from 'primeng/dialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { ICategoria } from '../../dto/categoria.dto';
import { CategoriasService } from '../../service/categorias.service';
import { ApiResponse } from '@app/shared/response/api-response-ok';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, EMPTY } from 'rxjs';

@Component({
  selector: 'app-agregar-categoria',
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
  templateUrl: './agregar-categoria.component.html',
  styleUrl: './agregar-categoria.component.scss',
  providers: [CategoriasService],
})
export class AgregarCategoriaComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() saved = new EventEmitter<boolean>();
  fb = inject(FormBuilder);
  private readonly notificacionService = inject(NotificationService);
  private readonly categoriaService = inject(CategoriasService);
  loading = false;
  addCategoryForm = this.fb.group({
    nombre: [null, [Validators.required, Validators.minLength(3)]],
    descripcion: [null, [Validators.minLength(5)]],
    color: [null],
    icono: [null],
    tipo: [null, [Validators.required]],
  });

  onAddCategory() {
    if (this.addCategoryForm.invalid) {
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
      .addCategory(body)
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
          if (status_code === 201) {
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

  get nombreField() {
    return this.addCategoryForm.get('nombre');
  }

  get descripcionField() {
    return this.addCategoryForm.get('descripcion') || null;
  }

  get colorField() {
    return this.addCategoryForm.get('color') || null;
  }

  get iconoField() {
    return this.addCategoryForm.get('icono') || null;
  }

  get tipoField() {
    return this.addCategoryForm.get('tipo');
  }

  onHide() {
    this.loading = false;
    this.addCategoryForm.reset();
    this.visibleChange.emit(false);
  }
}
