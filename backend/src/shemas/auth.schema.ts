import { z } from "zod";


const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(5),
    callback: z.string()
  })
})
