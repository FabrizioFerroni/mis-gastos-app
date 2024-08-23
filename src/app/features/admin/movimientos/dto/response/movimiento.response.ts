import { Cuenta } from '../../../cuentas/dto/response/cuenta.response';
import { Categoria } from '../../../categorias/response/categoria.response';
import { UserProfile } from '../../../../auth/response/ProfileResponse';
import { Pagination } from '@app/shared/interfaces/pagination';
import { ApiResponse } from '@app/shared/response/api-response-ok';

export interface MovimientoData {
  movimientos: Movimiento[];
  meta: Pagination;
}

export interface Movimiento {
  id: string;
  tipo: string;
  estado: number;
  fecha: Date;
  concepto: string;
  movimiento: string;
  cuenta: Cuenta;
  categoria: Categoria;
  usuario: UserProfile;
}

export interface MovimientoExport {
  id: string;
  tipo: string;
  estado: number;
  fecha: string;
  concepto: string;
  movimiento: string;
  cuenta: Cuenta;
  categoria: Categoria;
  usuario: UserProfile;
}

export type MovimientoResponse = ApiResponse<MovimientoData>;
