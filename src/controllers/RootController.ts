import { controller, get, use } from "./decorators";
import { Request, Response } from "express";
import { requireAuth } from "./LoginController";

@controller("")
class RootController {
  @get("/")
  getRoot(req: Request, res: Response) {
    if (req.session?.loggedIn) {
      res.send(`You are logged in.<br/><a href="/auth/logout">Logout</a>`);
    } else {
      res.send(`You are not logged in.<br/><a href="/auth/login">Login</a>`);
    }
  }

  @get("/protected")
  @use(requireAuth)
  getProtected(req: Request, res: Response) {
    res.send("Welcome to protected route");
  }
}
