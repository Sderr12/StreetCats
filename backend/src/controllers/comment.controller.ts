import type { Request, Response } from "express";
import type { CommentService } from "../services/comment.service.ts";
import type { commentDTO, CreateComment } from "../interfaces/dto/comment.dto.js";

export class CommentController {
  private readonly commentService: CommentService;

  constructor(commentService: CommentService) {
    this.commentService = commentService;
  }


  public async postComment(req: any, res: Response): Promise<void> {
    try {
      const catId = parseInt(req.params.id as string);
      const userId = parseInt(res.locals.id as string);

      const input: CreateComment = req.body;

      if (!input) {
        res.status(400).json({
          message: "Content is obligatory!",
        })
        return;
      }

      const newComment: commentDTO = await this.commentService.addComment(input, catId, userId);

      res.status(201).json(newComment);
    } catch (error: any) {
      console.error("Error in comment.controller: ", error);
      res.status(500).json({
        message: "Internal server error"
      })
    }
  }


  public async getComments(req: Request, res: Response): Promise<void> {
    try {
      const catId = parseInt(req.params.id as string)
      const comments = await this.commentService.getCommentsByCat(catId);
      res.json(comments);
    } catch (error) {
      res.status(500).json({
        message: "comment.controller: Can't recover comments"
      })
    }
  }


}


