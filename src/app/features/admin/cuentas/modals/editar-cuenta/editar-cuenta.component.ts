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
import { CuentaService } from '../../service/cuenta.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Countries } from '@app/shared/interfaces/countries';
import { TipoCuenta } from '../../utils/tipo-cuentas.enum';
import { HttpErrorResponse } from '@angular/common/http';
import { Severity } from '@app/shared/utils/severity';
import { ApiResponse } from '@app/shared/response/api-response-ok';
import { EditarCuentaDto } from '../../dto/editar-cuenta.dto';
import { catchError, EMPTY } from 'rxjs';
import { Cuenta } from '../../dto/response/cuenta.response';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { RippleModule } from 'primeng/ripple';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TipoCuentaKeys, TipoCuentaValues } from '../../types/tipo-cuenta.type';
import { TipoArrayItem } from '../../interface/tipo-cuenta.interface';

@Component({
  selector: 'app-editar-cuenta',
  standalone: true,
  imports: [
    DialogModule,
    ButtonModule,
    ReactiveFormsModule,
    CommonModule,
    RippleModule,
    InputNumberModule,
    DropdownModule,
  ],
  templateUrl: './editar-cuenta.component.html',
  styleUrl: './editar-cuenta.component.scss',
  providers: [CuentaService],
})
export class EditarCuentaComponent implements OnInit, OnChanges {
  @Input() visible = false;
  @Input() id = '';
  @Input() countries: Countries[] = [];
  @Input() loadingCountries = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() saved = new EventEmitter<boolean>();
  private readonly cuentaService = inject(CuentaService);
  private readonly notificacionService = inject(NotificationService);
  fb = inject(FormBuilder);
  loading = false;
  tiposArray: TipoArrayItem[] = [];
  editAccountForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    descripcion: ['', [Validators.minLength(5)]],
    saldo: [
      '',
      [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/)],
    ],
    moneda: ['', [Validators.required]],
    tipo: ['', [Validators.required]],
    nro_cuenta: ['', [Validators.minLength(3)]],
    icono: [''],
  });

  ngOnInit(): void {
    this.tiposArray = Object.entries(TipoCuenta).map(([key, value]) => ({
      label: value as TipoCuentaValues,
      value: key as TipoCuentaKeys,
    }));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['id'] && changes['id'].currentValue) {
      this.getAccount(this.id);
    }
  }

  onEditAccount(): void {
    if (this.editAccountForm.invalid) {
      this.notificacionService.showToast(
        Severity.WARNING,
        'Advertencia',
        'Todos los campos son obligatorios'
      );
      return;
    }

    this.loading = true;

    const body: EditarCuentaDto = {
      nombre: this.nombreField?.value,
      saldo: this.saldoField?.value ? Number(this.saldoField.value) : null,
      tipo: this.tipoField?.value as TipoCuenta | undefined,
      moneda: this.monedaField?.value,
      nro_cuenta: this.nroCuentaField?.value ? this.nroCuentaField.value : null,
      icono: this.iconoField?.value ? this.iconoField.value : null,
      descripcion: this.descripcionField?.value,
    };

    this.cuentaService
      .updateAccount(this.id, body)
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

  getAccount(id: string) {
    this.cuentaService.getAccount(id).subscribe({
      next: ({ status_code, data }: ApiResponse<Cuenta>) => {
        if (status_code === 200) {
          this.editAccountForm.patchValue({
            nombre: data.nombre,
            saldo: data.saldo,
            tipo: data.tipo,
            moneda: data.moneda,
            nro_cuenta: data.nroCuenta,
            icono: data.icono,
            descripcion: data.descripcion,
          });
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
      },
    });
  }

  get nombreField() {
    return this.editAccountForm.get('nombre');
  }

  get descripcionField() {
    return this.editAccountForm.get('descripcion');
  }

  get saldoField() {
    return this.editAccountForm.get('saldo');
  }

  get monedaField() {
    return this.editAccountForm.get('moneda');
  }

  get tipoField() {
    return this.editAccountForm.get('tipo');
  }

  get nroCuentaField() {
    return this.editAccountForm.get('nro_cuenta');
  }

  get iconoField() {
    return this.editAccountForm.get('icono');
  }

  onHide() {
    this.loading = false;
    this.visibleChange.emit(false);
  }
}
