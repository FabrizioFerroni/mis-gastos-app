import { Injectable } from '@angular/core';
import { ApiResponse } from '@app/shared/response/api-response-ok';
import { BaseHttpService } from '@app/shared/services/base-http.service';
import { Observable } from 'rxjs';
import { Cuenta, CuentaResponse } from '../dto/response/cuenta.response';
import { CrearCuentaDto } from '../dto/crear-cuenta.dto';
import { EditarCuentaDto } from '../dto/editar-cuenta.dto';

@Injectable()
export class CuentaService extends BaseHttpService {
  getAccounts(page: number, limit: number): Observable<CuentaResponse> {
    return this.http.get<CuentaResponse>(
      `${this.apiUrl}/cuentas?page=${page}&limit=${limit}`
    );
  }

  getAccount(id: string): Observable<ApiResponse<Cuenta>> {
    return this.http.get<ApiResponse<Cuenta>>(`${this.apiUrl}/cuentas/${id}`);
  }

  createAccount(body: CrearCuentaDto): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.apiUrl}/cuentas`, body);
  }

  updateAccount(
    id: string,
    body: EditarCuentaDto
  ): Observable<ApiResponse<string>> {
    return this.http.put<ApiResponse<string>>(
      `${this.apiUrl}/cuentas/${id}`,
      body
    );
  }

  deleteAccount(id: string): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(
      `${this.apiUrl}/cuentas/${id}`
    );
  }
}
