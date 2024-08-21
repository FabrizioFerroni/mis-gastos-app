import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { CuentaService } from '../../service/cuenta.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { Severity } from '@app/shared/utils/severity';
import { CrearCuentaDto } from '../../dto/crear-cuenta.dto';
import { ApiResponse } from '@app/shared/response/api-response-ok';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, EMPTY } from 'rxjs';
import { InputNumberModule } from 'primeng/inputnumber';
import { TipoCuenta } from '../../utils/tipo-cuentas.enum';
import { DropdownModule } from 'primeng/dropdown';
import { Countries } from '@app/shared/interfaces/countries';
import { TipoArrayItem } from '../../interface/tipo-cuenta.interface';
import { TipoCuentaKeys, TipoCuentaValues } from '../../types/tipo-cuenta.type';

@Component({
  selector: 'app-agregar-cuenta',
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
  templateUrl: './agregar-cuenta.component.html',
  styleUrl: './agregar-cuenta.component.scss',
  providers: [CuentaService],
})
export class AgregarCuentaComponent implements OnInit {
  @Input() visible = false;
  @Input() countries: Countries[] = [];
  @Input() loadingCountries = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() saved = new EventEmitter<boolean>();
  private readonly cuentaService = inject(CuentaService);
  private readonly notificacionService = inject(NotificationService);
  fb = inject(FormBuilder);
  loading = false;
  tiposArray: TipoArrayItem[] = [];
  addAccountForm = this.fb.group({
    nombre: [null, [Validators.required, Validators.minLength(3)]],
    descripcion: [null, [Validators.minLength(5)]],
    saldo: [
      null,
      [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/)],
    ],
    moneda: [null, [Validators.required]],
    tipo: [null, [Validators.required]],
    nro_cuenta: [null, [Validators.minLength(3)]],
    icono: [null],
  });

  ngOnInit(): void {
    this.tiposArray = Object.entries(TipoCuenta).map(([key, value]) => ({
      label: value as TipoCuentaValues,
      value: key as TipoCuentaKeys,
    }));
  }

  onAddAccount(): void {
    if (this.addAccountForm.invalid) {
      this.notificacionService.showToast(
        Severity.WARNING,
        'Advertencia',
        'Todos los campos son obligatorios'
      );
      return;
    }

    this.loading = true;

    const body: CrearCuentaDto = {
      nombre: this.nombreField!.value!,
      saldo: this.saldoField!.value!,
      tipo: this.tipoField!.value!,
      moneda: this.monedaField?.value,
      nro_cuenta: this.nroCuentaField?.value,
      icono: this.iconoField?.value,
      descripcion: this.descripcionField?.value,
    };

    this.cuentaService
      .createAccount(body)
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

  get nombreField() {
    return this.addAccountForm.get('nombre');
  }

  get descripcionField() {
    return this.addAccountForm.get('descripcion');
  }

  get saldoField() {
    return this.addAccountForm.get('saldo');
  }

  get monedaField() {
    return this.addAccountForm.get('moneda');
  }

  get tipoField() {
    return this.addAccountForm.get('tipo');
  }

  get nroCuentaField() {
    return this.addAccountForm.get('nro_cuenta');
  }

  get iconoField() {
    return this.addAccountForm.get('icono');
  }

  onHide() {
    this.loading = false;
    this.addAccountForm.reset();
    this.visibleChange.emit(false);
  }
}
