import type { Request, Response } from "express";
import { Route } from "./route.js";
import { CatController } from "../controllers/cat.controller.js"
import upload from "../middlewares/storageMiddleware.js";
import { catSchema } from "../shemas/cat.schema.js";
import { validate } from "../middlewares/cat.middleware.js"
import AuthMiddleware from "../middlewares/auth.middleware.js";

export class CatRoute extends Route {
  private readonly catController: CatController;
  private readonly authMiddleware: AuthMiddleware;

  constructor(catController: CatController) {
    super();
    this.catController = catController;
    this.authMiddleware = new AuthMiddleware();
    this.initRoute();
  }

  protected override initRoute(): void {

    this.router.post(
      '/',
      (req, res, next) => this.authMiddleware.verifyToken(req, res, next),
      upload.single("photo"),
      validate(catSchema),
      (req: Request, res: Response) => this.catController.createCat(req, res)
    );

    this.router.get(
      '/nearby',
      (req: Request, res: Response) => this.catController.getNearbyCats(req, res)
    )

    this.router.get(
      '/:id',
      (req: Request, res: Response) => this.catController.getCatDetails(req, res)
    );


    this.router.get('/:id/comments', (req, res) => {
      // Per ora restituiamo un array vuoto così il frontend non crasha
      res.status(200).json([]);
    });
  }
}
