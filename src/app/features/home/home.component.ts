import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ProfileResponse, UserProfile } from '../auth/response/ProfileResponse';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export default class HomeComponent implements OnInit {
  authService = inject(AuthService);
  user: UserProfile = {
    id: '',
    nombre: '',
    apellido: '',
    email: '',
    active: false,
    avatar: null,
    pais: null,
    localizacion: null,
  };

  ngOnInit(): void {
    this.authService.profile().subscribe({
      next: ({ data }: ProfileResponse) => {
        this.user = data;
      },
      error: (error: HttpErrorResponse) => {
        console.error(error.message);
      },
    });
  }
}
