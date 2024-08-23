export interface CrearMovimientoDto {
  tipo: string;
  estado: number;
  fecha: Date;
  concepto: string;
  movimiento: number;
  cuenta_id: string;
  categoria_id: string;
}
