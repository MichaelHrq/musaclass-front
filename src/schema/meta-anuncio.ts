import { z } from "zod";

export type typeMetaAnucio = z.infer<typeof metaAnuncioSchema>;

export const metaAnuncioSchema = z
  .object({
    post_id: z.string().min(1, "ID do post é obrigatório"),
    ddi_acompanhante: z
      .string()
      .min(1, "DDD é obrigatório")
      .max(4, "DDD inválido"),
    whatsapp_acompanhante: z.string().min(11, "Digite um telefone válido"),
    novoatendimento_acompanhante: z.array(z.string()),
    cache_acompanhante: z.number().optional().nullable(),
    cartao_acompanhante: z
      .string({ message: "É obrigatório" })
      .min(1, "É obrigatório"),
    //   novoaltura_esconder: z.boolean(),
    //   novopeso_esconder: z.boolean(),
    //   quadril_esconder: z.boolean(),
    //   novopes_esconder: z.boolean(),
    novoaltura_acompanhante: z.string().optional(),
    novopeso_acompanhante: z.string().optional(),
    quadril_acompanhante: z.string().optional(),
    novopes_acompanhante: z.string().optional(),
    novoacompanha_acompanhante: z
      .array(z.string())
      .min(1, `É obrigatório quem acompanha`),
  })
  .refine(
    (data) => {
      const { cache_acompanhante } = data;
      const n = Number(cache_acompanhante);
      if (!n) {
        data.cache_acompanhante = null;
        return true;
      }
      if (n < 500) return false;
      return true;
    },
    {
      message: "Cachê deve ser no mínimo R$ 500,00",
      path: ["cache_acompanhante"],
    },
  );
