import { z } from "zod";

export const anuncioSchema = z.object({
  post_id: z.string().min(1, "ID do post é obrigatório"),
  telefone: z.string().min(1, "Telefone é obrigatório"),
  local: z
    .array(z.string({ message: "É obrigatório" }))
    .min(1, "É obrigatório"),
  cache: z
    .string({ message: "Cachê é obrigatório" })
    .min(1, "Cachê é obrigatório"),
  cartao: z.string({ message: "É obrigatório" }).min(1, "É obrigatório"),
  altura: z
    .string()
    .nonempty("Altura é obrigatório")
    .min(1, "Altura é obrigatório"),
  peso: z.string().min(1, "Peso é obrigatório"),
  manequim: z.string().min(1, "Manequim é obrigatório"),
  pes: z.string().min(1, "Tamanho dos pés é obrigatório"),
  acompanha: z.array(
    z.object({
      value: z.string(),
      label: z.string(),
    })
  ),
});

export type AnuncioType = z.infer<typeof anuncioSchema>;

