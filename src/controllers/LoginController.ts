import { NextFunction, Request, Response } from "express";
import { controller, get, post, use, validateBody } from "./decorators";

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (req.session?.loggedIn) {
    next();
  } else {
    res.status(403).send("Denied");
  }
}

@controller("/auth")
class LoginController {
  @get("/login")
  getLogin(req: Request, res: Response): void {
    res.send(`
        <form method="POST">
          <div>
            <label>Email</label>
            <input name="email" />
          </div>
          <div>
            <label>Password</label>
            <input name="password" type="password"/>
          </div>
          <button>Submit</button>
        </form>
      `);
  }

  @post("/login")
  @validateBody("email", "password")
  postLogin(req: Request, res: Response) {
    const { email, password } = req.body;

    if (
      email &&
      password &&
      email === "dave@gmail.com" &&
      password === "dave"
    ) {
      req.session = { loggedIn: true };
      res.redirect("/");
    } else {
      res.send("Invalid email or password");
    }
  }

  @get("/logout")
  getLogout(req: Request, res: Response) {
    req.session = undefined;

    res.redirect("/");
  }

  @get("/protected")
  @use(requireAuth)
  getProtected(req: Request, res: Response) {
    res.send("Welcome to protected route");
  }
}
