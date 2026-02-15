import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Nome curto demais."),
    email: z.string().email("Email invalido."),
    password: z.string().min(6, "Password deve ter pelo menos 6 caracteres."),
    phone: z.string().min(6).optional().or(z.literal("")),
    location: z.string().optional().or(z.literal(""))
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Email invalido."),
    password: z.string().min(1, "Password obrigatoria.")
  })
});

export const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, "Refresh token em falta.")
  })
});
