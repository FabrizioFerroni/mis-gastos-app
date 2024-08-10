import { ApiResponse } from '@app/shared/response/api-response-ok';

export interface UserProfile {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  active: boolean;
  avatar: string | null;
  pais: string | null;
  localizacion: string | null;
}

export type ProfileResponse = ApiResponse<UserProfile>;
