import type { CatRepository } from "../interfaces/repositories/cat.repository.js";
import type { catDTO, CreateCatDTO } from "../interfaces/dto/cat.dto.ts";
import { Prisma } from "@prisma/client";

export class CatService {
  private readonly catRepo: CatRepository;

  constructor(catRepo: CatRepository) {
    this.catRepo = catRepo;
  }

  async createNewCat(data: CreateCatDTO, userId: number, photoPath: string): Promise<catDTO> {
    return await this.catRepo.create({
      ...data,
      photo: photoPath,
      userId: userId
    })
  }
}
