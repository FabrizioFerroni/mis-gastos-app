import { Cuenta } from '@app/features/admin/cuentas/dto/response/cuenta.response';
import { ApiResponse } from '@app/shared/response/api-response-ok';

export interface CuentaMovData {
  cuentas: Cuenta[];
}
export type CuentaMovResponse = ApiResponse<CuentaMovData>;
