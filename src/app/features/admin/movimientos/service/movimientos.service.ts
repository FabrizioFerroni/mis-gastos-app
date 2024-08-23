import { Injectable } from '@angular/core';
import { BaseHttpService } from '@app/shared/services/base-http.service';
import { map, Observable } from 'rxjs';
import {
  Movimiento,
  MovimientoData,
  MovimientoResponse,
} from '../dto/response/movimiento.response';
import { ApiResponse } from '@app/shared/response/api-response-ok';
import { CrearMovimientoDto } from '../dto/create-movimiento.dto';
import { EditarMovimientoDto } from '../dto/update-movimiento.dto';
import { CategoriaMovResponse } from '../dto/response/categoria.response';
import { CuentaMovResponse } from '../dto/response/cuentas.response';

@Injectable()
export class MovimientosService extends BaseHttpService {
  getMovements(page: number, limit: number): Observable<MovimientoData> {
    return this.http
      .get<MovimientoResponse>(
        `${this.apiUrl}/movimientos?page=${page}&limit=${limit}`
      )
      .pipe(
        map(({ data: { movimientos, meta } }: MovimientoResponse) => {
          const movimientosResp = movimientos.map((movimiento: Movimiento) => ({
            ...movimiento,
            fecha: new Date(movimiento.fecha),
          }));

          return {
            movimientos: movimientosResp,
            meta: meta,
          };
        })
      );
  }

  getAllAccounts(): Observable<CuentaMovResponse> {
    return this.http.get<CuentaMovResponse>(`${this.apiUrl}/cuentas/listar`);
  }

  getAllCategories(): Observable<CategoriaMovResponse> {
    return this.http.get<CategoriaMovResponse>(
      `${this.apiUrl}/categorias/listar`
    );
  }

  getMovement(id: string): Observable<ApiResponse<Movimiento>> {
    return this.http.get<ApiResponse<Movimiento>>(
      `${this.apiUrl}/movimientos/${id}`
    );
  }

  createMovement(body: CrearMovimientoDto): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(
      `${this.apiUrl}/movimientos`,
      body
    );
  }

  updateMovement(
    id: string,
    body: EditarMovimientoDto
  ): Observable<ApiResponse<string>> {
    return this.http.put<ApiResponse<string>>(
      `${this.apiUrl}/movimientos/${id}`,
      body
    );
  }

  deleteMovement(id: string): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(
      `${this.apiUrl}/movimientos/${id}`
    );
  }
}
