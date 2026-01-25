import type { Request, Response } from "express";
import type { CatService } from "../services/cat.service.js";

export class CatController {
  private readonly catService: CatService;

  constructor(catService: CatService) {
    this.catService = catService;
  }

  public async createCat(req: Request, res: Response): Promise<void> {
    try {
      const userId = res.locals.id;
      const photoPath = req.file?.path;

      if (!photoPath) {
        res.status(400).json({
          message: "There must be a photo of the cat"
        });
        return;
      }

      // Estraiamo e convertiamo esplicitamente le coordinate
      const catData = {
        ...req.body,
        latitude: parseFloat(req.body.latitude),
        longitude: parseFloat(req.body.longitude)
      };

      // Ora passiamo l'oggetto con i numeri reali al servizio
      const newCat = await this.catService.createNewCat(catData, userId, photoPath);

      res.status(201).json(newCat);
    } catch (error: any) {
      res.status(500).json({
        message: error.message
      });
    }
  }


  public async getCatDetails(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const cat = await this.catService.getCatById(parseInt(id as string));

      if (!cat) {
        res.status(404).json({ message: "Gatto non trovato" });
        return;
      }

      res.status(200).json(cat);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }


  public async getNearbyCats(req: Request, res: Response): Promise<void> {
    try {
      const lat = Number(req.query.lat);
      const lon = Number(req.query.lon);
      const radius = Number(req.query.radius || 10);

      const cats = await this.catService.getNearbyCats(lat, lon, radius);
      res.status(200).json(cats);
    } catch (error: any) {
      res.status(500).json({
        message: error.message
      });
    }
  }

}
