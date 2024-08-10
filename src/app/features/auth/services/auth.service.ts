import { inject, Injectable } from '@angular/core';
import { ILogin } from '../interfaces/login.interface';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { BaseHttpService } from '@app/shared/services/base-http.service';
import { LoginResponse } from '../response/LoginResponse';
import { cifrateData } from '@app/shared/functions/cifrate-data';
import { IRegister } from '../interfaces/register.interface';
import { ApiResponse } from '@app/shared/response/api-response-ok';
import { IForgotPassword } from '../interfaces/olvide-clave';
import { IChangePassword } from '../interfaces/cambiar-clave';
import { RefreshResponse } from '../response/RefreshResponse';
import { TokenService } from '@app/shared/services/token.service';
import { IValidateUser } from '../interfaces/validate-user';
import { ProfileResponse } from '../response/ProfileResponse';

@Injectable()
export class AuthService extends BaseHttpService {
  private readonly tokenService = inject(TokenService);

  login(body: ILogin): Observable<LoginResponse> {
    const userEncrypt = cifrateData(this.publicKey, body);
    const headers = new HttpHeaders().set('basic', userEncrypt);
    return this.http.post<LoginResponse>(
      `${this.authUrl}/iniciarsesion`,
      {},
      { headers }
    );
  }

  register(body: IRegister): Observable<ApiResponse<string>> {
    const userEncrypt = cifrateData(this.publicKey, body);
    const headers = new HttpHeaders().set('basic', userEncrypt);
    return this.http.post<ApiResponse<string>>(
      `${this.authUrl}/registrarse`,
      {},
      { headers }
    );
  }

  verify(body: IValidateUser): Observable<ApiResponse<string>> {
    const userEncrypt = cifrateData(this.publicKey, body);
    const headers = new HttpHeaders().set('basic', userEncrypt);
    return this.http.post<ApiResponse<string>>(
      `${this.authUrl}/verificar/${body.token}`,
      {},
      { headers }
    );
  }

  forgot_password(body: IForgotPassword): Observable<ApiResponse<string>> {
    const userEncrypt = cifrateData(this.publicKey, body);
    const headers = new HttpHeaders().set('basic', userEncrypt);
    return this.http.post<ApiResponse<string>>(
      `${this.authUrl}/olvide-clave`,
      {},
      { headers }
    );
  }

  change_password(body: IChangePassword): Observable<ApiResponse<string>> {
    const userEncrypt = cifrateData(this.publicKey, body);
    const headers = new HttpHeaders().set('basic', userEncrypt);
    return this.http.post<ApiResponse<string>>(
      `${this.authUrl}/cambiar-clave/${body.token}`,
      {},
      { headers }
    );
  }

  refreshToken(): Observable<RefreshResponse> {
    const token = this.tokenService.getCookieRefresh();
    const headers = new HttpHeaders().set('basic', token!);
    return this.http.post<RefreshResponse>(
      `${this.authUrl}/refresh`,
      {},
      { headers }
    );
  }

  profile(): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(`${this.authUrl}/profile`);
  }
}
