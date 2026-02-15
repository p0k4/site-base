import { z } from "zod";

export const profileSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Nome curto demais.").optional(),
    phone: z.string().min(6).optional().or(z.literal("")),
    location: z.string().optional().or(z.literal(""))
  })
});
