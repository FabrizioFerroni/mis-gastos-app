import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NotificationService } from '@app/shared/services/notification.service';
import { AuthService } from '../services/auth.service';
import { JwtService } from '@app/shared/services/jwt.service';
import { RippleModule } from 'primeng/ripple';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { JwtToken } from '@app/shared/interfaces/jwt';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { IValidateUser } from '../interfaces/validate-user';
import { Rutas } from '@app/shared/utils/rutas';

@Component({
  selector: 'app-verify-account',
  standalone: true,
  imports: [
    ButtonModule,
    DividerModule,
    CommonModule,
    DialogModule,
    RippleModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './verify-account.component.html',
  styleUrl: './verify-account.component.scss',
  providers: [AuthService],
})
export default class VerifyAccountComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);
  notificacionService = inject(NotificationService);
  routerUrl = inject(ActivatedRoute);
  jwtService = inject(JwtService);

  private token = '';
  verify = false;
  isSuccess = false;
  private jwtToken: JwtToken = {
    email: '',
    id: '',
    iat: 0,
    exp: 0,
  };

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
    this.verifyAccount();
  }

  verifyAccount(): void {
    const body: IValidateUser = {
      token: this.token,
      email: this.jwtToken.email,
    };

    this.authService.verify(body).subscribe({
      next: () => {
        this.verify = true;
        this.isSuccess = true;
      },
      error: () => {
        this.verify = true;
        this.isSuccess = false;
      },
    });
  }

  goToLogin(): void {
    this.router.navigate([`/${Rutas.LOGIN}`]);
  }

  goToHome(): void {
    this.router.navigate([Rutas.HOME]);
  }
}
