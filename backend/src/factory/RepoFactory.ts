import type { CatRepository } from "../interfaces/repositories/cat.repository.js";
import type { UserRepository } from "../interfaces/repositories/user.repository.js";
import { catPrisma } from "../prisma/cat.prisma.js";
import { userPrisma } from "../prisma/user.prisma.js";

export class RepoFactory {
  public getUserRepo(type: string): UserRepository {
    if (type == "Prisma") {
      return new userPrisma();
    }

    throw new Error(`Repo of type ${type} not found`);
  }

  public getCatRepo(type: string): CatRepository {
    if (type == "Prisma") {
      return new catPrisma();
    }

    throw new Error(`Repo of type ${type} not found`);
  }
}
