import { ApiResponse } from '@app/shared/response/api-response-ok';

interface Data {
  access_token: string;
  refresh_token: string;
}

export type RefreshResponse = ApiResponse<Data>;
