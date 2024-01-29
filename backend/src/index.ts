import { BaseServer } from "./packages/custom-http";
import authRouter from "./router/authRouter";

const server = new BaseServer(3000);
server.get("/", (req, res) => {
  res.sendJson({ message: "Hello World" }, 204);
});
server.post("/auth/register", async (req, res) => {
  res.sendJson(req.incomingPayload, 201);
});
server.joinSubRoutes("/auth", authRouter.routes);
server.listenAndServe(() => console.log("Server is listening on port 3000"));
