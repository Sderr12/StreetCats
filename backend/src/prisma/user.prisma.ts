import prisma from "../prisma.ts";
import { UserRepository } from "../interfaces/repositories/user.repository.ts";
import { userDTO } from "../interfaces/dto/user.dto.ts";
import { User } from "@prisma/client";

export class userPrisma implements UserRepository{

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email }
    });
  }


  async create(user: userDTO) {
    return prisma.user.create({ user });
  }

}
