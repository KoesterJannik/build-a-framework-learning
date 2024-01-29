import http from "http";
import {
  CustomIncommingRequest,
  CustomServerResponse,
  Route,
} from "./interfaces-types";

export class HttpHelper {
  public routes: Array<Route>;
  constructor() {
    this.routes = [];
  }
  get(
    path: string,
    handler: (req: CustomIncommingRequest, res: CustomServerResponse) => void
  ) {
    this.routes.push({ path, handler, method: "GET" });
  }
  put(
    path: string,
    handler: (req: CustomIncommingRequest, res: CustomServerResponse) => void
  ) {
    this.routes.push({ path, handler, method: "PUT" });
  }
  post(
    path: string,
    handler: (req: CustomIncommingRequest, res: CustomServerResponse) => void
  ) {
    this.routes.push({ path, handler, method: "POST" });
  }
  patch(
    path: string,
    handler: (req: CustomIncommingRequest, res: CustomServerResponse) => void
  ) {
    this.routes.push({ path, handler, method: "PATCH" });
  }
  delete(
    path: string,
    handler: (req: CustomIncommingRequest, res: CustomServerResponse) => void
  ) {
    this.routes.push({ path, handler, method: "DELETE" });
  }
  sendJson(res: CustomServerResponse, payload: any, statusCode: number) {
    res.setHeader("Content-Type", "application/json");
    res.writeHead(statusCode);
    res.end(JSON.stringify(payload));
  }
  decorateResponse(res: http.ServerResponse): CustomServerResponse {
    const customRes = res as CustomServerResponse;
    customRes.sendJson = (payload: any, statusCode: number = 200) =>
      this.sendJson(customRes, payload, statusCode);
    return customRes;
  }
  decorateRequest(req: http.IncomingMessage): CustomIncommingRequest {
    const customReq = req as CustomIncommingRequest;
    return customReq;
  }
  static async attachIncomingJsonPayload(
    req: http.IncomingMessage
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let body = "";
      req.on("data", (chunk) => (body += chunk));
      req.on("end", () => {
        if (body === "") {
          resolve(null); // Resolve with null if no data was provided
        } else {
          try {
            const parsedBody = JSON.parse(body);
            resolve(parsedBody);
          } catch (error) {
            reject(error);
          }
        }
      });
    });
  }
}

export class BaseServer extends HttpHelper {
  public server: http.Server;
  private middlewareStack: Array<Function>;

  private port: number;
  constructor(port: number) {
    super();
    this.server = http.createServer();
    this.middlewareStack = [];

    this.port = port;
    this.server.on("request", (req, res) =>
      this.handleRequest(this.decorateRequest(req), this.decorateResponse(res))
    );
  }
  async handleRequest(req: CustomIncommingRequest, res: CustomServerResponse) {
    try {
      const incomingData = await HttpHelper.attachIncomingJsonPayload(req);
      (req as any).incomingPayload = incomingData;

      let routeNotFound = true;
      let methodNotAllowed = false;
      // Iterate through registered routes and handle the request
      for (const route of this.routes) {
        if (req.url === route.path) {
          routeNotFound = false;
          // check if the method matches
          if (req.method !== route.method) {
            methodNotAllowed = true;
            // Handle 405 if the method doesn't match
            res.writeHead(405, { "Content-Type": "text/plain" });
            res.end("Method Not Allowed");
            return;
          }
          // Execute the route handler if the paths match
          route.handler(req, res);
          return;
        }
      }
      if (routeNotFound) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not Found");
      }
      if (methodNotAllowed) {
        res.writeHead(405, { "Content-Type": "text/plain" });
        res.end("Method Not Allowed");
      }
    } catch (error) {
      console.error("Error parsing incoming JSON:", error);

      // Handle the error, e.g., send an error response
      res.sendJson({ error: "Error parsing incoming JSON" }, 400);
    }
  }
  listenAndServe(cb?: () => void) {
    this.server.listen(this.port, cb);
  }

  joinSubRoutes(pathPrefix: string, routes: Array<Route>) {
    for (const route of routes) {
      const fullPath = pathPrefix + route.path;
      console.log("Registering route:", fullPath);
      route.path = fullPath;
      this.routes.push(route);
    }
  }
}
