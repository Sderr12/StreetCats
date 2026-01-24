import { z } from "zod";

export const catSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(50),
    description: z.string().min(10),
    latitude: z.coerce.number().min(-90).max(90),
    longitude: z.coerce.number().min(-180).max(180),
  })
}
)
