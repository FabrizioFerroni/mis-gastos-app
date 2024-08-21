import type { TipoCuenta } from '../utils/tipo-cuentas.enum';

export type TipoCuentaKeys = keyof typeof TipoCuenta;
export type TipoCuentaValues = (typeof TipoCuenta)[TipoCuentaKeys];
