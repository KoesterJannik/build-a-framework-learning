import { SubRouter } from "../packages/custom-http/sub-router";
import { db } from "../packages/native-mongo/db";

const authRouter = new SubRouter();
authRouter.get("/login", (req, res) => {
  res.sendJson({ message: "Login route" });
});
authRouter.post("/register", async (req, res) => {
  await db.collection("users").insertOne(req.incomingPayload);
  res.sendJson({ message: "Register route" });
});

export default authRouter;
