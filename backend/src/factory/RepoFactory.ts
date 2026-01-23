import type { UserRepository } from "../interfaces/repositories/user.repository.js";
import { userPrisma } from "../prisma/user.prisma.js";

export class RepoFactory {
  public getUserRepo(type: string): UserRepository {
    if (type == "Prisma") {
      return new userPrisma();
    }

    throw new Error(`Repo of type ${type} not found`);
  }
}
