import { BaseServer } from "./packages/custom-http";

const server = new BaseServer(3000);
server.get("/", (req, res) => {
  res.sendJson({ message: "Hello World" }, 204);
});
server.post("/auth/register", async (req, res) => {
  res.sendJson("AHOI", 201);
});
server.listenAndServe(() => console.log("Server is listening on port 3000"));
