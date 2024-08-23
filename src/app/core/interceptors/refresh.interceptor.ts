import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { RefreshResponse } from '@app/features/auth/response/RefreshResponse';
import { AuthService } from '@app/features/auth/services/auth.service';
import { RefreshToken } from '@app/shared/interfaces/refresh-token';
import { TokenInfo } from '@app/shared/interfaces/token-info';
import { TokenService } from '@app/shared/services/token.service';
import { Storage } from '@app/shared/utils/storage';
import { catchError, switchMap, throwError } from 'rxjs';

export const refreshInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const authService = inject(AuthService);

  const { token, source }: TokenInfo = tokenService.getTokenLogin();

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        return authService.refreshToken().pipe(
          switchMap(
            ({ data: { access_token, refresh_token } }: RefreshResponse) => {
              const body: RefreshToken = {
                token: refresh_token,
              };

              if (source === Storage.SESSION_STORAGE) {
                tokenService.setSessionStorage(access_token);
              } else if (source === Storage.LOCAL_STORAGE) {
                tokenService.setLocalStorage(access_token);
              }

              tokenService.setCookieRefresh(body);

              const newAuthReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${access_token}`,
                },
              });

              return next(newAuthReq);
            }
          ),
          catchError(refreshErr => {
            const finalError = new Error(refreshErr);

            const { pathname } = window.location;

            tokenService.logOutRefresh(pathname);

            return throwError(() => finalError);
          })
        );
      } else {
        return throwError(() => err);
      }
    })
  );
};
