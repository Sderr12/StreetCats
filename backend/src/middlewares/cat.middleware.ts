import type { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError } from "zod";

export const validate = (schema: ZodObject) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      return next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Invalid data",
          details: error.issues.map((e) => ({
            field: e.path[e.path.length - 1],
            error: e.message
          }))
        });
      }

      return res.status(500).json({ message: "Internal server error" });
    }
  };
