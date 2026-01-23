import type { Request, Response } from "express";
import { Route } from "./route.js";
import { AuthController } from "../controllers/auth.controller.js";
import upload from "../middlewares/storageMiddleware.js";

export class AuthRoute extends Route {
  private readonly authController: AuthController;

  constructor(authController: AuthController) {
    super();
    this.authController = authController;
    this.initRoute();
  }


  protected override initRoute(): void {
    this.router.post('/login', (req: Request, res: Response) => this.authController.login(req, res));
    this.router.post('/register', upload.single("avatar"), (req: Request, res: Response) => this.authController.register(req, res))
  }
}
