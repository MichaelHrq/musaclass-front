import { z } from "zod";

const MIN_LENGTH = 6;
const SPECIAL_CHARACTERS = /[!@#$%^&*]/;

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
      .string()
      .min(MIN_LENGTH, `Senha deve ter no mínimo ${MIN_LENGTH} caracteres`)
      .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
      .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
      .regex(/[0-9]/, "A senha deve conter pelo menos um número")
      .regex(
        SPECIAL_CHARACTERS,
        "A senha deve conter pelo menos um caractere especial !@#$%^&*"
      ),
    password_confirmation: z
      .string()
      .min(1, "Confirmação de senha é obrigatória"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "As senhas não coincidem",
    path: ["password_confirmation"],
  });
