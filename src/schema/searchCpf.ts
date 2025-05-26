import { z } from "zod";

export type SearchCpfType = z.infer<typeof SearchCpfSchema>;

export type SendEmailType = z.infer<typeof SendEmailSchema>;

export const SearchCpfSchema = z.object({
  cpf: z
    .string()
    .trim()
    .nonempty("CPF é obrigatório")
    .min(14, "CPF inválido")
    .max(14, "CPF inválido"),
});

export const SendEmailSchema = z.object({
  email: z
    .string()
    .nonempty("E-mail é obrigatório")
    .email("E-mail inválido")
    .trim(),
});


