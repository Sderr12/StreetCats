import type { catDTO, CreateCatDTO } from "../dto/cat.dto.ts"

export interface CatRepository {

  create(data: CreateCatDTO & { userId: number; photo: string }): Promise<catDTO>;

  findInRadius(
    latitude: number,
    longitude: number,
    radiusKm: number
  ): Promise<catDTO[]>;

  findById(id: number): Promise<catDTO | null>
  delete(id: number): Promise<boolean>


}
