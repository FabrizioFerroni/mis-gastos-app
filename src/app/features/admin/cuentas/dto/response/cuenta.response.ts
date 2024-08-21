import { Pagination } from '@app/shared/interfaces/pagination';
import { ApiResponse } from '@app/shared/response/api-response-ok';

export interface Data {
  cuentas: Cuenta[];
  meta: Pagination;
}

export interface Cuenta {
  id: string;
  nombre: string;
  descripcion: string;
  saldo: string;
  icono: null;
  moneda: string;
  tipo: string;
  nroCuenta: null | string;
}

export type CuentaResponse = ApiResponse<Data>;
