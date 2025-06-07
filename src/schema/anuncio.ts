import { z } from "zod";

export const anuncioSchema = z.object({
  post_id: z.string().min(1, "ID do post é obrigatório"),
  whatsapp_acompanhante: z.string().min(1, "Telefone é obrigatório"),
  novoatendimento_acompanhante: z
    .array(z.string({ message: "É obrigatório" }))
    .min(1, "É obrigatório"),
  cache_acompanhante: z
    .string({ message: "Cachê é obrigatório" })
    .min(1, "Cachê é obrigatório"),
  cartao_acompanhante: z.string({ message: "É obrigatório" }).min(1, "É obrigatório"),
  novoaltura_acompanhante: z
    .string()
    .nonempty("Altura é obrigatório")
    .min(1, "Altura é obrigatório"),
  novopeso_acompanhante: z.string().min(1, "Peso é obrigatório"),
  quadril_acompanhante: z.string().min(1, "Manequim é obrigatório"),
  novopes_acompanhante: z.string().min(1, "Tamanho dos pés é obrigatório"),
  novoacompanha_acompanhante: z.array(
    z.object({
      value: z.string(),
      label: z.string(),
    })
  ),
});

export type AnuncioType = z.infer<typeof anuncioSchema>;

