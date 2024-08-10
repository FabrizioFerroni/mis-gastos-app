import { ApiResponse } from '@app/shared/response/api-response-ok';
import { UserProfile } from './ProfileResponse';

interface Data {
  user: UserProfile;
  access_token: string;
  refresh_token: string;
}

export type LoginResponse = ApiResponse<Data>;
