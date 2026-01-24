import { prisma } from "../prisma.js";
import type { UserRepository } from "../interfaces/repositories/user.repository.ts";
import {
  toUserDTO,
  toUserCredentialsDTO,
  type UserDTO,
  type UserCredentialsDTO
} from "../interfaces/dto/user.dto.js";

export class userPrisma implements UserRepository {

  async findByEmail(email: string): Promise<UserCredentialsDTO | null> {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) return null;

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      password: user.password,
      avatarUrl: user.avatarUrl ?? undefined
    };
  }

  async create(user: UserCredentialsDTO): Promise<UserDTO> {
    const newUser = await prisma.user.create({
      data: {
        username: user.username,
        email: user.email,
        password: user.password,
        avatarUrl: user.avatarUrl ?? null
      }
    });

    return toUserDTO({
      ...newUser,
      avatarUrl: newUser.avatarUrl ?? undefined
    } as UserCredentialsDTO);
  }
}
