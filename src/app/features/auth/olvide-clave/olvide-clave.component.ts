import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AutoFocusModule } from 'primeng/autofocus';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { RippleModule } from 'primeng/ripple';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { IForgotPassword } from '../interfaces/olvide-clave';
import { ApiResponse } from '@app/shared/response/api-response-ok';
import { catchError, EMPTY } from 'rxjs';
import { Severity } from '@app/shared/utils/severity';
import { DialogModule } from 'primeng/dialog';
import { Rutas } from '@app/shared/utils/rutas';

@Component({
  selector: 'app-olvide-clave',
  standalone: true,
  imports: [
    ButtonModule,
    AutoFocusModule,
    DividerModule,
    ReactiveFormsModule,
    CommonModule,
    RippleModule,
    RouterLink,
    DialogModule,
  ],
  templateUrl: './olvide-clave.component.html',
  styleUrl: './olvide-clave.component.scss',
  providers: [AuthService],
})
export default class OlvideClaveComponent {
  fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notificacionService = inject(NotificationService);
  loading = false;
  sendEmail = false;
  forgotForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  onForgot() {
    const body: IForgotPassword = {
      email: this.emailField!.value!,
    };

    this.loading = true;

    this.authService
      .forgot_password(body)
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
            this.sendEmail = true;
          }
        },
      });
  }

  goToLogin(): void {
    this.sendEmail = false;
    this.router.navigate([`/${Rutas.LOGIN}`]);
  }

  get emailField() {
    return this.forgotForm.get('email');
  }
}
