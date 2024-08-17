import { Injectable } from '@angular/core';
import { BaseHttpService } from '@app/shared/services/base-http.service';
import { Observable } from 'rxjs';
import { Categoria, CategoriaResponse } from '../response/categoria.response';
import { ICategoria } from '../dto/categoria.dto';
import { ApiResponse } from '@app/shared/response/api-response-ok';

@Injectable()
export class CategoriasService extends BaseHttpService {
  getCategories(page?: number, limit?: number): Observable<CategoriaResponse> {
    return this.http.get<CategoriaResponse>(
      `${this.apiUrl}/categorias?page=${page}&limit=${limit}`
    );
  }

  getCategory(id: string): Observable<ApiResponse<Categoria>> {
    return this.http.get<ApiResponse<Categoria>>(
      `${this.apiUrl}/categorias/${id}`
    );
  }

  addCategory(body: ICategoria): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(
      `${this.apiUrl}/categorias`,
      body
    );
  }

  updateCategory(
    id: string,
    body: ICategoria
  ): Observable<ApiResponse<string>> {
    return this.http.put<ApiResponse<string>>(
      `${this.apiUrl}/categorias/${id}`,
      body
    );
  }

  deleteCategory(id: string): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(
      `${this.apiUrl}/categorias/${id}`
    );
  }
}
