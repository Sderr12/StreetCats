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
        })
        return
      }

      const newCat = await this.catService.createNewCat(req.body, userId, photoPath);
      res.status(201).json(newCat);
    } catch (error: any) {
      res.status(500).json({
        message: error.message
      });
    }
  }


  public async getNearbyCats(req: Request, res: Response): Promise<void> {
    try {
      const lat = Number(req.query.lat);
      const lon = Number(req.query.lon);
      const radius = Number(req.query.radius || 10);

      const cats = await this.catService.getNearby(lat, lon, radius);
      res.status(200).json(cats);
    } catch (error: any) {
      res.status(500).json({
        message: error.message
      });
    }
  }

}
