import {
  CustomIncommingRequest,
  CustomServerResponse,
  Route,
} from "./interfaces-types";

export class SubRouter {
  routes: Array<Route>;

  constructor() {
    this.routes = [];
  }

  get(
    path: string,
    handler: (req: CustomIncommingRequest, res: CustomServerResponse) => void
  ) {
    this.routes.push({ path, method: "GET", handler });
  }

  post(
    path: string,
    handler: (req: CustomIncommingRequest, res: CustomServerResponse) => void
  ) {
    this.routes.push({ path, method: "POST", handler });
  }
}
