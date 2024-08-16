import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { cifrateData } from '../functions/cifrate-data';
import { BaseHttpService } from './base-http.service';
import { RefreshToken } from '../interfaces/refresh-token';
import { environment } from '@env/environment';
import { Rutas } from '../utils/rutas';
import { TokenInfo } from '../interfaces/token-info';
import { Storage } from '../utils/storage';
import { CryptoService } from './crypto.service';

const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refreshToken';

@Injectable({
  providedIn: 'root',
})
export class TokenService extends BaseHttpService {
  private tokenInfo: TokenInfo = { token: null, source: Storage.NONE };
  private readonly cookieService = inject(CookieService);
  private readonly router = inject(Router);
  private readonly cryptoService = inject(CryptoService);

  setLocalStorage(token: string): void {
    this.deleteLocalStorage();
    localStorage.setItem(TOKEN_KEY, token);
  }

  getLocalToken(): string {
    return localStorage.getItem(TOKEN_KEY)!;
  }

  deleteLocalStorage(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  setSessionStorage(token: string): void {
    this.deleteSessionStorage();
    sessionStorage.setItem(TOKEN_KEY, token);
  }

  getSessionToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY) || null;
  }

  deleteSessionStorage(): void {
    sessionStorage.removeItem(TOKEN_KEY);
  }

  setCookieRefresh(body: RefreshToken): void {
    const expires = new Date();
    expires.setHours(expires.getHours() + 24);
    // expires.setHours(expires.getHours() + 1);

    const tokenCifred = cifrateData(this.publicKey, body);

    const recifredToken = this.cryptoService.encryptToken(tokenCifred);

    const domain = window.location.hostname;
    const secure = environment.secureCookie;

    this.cookieService.set(
      REFRESH_TOKEN_KEY,
      recifredToken,
      expires,
      '/',
      domain,
      secure,
      'Strict'
    );
  }

  getCookieRefresh(): string | null {
    const tokenCookie = this.cookieService.get(REFRESH_TOKEN_KEY) || null;
    const tokenDecifred = this.cryptoService.decryptToken(tokenCookie!);
    return tokenDecifred;
  }

  deleteCookieRefresh(): void {
    this.cookieService.delete(REFRESH_TOKEN_KEY);
  }

  isLogged(): boolean {
    if (this.getSessionToken() || this.getLocalToken()) {
      return true;
    }
    return false;
  }

  getTokenLogin(): TokenInfo {
    const sessionToken = this.getSessionToken();
    const localToken = this.getLocalToken();

    if (sessionToken) {
      this.tokenInfo = { token: sessionToken, source: Storage.SESSION_STORAGE };
    } else if (localToken) {
      this.tokenInfo = { token: localToken, source: Storage.LOCAL_STORAGE };
    } else {
      this.tokenInfo = { token: null, source: Storage.NONE };
    }
    return this.tokenInfo;
  }

  logOut(): void {
    if (this.getSessionToken() && !this.getLocalToken()) {
      this.deleteSessionStorage();
    } else if (this.getLocalToken() && !this.getSessionToken()) {
      this.deleteLocalStorage();
    }

    this.deleteCookieRefresh();

    this.router.navigateByUrl(`/${Rutas.HOME}`);
  }
}
