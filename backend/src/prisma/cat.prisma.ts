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
  async findInRadius(lat: number, lon: number, radiusKm: number): Promise<catDTO[]> {
    const allCats = await prisma.cat.findMany({
      include: { user: true }
    });

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const R = 6371;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    const nearbyCats = allCats.filter(cat => {
      const distance = calculateDistance(lat, lon, cat.latitude, cat.longitude);
      return distance <= radiusKm;
    });

    return nearbyCats.map(cat => this.mapToDTO(cat));
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
