import { Pagination } from '@app/shared/interfaces/pagination';
import { ApiResponse } from '@app/shared/response/api-response-ok';

export interface Data {
  categorias: Categoria[];
  meta: Pagination;
}

export interface Categoria {
  id: string;
  nombre: string;
  descripcion: string;
  color: string;
  icono: null;
  tipo: string;
}

export type CategoriaResponse = ApiResponse<Data>;
