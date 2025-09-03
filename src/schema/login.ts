import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({ message: "E-mail é obrigatório" })
    .nonempty("E-mail é obrigatório")
    .email("E-mail inválido")
    .trim(),
  password: z
    .string({ message: "Senha é obrigatória" })
    .nonempty("Senha é obrigatória"),
});
