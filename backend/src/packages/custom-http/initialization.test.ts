import { BaseServer } from "./initialization";
import supertest from "supertest";

describe("BaseServer", () => {
  let server: BaseServer;
  let request: supertest.SuperTest<supertest.Test>;

  beforeAll(() => {
    server = new BaseServer(3000);
    server.get("/test", (req, res) => {
      res.sendJson({ message: "Test route" });
    });
    server.post("/testPost", (req, res) => {
      res.sendJson({ message: "Post route", data: req.incomingPayload });
    });
    server.delete("/testDelete", (req, res) => {
      res.sendJson({ message: "Delete route" });
    });
    server.listenAndServe();
    request = supertest.agent(server.server) as any;
  });

  afterAll(() => {
    server.server.close();
  });

  it("should respond to GET /test", async () => {
    const response = await request.get("/test");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Test route" });
  });

  it("should respond with 404 for unknown routes", async () => {
    const response = await request.get("/unknown");
    expect(response.status).toBe(404);
  });

  it("should respond with 405 for wrong method", async () => {
    const response = await request.post("/test");
    expect(response.status).toBe(405);
  });
  it("should respond to PUT /test", async () => {
    const response = await request.put("/test");
    expect(response.status).toBe(405); // Assuming PUT is not allowed on /test
  });

  it("should respond to PATCH /test", async () => {
    const response = await request.patch("/test");
    expect(response.status).toBe(405); // Assuming PATCH is not allowed on /test
  });
  it("should respond to POST /testPost", async () => {
    const response = await request.post("/testPost").send({ data: "test" });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Post route",
      data: { data: "test" },
    });
  });

  it("should respond to DELETE /testDelete", async () => {
    const response = await request.delete("/testDelete");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Delete route" });
  });

  it("should respond with 400 for malformed JSON", async () => {
    const response = await request
      .post("/testPost")
      .set("Content-Type", "application/json")
      .send('{"malformedJson": "test",}');
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Error parsing incoming JSON" });
  });
});
