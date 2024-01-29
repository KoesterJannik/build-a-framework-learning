import { parseEnvFromRootDir } from "./packages/custom-env-loader";
parseEnvFromRootDir(".env");
import { BaseServer } from "./packages/custom-http";
import { connectToDb } from "./packages/native-mongo/db";
import authRouter from "./router/authRouter";

const server = new BaseServer(Number(process.env.PORT));
server.get("/", (req, res) => {
  res.sendJson({ message: "Hello World" }, 204);
});

server.joinSubRoutes("/auth", authRouter.routes);

async function start() {
  await connectToDb(process.env.DATABASE_URI!, "dummy-app");
  server.listenAndServe(() => console.log("Server is listening on port 3000"));
}

start();
