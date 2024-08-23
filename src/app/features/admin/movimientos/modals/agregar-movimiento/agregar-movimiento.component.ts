import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { RippleModule } from 'primeng/ripple';
import { MovimientosService } from '../../service/movimientos.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { Cuenta } from '@app/features/admin/cuentas/dto/response/cuenta.response';
import { Categoria } from '@app/features/admin/categorias/response/categoria.response';
import { HttpErrorResponse } from '@angular/common/http';
import { Severity } from '@app/shared/utils/severity';
import { ApiResponse } from '@app/shared/response/api-response-ok';
import { catchError, EMPTY } from 'rxjs';
import { CrearMovimientoDto } from '../../dto/create-movimiento.dto';
import { CalendarModule } from 'primeng/calendar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CategoriasService } from '@app/features/admin/categorias/service/categorias.service';
import { Tipos } from '@app/shared/utils/tipos';
import { CuentaService } from '@app/features/admin/cuentas/service/cuenta.service';
import { CurrencyRegex, UUIDRegex } from '@app/shared/functions/regex.patterns';

@Component({
  selector: 'app-agregar-movimiento',
  standalone: true,
  imports: [
    DialogModule,
    ButtonModule,
    ReactiveFormsModule,
    CommonModule,
    RippleModule,
    InputNumberModule,
    DropdownModule,
    CalendarModule,
    RadioButtonModule,
  ],
  templateUrl: './agregar-movimiento.component.html',
  styleUrl: './agregar-movimiento.component.scss',
  providers: [MovimientosService, CategoriasService, CuentaService],
})
export class AgregarMovimientoComponent implements OnInit, OnChanges {
  @Input() visible = false;
  @Input() cuentas: Cuenta[] = [];
  @Input() categorias: Categoria[] = [];
  @Input() cuentasLength = 0;
  @Input() categoriasLength = 0;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() saved = new EventEmitter<boolean>();
  private readonly movimientosService = inject(MovimientosService);
  private readonly notificacionService = inject(NotificationService);
  private readonly categoriaService = inject(CategoriasService);
  private readonly cuentaService = inject(CuentaService);
  fb = inject(FormBuilder);
  loading = false;
  addMovementForm = this.fb.group({
    concepto: [null, [Validators.required, Validators.minLength(3)]],
    estado: [0],
    movimiento: [
      null,
      [
        Validators.required,
        Validators.pattern(CurrencyRegex),
        Validators.min(0.0),
      ],
    ],
    fecha: [null, [Validators.required]],
    tipo: [''],
    cuenta_id: ['', [Validators.required, Validators.pattern(UUIDRegex)]],
    categoria_id: ['', [Validators.required, Validators.pattern(UUIDRegex)]],
  });

  maxDate: Date | undefined;
  cuentasLengthInterno = 0;
  categoriasLengthInterno = 0;
  tipoEstado = false;
  showEstado = false;
  // TODO: Obetener moneda y localizacion del usuario a traves del perfil
  monedaSelect = 'EUR';
  localizacionSelect = 'es-AR';

  ngOnInit() {
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();
    const nextMonth = month === 11 ? 0 : month;
    const nextYear = nextMonth === 0 ? year : year;
    this.maxDate = new Date();
    this.maxDate.setMonth(nextMonth);
    this.maxDate.setFullYear(nextYear);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['categoriasLength']) {
      this.categoriasLengthInterno = changes['categoriasLength'].currentValue;
    }
    if (changes['cuentasLength']) {
      this.cuentasLengthInterno = changes['cuentasLength'].currentValue;
    }
  }

  onAddMovement(): void {
    if (this.addMovementForm.invalid) {
      this.notificacionService.showToast(
        Severity.WARNING,
        'Advertencia',
        'Todos los campos son obligatorios'
      );
      return;
    }

    this.loading = true;

    const body: CrearMovimientoDto = {
      concepto: this.conceptoField!.value!,
      estado: this.estadoField!.value!,
      fecha: this.fechaField!.value!
        ? new Date(this.fechaField!.value!)
        : new Date(),
      movimiento: +this.movimientoField!.value!,
      tipo: this.tipoField!.value!,
      cuenta_id: this.cuentaField!.value!,
      categoria_id: this.categoriaField!.value!,
    };

    this.movimientosService
      .createMovement(body)
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
        next: ({ status_code, data }: ApiResponse<string>) => {
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

  get conceptoField() {
    return this.addMovementForm.get('concepto');
  }

  get estadoField() {
    return this.addMovementForm.get('estado');
  }

  get movimientoField() {
    return this.addMovementForm.get('movimiento');
  }

  get fechaField() {
    return this.addMovementForm.get('fecha');
  }

  get tipoField() {
    return this.addMovementForm.get('tipo');
  }

  get cuentaField() {
    return this.addMovementForm.get('cuenta_id');
  }

  get categoriaField() {
    return this.addMovementForm.get('categoria_id');
  }

  selectTypeWithCategory() {
    if (this.categoriaField!.value !== null) {
      this.categoriaService.getCategory(this.categoriaField!.value).subscribe({
        next: ({ data: { tipo } }: ApiResponse<Categoria>) => {
          if (tipo) {
            this.tipoField!.setValue(tipo);
            this.showEstado = true;
            this.estadoField?.setValue(0);
            switch (tipo) {
              case Tipos.INGRESO: {
                this.tipoEstado = true;
                break;
              }
              case Tipos.EGRESO: {
                this.tipoEstado = false;
                break;
              }
            }
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error(error);
        },
      });
    }
  }

  selectTypeWithAccount() {
    if (this.cuentaField!.value !== null) {
      this.cuentaService.getAccount(this.cuentaField!.value).subscribe({
        next: ({ data: { moneda } }: ApiResponse<Cuenta>) => {
          if (moneda) {
            this.monedaSelect = moneda;
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error(error);
        },
      });
    }
  }

  onHide() {
    this.loading = false;
    this.monedaSelect = 'EUR';
    this.showEstado = false;
    this.addMovementForm.reset();
    this.visibleChange.emit(false);
  }
}
