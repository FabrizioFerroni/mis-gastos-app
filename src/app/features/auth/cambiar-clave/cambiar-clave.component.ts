import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { JwtToken } from '@app/shared/interfaces/jwt';
import { JwtService } from '@app/shared/services/jwt.service';
import { AutoFocusModule } from 'primeng/autofocus';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AuthService } from '../services/auth.service';
import { StrongPasswordRegx } from '@app/shared/functions/passwordLength';
import { IChangePassword } from '../interfaces/cambiar-clave';
import { catchError, EMPTY } from 'rxjs';
import { Severity } from '@app/shared/utils/severity';
import { NotificationService } from '@app/shared/services/notification.service';
import { ApiResponse } from '@app/shared/response/api-response-ok';
import { DialogModule } from 'primeng/dialog';
import { Rutas } from '@app/shared/utils/rutas';

@Component({
  selector: 'app-cambiar-clave',
  standalone: true,
  imports: [
    ButtonModule,
    AutoFocusModule,
    PasswordModule,
    DividerModule,
    ReactiveFormsModule,
    CommonModule,
    DialogModule,
    RippleModule,
  ],
  templateUrl: './cambiar-clave.component.html',
  styleUrl: './cambiar-clave.component.scss',
  providers: [AuthService],
})
export default class CambiarClaveComponent implements OnInit {
  fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notificacionService = inject(NotificationService);
  private readonly routerUrl = inject(ActivatedRoute);
  private readonly jwtService = inject(JwtService);
  private token = '';
  private jwtToken: JwtToken = {
    email: '',
    id: '',
    iat: 0,
    exp: 0,
  };
  changePassword = false;
  loading = false;
  resetPasswordForm = this.fb.group({
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
  });

  ngOnInit(): void {
    this.routerUrl.params.subscribe({
      next: ({ token }: Params) => {
        this.token = token;
      },
      error: error => {
        console.error('Error:', error);
      },
    });

    this.jwtToken = this.jwtService.decodeToken(this.token);
  }

  onChangePassword() {
    const body: IChangePassword = {
      email: this.jwtToken!.email!,
      token: this.token,
      password: this.passwordField!.value!,
      confirm_password: this.confirmPasswordField!.value!,
    };

    this.loading = true;
    this.authService
      .change_password(body)
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
          if (status_code === 200) {
            this.loading = false;
            this.changePassword = true;
          }
        },
      });
  }

  goToLogin(): void {
    this.changePassword = false;
    this.router.navigate([`/${Rutas.LOGIN}`]);
  }

  get passwordField() {
    return this.resetPasswordForm.get('password');
  }

  get confirmPasswordField() {
    return this.resetPasswordForm.get('confirm_password');
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
