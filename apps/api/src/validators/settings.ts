import { z } from "zod";

export const companySettingsSchema = z.object({
  body: z.object({
    companyName: z.string().min(1).optional().nullable(),
    nif: z.string().min(1).optional().nullable(),
    address: z.string().min(1).optional().nullable(),
    socialArea: z.string().min(1).optional().nullable(),
    phone: z.string().min(3).optional().nullable(),
    email: z.string().email().optional().nullable()
  })
});
