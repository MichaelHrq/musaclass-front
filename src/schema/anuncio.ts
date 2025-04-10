import { z } from "zod";

export const anuncioSchema = z.object({
  telefone: z.string().nonempty("Telefone é obrigatório").trim(),
  local: z.string({message:"É obrigatório"}).trim(),
  cache: z.number({message:"Cachê é obrigatório"}),
  cartao: z.string({message:"É obrigatório"}).trim(),
  altura: z.string().nonempty("Altura é obrigatório").trim(),
  peso: z.string().nonempty("Peso é obrigatório").trim(),
  manequim: z.string().nonempty("Manequim é obrigatório").trim(),
  pes: z.string().nonempty("Tamanho dos pés é obrigatório").trim(),
  acompanha: z.string({message:"É obrigatório"}).trim(),
});
