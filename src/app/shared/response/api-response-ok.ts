export interface ApiResponse<T> {
  message: string;
  data: T;
  status_code: number;
}
