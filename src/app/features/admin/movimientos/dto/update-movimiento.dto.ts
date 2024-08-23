export interface EditarMovimientoDto {
  tipo?: string | null;
  estado?: number | null;
  fecha?: Date | null;
  concepto?: string | null;
  movimiento?: number | null;
  cuenta_id?: string | null;
  categoria_id?: string | null;
}
