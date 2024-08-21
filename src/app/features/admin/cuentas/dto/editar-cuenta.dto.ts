import { TipoCuenta } from '../utils/tipo-cuentas.enum';

export interface EditarCuentaDto {
  nombre?: string | null;
  saldo?: number | null;
  tipo?: TipoCuenta;
  moneda?: string | null;
  nro_cuenta?: string | null;
  icono?: string | null;
  descripcion?: string | null;
}
