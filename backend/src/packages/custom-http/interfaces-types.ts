import http from "http";
export type Route = {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  handler: (req: CustomIncommingRequest, res: CustomServerResponse) => void;
};
export interface CustomServerResponse extends http.ServerResponse {
  res: http.ServerResponse;
  sendJson: (payload: any, statusCode?: number) => void;
}
export interface CustomIncommingRequest extends http.IncomingMessage {
  incomingPayload: any;
}
