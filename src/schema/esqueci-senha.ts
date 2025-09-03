import { z } from "zod";

const MIN_LENGTH = 6;
const SPECIAL_CHARACTERS = /[!@#$%^&*]/;

export const sendCodeSchema = z.object({
  email: z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),
});

export const verifyCodeSchema = z.object({
  code: z.string().min(1, "Código é obrigatório"),
});

export const resetSchema = z
  .object({
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

export type SendCodeType = z.infer<typeof sendCodeSchema>;
export type VerifyCodeType = z.infer<typeof verifyCodeSchema>;
export type ResetType = z.infer<typeof resetSchema>;
