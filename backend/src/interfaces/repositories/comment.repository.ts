import type { commentDTO, CreateComment } from "../dto/comment.dto.js";



export interface CommentRepository {

  findByCatId(catId: number): Promise<commentDTO[]>;
  create(data: CreateComment, catId: number, userId: number): Promise<commentDTO>

}
