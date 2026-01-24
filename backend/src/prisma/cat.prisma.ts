import type { CatRepository } from "../interfaces/repositories/cat.repository.js";
import { prisma } from "../prisma.js";
import type { catDTO } from "../interfaces/dto/cat.dto.js";

export class catPrisma implements CatRepository {


  async create(data: {
    title: string;
    description: string;
    latitude: number;
    longitude: number;
    photo: string;
    userId: number;
  }): Promise<catDTO> {

    const cat = await prisma.cat.create({
      data: {
        title: data.title,
        description: data.description,
        latitude: data.latitude,
        longitude: data.longitude,
        photo: data.photo,
        userId: data.userId
      },
      include: { user: true }
    })

    return this.mapToDTO(cat);
  }


  async findById(id: number): Promise<catDTO | null> {
    const cat = await prisma.cat.findUnique({
      where: { id },
      include: { user: true }
    })

    return cat ? this.mapToDTO(cat) : null;
  }


  async delete(id: number): Promise<boolean> {
    try {
      await prisma.cat.delete({
        where: { id }
      });
      return true;

    } catch (error) {
      return false;
    }
  }


  /**
     * Retrieves all feline sightings within a specific geographic range.
     * * This implementation utilizes the Haversine formula via a raw SQL query 
     * to calculate the great-circle distance between the user's coordinates 
     * and each record in the database.
     * @param lat - Latitude of the center point
     * @param lon - Longitude of the center point
     * @param radiusKm - Maximum distance in kilometers
     * @returns A promise resolving to an array of cats within the specified radius, 
     * ordered by proximity.
     */
  async findInRadius(
    lat: number,
    lon: number,
    radiusKm: number
  ): Promise<catDTO[]> {
    const cats = await prisma.$queryRaw<any[]>`
      SELECT * FROM (
        SELECT 
          c.*, 
          u.username AS "username", 
          (6371 * acos(
            cos(radians(${lat})) * cos(radians(c.latitude)) * cos(radians(c.longitude) - radians(${lon})) + 
            sin(radians(${lat})) * sin(radians(c.latitude))
          )) AS distance
        FROM "Cat" c
        JOIN "User" u ON c."userId" = u.id 
      ) AS distances
      WHERE distance < ${radiusKm}
      ORDER BY distance;
    `;

    return cats.map(cat => this.mapToDTO(cat));
  }


  private mapToDTO(cat: any): catDTO {
    return {
      id: cat.id,
      title: cat.title,
      description: cat.description,
      latitude: cat.latitude,
      longitude: cat.longitude,
      photo: cat.photo,
      createdAt: cat.createdAt.toISOString(),
      user: cat.user.username || cat.username || "Unknown"
    }
  }
}
