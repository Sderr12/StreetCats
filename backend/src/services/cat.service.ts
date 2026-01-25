import type { CatRepository } from "../interfaces/repositories/cat.repository.js";
import type { catDTO, CreateCatDTO } from "../interfaces/dto/cat.dto.ts";

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


  public async getCatById(id: number): Promise<catDTO | null> {
    const cat = await this.catRepo.findById(id);

    if (!cat) {
      return null;
    }

    return cat;
  }


  public async getNearbyCats(lat: number, lon: number, radius: number) {
    const cats = await this.catRepo.findInRadius(lat, lon, radius);

    return cats;
  }


}
