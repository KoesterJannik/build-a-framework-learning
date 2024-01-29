import { SubRouter } from "../packages/custom-http/sub-router";

const authRouter = new SubRouter();
authRouter.get("/login", (req, res) => {
  res.sendJson({ message: "Login route" });
});
authRouter.post("/register", (req, res) => {
  res.sendJson({ message: "Register route" });
});

export default authRouter;
