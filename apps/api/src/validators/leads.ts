import { z } from "zod";

export const leadSchema = z.object({
  body: z.object({
    listingId: z.string().uuid().optional(),
    serviceId: z.string().uuid().optional(),
    name: z.string().min(2, "Nome obrigatorio."),
    email: z.string().email("Email invalido."),
    phone: z.string().min(6).optional().or(z.literal("")),
    message: z.string().min(5, "Mensagem curta demais.")
  }).refine((data) => data.listingId || data.serviceId, {
    message: "Seleciona um anuncio ou servico.",
    path: ["listingId"]
  })
});
