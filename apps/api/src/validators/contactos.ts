import { z } from "zod";

export const contactosSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Nome obrigatorio."),
    email: z.string().email("Email invalido."),
    contact: z.string().min(6, "Contacto obrigatorio."),
    message: z.string().min(10, "Mensagem curta demais.")
  })
});
