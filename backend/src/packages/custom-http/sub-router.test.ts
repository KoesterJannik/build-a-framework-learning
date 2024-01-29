import { BaseServer } from "./initialization";
import supertest from "supertest";
import { SubRouter } from "./sub-router";

describe("SubRouter", () => {
  let server: BaseServer;
  let request: supertest.SuperTest<supertest.Test>;

  beforeAll(() => {
    server = new BaseServer(3000);

    const authRouter = new SubRouter();
    authRouter.get("/login", (req, res) => {
      res.sendJson({ message: "Login route" });
    });
    authRouter.post("/register", (req, res) => {
      res.sendJson({ message: "Register route" });
    });

    server.joinSubRoutes("/auth", authRouter.routes);

    server.listenAndServe();
    request = supertest.agent(server.server) as any;
  });

  afterAll(() => {
    server.server.close();
  });

  it("should respond to GET /auth/login", async () => {
    const response = await request.get("/auth/login");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Login route" });
  });

  it("should respond to POST /auth/register", async () => {
    const response = await request.post("/auth/register");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Register route" });
  });
});
