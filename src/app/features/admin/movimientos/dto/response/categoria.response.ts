import { Categoria } from '@app/features/admin/categorias/response/categoria.response';
import { ApiResponse } from '@app/shared/response/api-response-ok';

export interface CategoriaMovData {
  categorias: Categoria[];
}
export type CategoriaMovResponse = ApiResponse<CategoriaMovData>;
