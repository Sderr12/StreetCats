import type { CommentRepository } from "../interfaces/repositories/comment.repository.js";
import type { CreateComment, commentDTO } from "../interfaces/dto/comment.dto.js";

export class CommentService {
  readonly commentRepo: CommentRepository;

  constructor(commentRepo: CommentRepository) {
    this.commentRepo = commentRepo;
  }

  async addComment(content: CreateComment, catId: number, userId: number): Promise<commentDTO> {
    return await this.commentRepo.create(content, catId, userId)
  }


  async getCommentsByCat(catId: number): Promise<commentDTO[]> {
    if (!catId) throw new Error("Error in comment.service: no cat's id.");

    return await this.commentRepo.findByCatId(catId);
  }
}
