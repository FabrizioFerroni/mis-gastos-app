export interface ErrorResponse {
  messageException: string;
  message:          Message;
  path:             string;
  status_code:      number;
  timestamp:        Date;
}

export interface Message {
  message:    string;
  error:      string;
  statusCode: number;
}
