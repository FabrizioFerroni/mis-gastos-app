/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject, OnInit } from '@angular/core';
import { DashboardNavbarComponent } from '../../../shared/components/navbar/dashboard-navbar/dashboard-navbar.component';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AuthService } from '@app/features/auth/services/auth.service';
import { TokenService } from '@app/shared/services/token.service';
import { Storage } from '@app/shared/utils/storage';
import { TokenInfo } from '@app/shared/interfaces/token-info';
import { UserProfile } from '@app/features/auth/response/ProfileResponse';
import { NotificationService } from '@app/shared/services/notification.service';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { HttpErrorResponse } from '@angular/common/http';
import { CountriesProfile } from '@app/shared/interfaces/countries.profile';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Severity } from '@app/shared/utils/severity';
import { EditProfileDto } from './dto/edit.dto';
import { TooltipModule } from 'primeng/tooltip';
import { PasswordModule } from 'primeng/password';
import { StrongPasswordRegx } from '@app/shared/functions/passwordLength';

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    DashboardNavbarComponent,
    ButtonModule,
    ConfirmDialogModule,
    CardModule,
    BreadcrumbComponent,
    CommonModule,
    DropdownModule,
    PasswordModule,
    AutoCompleteModule,
    ReactiveFormsModule,
    TooltipModule,
  ],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss',
  providers: [AuthService],
})
export default class PerfilComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly tokenService = inject(TokenService);
  private readonly ns = inject(NotificationService);
  fb = inject(FormBuilder);
  user: UserProfile = {
    id: '',
    nombre: '',
    apellido: '',
    avatar: '',
    email: '',
    pais: '',
    localizacion: '',
    active: false,
  };
  readonly defaultImage =
    'https://res.cloudinary.com/fabrizio-dev/image/upload/v1671107994/fabrizio-dev/default_user_acmdr1.webp';
  countries: CountriesProfile[] = [];
  loadingCountries = false;
  selectedCountryAdvanced: any[] | undefined;
  selectedImage: string | null = null;
  isFocused = false;
  filteredCountries: any[] | undefined;
  selectedLocaleAdvanced: any[] | undefined;
  filteredLocale: any[] | undefined;
  loading = false;
  oldPasswordNotEmpty = false;
  file: File | undefined = undefined;
  editProfile = this.fb.group({
    avatar: [this.file],
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    apellido: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    oldPassword: ['', [Validators.pattern(StrongPasswordRegx)]],
    newPassword: ['', [Validators.pattern(StrongPasswordRegx)]],
    confirmPassword: ['', [Validators.pattern(StrongPasswordRegx)]],
    pais: ['', [Validators.minLength(2)]],
    localizacion: ['', [Validators.minLength(2)]],
  });

  ngOnInit(): void {
    this.getPerfil();
    this.getCountries();

    this.editProfile.controls.newPassword.disable();
    this.editProfile.controls.confirmPassword.disable();
  }

  onChangePassword(event: Event) {
    const { value } = event.target as HTMLInputElement;
    this.oldPasswordNotEmpty = value.length > 0;
    this.editProfile.controls.newPassword.enable();
    this.editProfile.controls.confirmPassword.enable();
    if (value.length === 0) {
      this.editProfile.get('newPassword')?.reset();
      this.editProfile.get('confirmPassword')?.reset();
    }
  }

  getCountries() {
    this.loadingCountries = true;
    this.authService.getCountriesProfile().subscribe({
      next: (res: CountriesProfile[]) => {
        this.countries = res;
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
      },
      complete: () => {
        this.loadingCountries = false;
      },
    });
  }

  filterCountry(event: AutoCompleteCompleteEvent) {
    const filtered: any[] = [];
    const query = event.query;

    for (let i = 0; i < (this.countries as any[]).length; i++) {
      const country = (this.countries as any[])[i];
      if (country.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(country);
      }
    }

    this.filteredCountries = filtered;
  }

  filterLocale(event: AutoCompleteCompleteEvent) {
    const filtered: any[] = [];
    const query = event.query;

    for (let i = 0; i < (this.countries as any[]).length; i++) {
      const country = (this.countries as any[])[i];
      if (country.locale.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(country);
      }
    }

    this.filteredLocale = filtered;
  }

  getPerfil(): void {
    const { source }: TokenInfo = this.tokenService.getTokenLogin();

    if (source === Storage.SESSION_STORAGE) {
      this.user = this.tokenService.getUserSS()!;
    } else if (source === Storage.LOCAL_STORAGE) {
      this.user = this.tokenService.getUserLS()!;
    }

    this.editProfile.patchValue({
      nombre: this.user.nombre,
      apellido: this.user.apellido,
      email: this.user.email,
      pais: this.user.pais,
      localizacion: this.user.localizacion,
    });
  }

  get nombreField() {
    return this.editProfile.get('nombre');
  }

  get apellidoField() {
    return this.editProfile.get('apellido');
  }

  get emailField() {
    return this.editProfile.get('email');
  }

  get paisField() {
    return this.editProfile.get('pais');
  }

  get localizacionField() {
    return this.editProfile.get('localizacion');
  }

  get oldPasswordField() {
    return this.editProfile.get('oldPassword');
  }

  get newPasswordField() {
    return this.editProfile.get('newPassword');
  }

  get confirmPasswordField() {
    return this.editProfile.get('confirmPassword');
  }

  onEditProfile() {
    if (this.editProfile.invalid) {
      this.ns.showToast(
        Severity.WARNING,
        'Advertencia',
        'Todos los campos son obligatorios'
      );
      return;
    }

    const localizacion = this.returnStringLocale(
      this.localizacionField!.value!
    );
    const pais = this.returnStringPais(this.paisField!.value!);

    const body: EditProfileDto = {
      nombre: this.nombreField?.value,
      apellido: this.apellidoField?.value,
      email: this.emailField?.value,
      pais,
      localizacion,
    };

    console.log(body);

    this.loading = false;
  }

  returnStringLocale(obj: CountriesProfile | string): string {
    return typeof obj === 'object' ? (obj as any).locale : obj;
  }

  returnStringPais(obj: CountriesProfile | string): string {
    return typeof obj === 'object' ? (obj as any).name : obj;
  }

  onFileSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files!.length > 0) {
      const file = target.files![0];

      // Previsualizar la imagen
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImage = reader.result as string; // Asignar la URL de la imagen seleccionada
      };
      reader.readAsDataURL(file);

      this.editProfile.get('avatar')!.setValue(file);

      this.isFocused = false;
    }
  }

  onFocus(): void {
    this.isFocused = true;
  }

  onBlur(): void {
    this.isFocused = false;
  }

  onImageKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const fileInput = document.querySelector(
        '#fileInput'
      ) as HTMLInputElement;
      fileInput?.click();
    }
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
