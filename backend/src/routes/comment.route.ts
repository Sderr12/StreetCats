import type { Request, Response } from "express";
import type { CommentController } from "../controllers/comment.controller.js";
import AuthMiddleware from "../middlewares/auth.middleware.js";
import { Route } from "./route.js";


export class CommentRoute extends Route {
  private readonly commentController: CommentController;
  private readonly authMiddleware: AuthMiddleware;

  constructor(commentController: CommentController) {
    super();
    this.commentController = commentController;
    this.authMiddleware = new AuthMiddleware();
    this.initRoute();
  }


  protected override initRoute(): void {

    this.router.get(
      '/:id/comments',
      (req: Request, res: Response) => this.commentController.getComments(req, res)
    )

    this.router.post(
      '/:id/comments',
      this.authMiddleware.verifyToken,
      (req: any, res: Response) => this.commentController.postComment(req, res)
    )
  }

}
