import { z } from "zod";

export const anuncioSchema = z
  .object({
    post_id: z.string().min(1, "ID do post é obrigatório"),
    ddi_acompanhante: z
      .string()
      .min(1, "DDD é obrigatório")
      .max(4, "DDD inválido"),
    whatsapp_acompanhante: z.string().min(11, "Digite um telefone válido"),
    novoatendimento_acompanhante: z.array(z.string()),
    cache_acompanhante: z.number().optional().nullable(),
    // cache_acompanhante_esconder: z.boolean(),
    cartao_acompanhante: z
      .string({ message: "É obrigatório" })
      .min(1, "É obrigatório"),
    novoaltura_esconder: z.boolean(),
    novopeso_esconder: z.boolean(),
    quadril_esconder: z.boolean(),
    novopes_esconder: z.boolean(),
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
  )
  .refine(
    (data) => {
      const { novoaltura_acompanhante, novoaltura_esconder } = data;
      if (novoaltura_esconder) {
        data.novoaltura_acompanhante = "";
        return true;
      }
      const n = Number(novoaltura_acompanhante);
      if (n < 1.45) return false;
      if (n > 1.9) return false;
      return true;
    },
    {
      message: "Altura deve estar entre 1,45 e 1,90 (m)",
      path: ["novoaltura_acompanhante"],
    },
  )
  .refine(
    (data) => {
      const { novopeso_acompanhante, novopeso_esconder } = data;
      if (novopeso_esconder) {
        data.novopeso_acompanhante = "";
        return true;
      }
      const n = Number(novopeso_acompanhante);
      if (n < 40) return false;
      if (n > 89) return false;
      return true;
    },
    {
      message: "Peso deve estar entre 40 e 89 (kg)",
      path: ["novopeso_acompanhante"],
    },
  )
  .refine(
    (data) => {
      const { quadril_acompanhante, quadril_esconder } = data;
      if (quadril_esconder) {
        data.quadril_acompanhante = "";
        return true;
      }
      if (!quadril_acompanhante) return false;
      return true;
    },
    {
      message: "Manequim é obrigatório",
      path: ["quadril_acompanhante"],
    },
  )
  .refine(
    (data) => {
      const { novopes_acompanhante, novopes_esconder } = data;
      if (novopes_esconder) {
        data.novopes_acompanhante = "";
        return true;
      }
      const n = Number(novopes_acompanhante);
      if (n < 31) return false;
      if (n > 42) return false;
      return true;
    },
    {
      message: "Tamanho dos pés devem estar entre 31 e 42",
      path: ["novopes_acompanhante"],
    },
  );

export type AnuncioType = z.infer<typeof anuncioSchema>;
