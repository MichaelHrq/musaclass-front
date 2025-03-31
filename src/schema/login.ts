import { z } from "zod";

export const loginSchema = z.object({
    email: z
      .string()
      .nonempty("E-mail é obrigatório")
      .email("E-mail inválido")
      .trim(),
    password: z
      .string()
      .nonempty("Senha é obrigatória"),
    submit: z.boolean().optional(),
  });
