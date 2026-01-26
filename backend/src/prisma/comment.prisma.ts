import { prisma } from "../prisma.js";
import type { CommentRepository } from "../interfaces/repositories/comment.repository.js";
import type { CreateComment, commentDTO } from "../interfaces/dto/comment.dto.js";

export class CommentPrisma implements CommentRepository {


  async findByCatId(catId: number): Promise<commentDTO[]> {
    return await prisma.comment.findMany({
      where: { catId },
      include: {
        user: { select: { username: true, avatarUrl: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
  }


  async create(data: CreateComment, catID: number, userID: number): Promise<commentDTO> {
    const prismaComment = await prisma.comment.create({
      data: {
        content: data.content,
        catId: catID,
        userId: userID,
      },
      include: {
        user: {
          select: {
            username: true,
            avatarUrl: true,
          }
        }
      }
    })

    return {
      content: prismaComment.content,
      user: {
        username: prismaComment.user.username,
        avatarUrl: prismaComment.user.avatarUrl
      }
    }
  }
}

