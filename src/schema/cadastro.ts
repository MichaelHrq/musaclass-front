import { z } from "zod";

export const cadastroSchema = z
  .object({
    email: z
      .string()
      .nonempty("E-mail é obrigatório")
      .email("E-mail inválido")
      .trim(),
    // token: z.string({ message: "Token é obrigatório" }),
    cpf: z
      .string()
      .trim()
      .nonempty("CPF é obrigatório")
      .min(14, "CPF inválido")
      .max(14, "CPF inválido"),
    password: z
      .string({ message: "Senha é obrigatória" })
      .nonempty("Senha é obrigatória"),
    password_confirmation: z
      .string({
        message: "Confirmação de senha é obrigatória",
      })
      .nonempty("Confirmação de senha é obrigatória"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "As senhas não coincidem",
    path: ["password_confirmation"],
  });
