import { Component, inject } from '@angular/core';
import { AutoFocusModule } from 'primeng/autofocus';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../services/auth.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ILogin } from '../interfaces/login.interface';
import { LoginResponse } from '../response/LoginResponse';
import { RippleModule } from 'primeng/ripple';
import { StrongPasswordRegx } from '@app/shared/functions/passwordLength';
import { Router, RouterLink } from '@angular/router';
import { NotificationService } from '@app/shared/services/notification.service';
import { catchError, EMPTY } from 'rxjs';
import { Severity } from '@app/shared/utils/severity';
import { TokenService } from '@app/shared/services/token.service';
import { RefreshToken } from '@app/shared/interfaces/refresh-token';
import { Rutas } from '@app/shared/utils/rutas';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ButtonModule,
    CheckboxModule,
    AutoFocusModule,
    PasswordModule,
    DividerModule,
    ReactiveFormsModule,
    CommonModule,
    RippleModule,
    RouterLink,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [AuthService],
})
export default class LoginComponent {
  fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notificacionService = inject(NotificationService);
  private readonly tokenService = inject(TokenService);

  rememberSelect = false;

  loading = false;
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(StrongPasswordRegx),
      ],
    ],
    remember: [false],
  });

  onLogin() {
    const body: ILogin = {
      email: this.emailField!.value!,
      password: this.passwordField!.value!,
    };

    this.loading = true;
    this.authService
      .login(body)
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
        next: ({
          status_code,
          data: { user, access_token, refresh_token },
        }: LoginResponse) => {
          if (status_code === 200) {
            this.loading = false;
            this.notificacionService.showToast(
              Severity.SUCCESS,
              'Exito',
              `${user.nombre} te has logueado correctamente!`
            );
          }

          const bodyRT: RefreshToken = {
            token: refresh_token,
          };

          if (this.rememberSelect) {
            this.tokenService.setLocalStorage(access_token);
          } else {
            this.tokenService.setSessionStorage(access_token);
          }

          this.tokenService.setCookieRefresh(bodyRT);

          this.router.navigate([Rutas.HOME]);
        },
      });
  }

  remember() {
    this.rememberSelect = this.rememberField ? true : false;
  }

  get emailField() {
    return this.loginForm.get('email');
  }

  get passwordField() {
    return this.loginForm.get('password');
  }

  get rememberField() {
    return this.loginForm.get('remember');
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
