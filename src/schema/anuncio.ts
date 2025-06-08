import { z } from "zod";

export const anuncioSchema = z
  .object({
    post_id: z.string().min(1, "ID do post é obrigatório"),
    whatsapp_acompanhante: z
      .string()
      .min(15, "Digite um telefone válido")
      .max(15, "Digite um telefone válido"),
    novoatendimento_acompanhante: z.array(z.string()),
    cache_acompanhante: z.number().optional(),
    combinar: z.boolean(),
    cartao_acompanhante: z
      .string({ message: "É obrigatório" })
      .min(1, "É obrigatório"),
    novoaltura_acompanhante: z
      .string()
      .min(1, "Altura é obrigatório")
      .refine((value) => {
        const n = Number(value);
        if (n < 1.45) return false;
        if (n > 1.9) return false;
        return true;
      }, "Altura deve estar entre 1.45 e 1.90 (m)"),
    novopeso_acompanhante: z
      .string()
      .min(1, "Peso é obrigatório")
      .refine((value) => {
        const n = Number(value);
        if (n < 40) return false;
        if (n > 89) return false;
        return true;
      }, "Peso deve estar entre 40 e 89 (kg)"),
    quadril_acompanhante: z.string().min(1, "Manequim é obrigatório"),
    novopes_acompanhante: z
      .string()
      .min(1, "Tamanho dos pés é obrigatório")
      .refine((value) => {
        const n = Number(value);
        if (n < 31) return false;
        if (n > 42) return false;
        return true;
      }, "Tamanho dos pés devem estar entre 31 e 42"),
    novoacompanha_acompanhante: z
      .array(z.string())
      .min(1, `É obrigatório quem acompanha`),
  })
  .refine(
    (data) => {
      const { cache_acompanhante, combinar } = data;
      if (!cache_acompanhante && !combinar) return false;
      return true;
    },
    {
      message: "Digite um cachê ou selecione a combinar",
      path: ["cache_acompanhante"],
    }
  );

export type AnuncioType = z.infer<typeof anuncioSchema>;
