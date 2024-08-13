import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AutoFocusModule } from 'primeng/autofocus';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AuthService } from '../services/auth.service';
import { StrongPasswordRegx } from '@app/shared/functions/passwordLength';
import { NotificationService } from '@app/shared/services/notification.service';
import { IRegister } from '../interfaces/register.interface';
import { DropdownModule } from 'primeng/dropdown';
import { Severity } from '@app/shared/utils/severity';
import { validarQueSeanIguales } from '@app/shared/functions/validate-password';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { catchError, EMPTY } from 'rxjs';
import { ApiResponse } from '@app/shared/response/api-response-ok';
import { Rutas } from '@app/shared/utils/rutas';
import { TerminosComponent } from '@app/shared/components/modals/terminos/terminos.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ButtonModule,
    DialogModule,
    AutoFocusModule,
    PasswordModule,
    DividerModule,
    ReactiveFormsModule,
    CommonModule,
    RippleModule,
    RouterLink,
    DropdownModule,
    InputSwitchModule,
    InputTextModule,
    RippleModule,
    TerminosComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  providers: [AuthService],
})
export default class RegisterComponent {
  fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notificacionService = inject(NotificationService);
  homeRoute = Rutas.HOME;
  loading = false;

  registerForm = this.fb.group(
    {
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      apellido: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(StrongPasswordRegx),
        ],
      ],
      confirm_password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(StrongPasswordRegx),
        ],
      ],
      terms: [false, Validators.requiredTrue],
    },
    { validators: validarQueSeanIguales() }
  );

  visible = false;
  userRegister = false;

  showDialog() {
    this.visible = true;
  }

  onRegister() {
    if (!this.termsField!.value) {
      this.notificacionService.showToast(
        Severity.WARNING,
        'Aviso',
        `Debes aceptar los términos y condiciones.`
      );
      return;
    }

    const body: IRegister = {
      nombre: this.nombreField!.value!,
      apellido: this.apellidoField!.value!,
      email: this.emailField!.value!,
      password: this.passwordField!.value!,
      confirm_password: this.confirmPasswordField!.value!,
    };

    this.loading = true;

    this.authService
      .register(body)
      .pipe(
        catchError(error => {
          switch (error.statusCode) {
            case 400:
              this.notificacionService.showToast(
                Severity.WARNING,
                'Atención!',
                'El email o contraseña no son válidos.'
              );
              break;
            case 404:
              this.notificacionService.showToast(
                Severity.ERROR,
                'Error!',
                'Usuario no encontrado o has superado el limite maximo de intentos, si es asi por favor prueba poner olvide clave para recuperar la cuenta.'
              );
              break;
            default:
              this.notificacionService.showToast(
                Severity.ERROR,
                'Error!',
                'Hubo un error inesperado. Intente nuevamente.'
              );
              break;
          }
          this.loading = false;
          return EMPTY;
        })
      )
      .subscribe({
        next: ({ status_code }: ApiResponse<string>) => {
          if (status_code === 201) {
            this.loading = false;
            this.userRegister = true;
          }
        },
      });
  }

  goToLogin(): void {
    this.userRegister = false;
    this.router.navigate([`/${Rutas.LOGIN}`]);
  }

  showDialogPoliticaCond() {
    this.visible = true;
  }

  hideDialogPoliticaCond() {
    this.visible = false;
  }

  get nombreField() {
    return this.registerForm.get('nombre');
  }

  get apellidoField() {
    return this.registerForm.get('apellido');
  }

  get emailField() {
    return this.registerForm.get('email');
  }

  get passwordField() {
    return this.registerForm.get('password');
  }

  get confirmPasswordField() {
    return this.registerForm.get('confirm_password');
  }

  get termsField() {
    return this.registerForm.get('terms');
  }

  isPasswordStrong(value: string): boolean {
    const hasUppercase = /[A-Z]/.test(value);
    const hasLowercase = /[a-z]/.test(value);
    const hasDigit = /\d/.test(value);
    const hasSpecialCharacter = /[!@#$%^&*]/.test(value);
    const hasMinimumLength = value.length >= 8;

    return (
      hasUppercase &&
      hasLowercase &&
      hasDigit &&
      hasSpecialCharacter &&
      hasMinimumLength
    );
  }
}
