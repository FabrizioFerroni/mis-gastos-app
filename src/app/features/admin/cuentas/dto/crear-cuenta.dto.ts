import { TipoCuenta } from '../utils/tipo-cuentas.enum';

export interface CrearCuentaDto {
  nombre: string;
  saldo: number;
  tipo: TipoCuenta;
  moneda?: string | null;
  nro_cuenta?: string | null;
  icono?: string | null;
  descripcion?: string | null;
}
