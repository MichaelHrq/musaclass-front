import { z } from "zod";

export const SearchCpfSchema = z.object({
  cpf: z
    .string()
    .trim()
    .nonempty("CPF é obrigatório")
    .min(14, "CPF inválido")
    .max(14, "CPF inválido"),
});

export type SearchCpfType = z.infer<typeof SearchCpfSchema>;

export const SendEmailSchema = z.object({
  email: z
    .string()
    .nonempty("Email é obrigatório")
    .email("Email inválido")
    .trim(),
});

export type SendEmailType = z.infer<typeof SendEmailSchema>;

export const ChangeEmailSchema = z.object({
  lastEmail: z
    .string()
    .nonempty("Email é obrigatório")
    .email("Email inválido")
    .trim(),
  newEmail: z
    .string()
    .nonempty("Email é obrigatório")
    .email("Email inválido")
    .trim(),
});

export type ChangeEmailType = z.infer<typeof ChangeEmailSchema>;
