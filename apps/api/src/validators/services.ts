import { z } from "zod";

export const serviceSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Nome obrigatorio."),
    description: z.string().min(5, "Descricao obrigatoria."),
    price: z.number().min(0).optional(),
    isActive: z.boolean().optional()
  })
});

export const serviceUpdateSchema = z.object({
  body: serviceSchema.shape.body.partial()
});
