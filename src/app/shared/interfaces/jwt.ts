export interface JwtToken {
  id: string;
  email: string;
  exp: number;
  iat: number;
}
