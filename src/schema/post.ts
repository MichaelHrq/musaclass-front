import { z } from "zod";

const allowedTypes = ["image/jpeg", "image/png", "video/mp4"];

export const postSchema = z.object({
  post: z.string().nonempty("Descrição do post é obrigatório").trim(),
  midia: z
    .instanceof(File, { message: "Uma imagem ou vídeo é obrigatório" })
    .refine((file) => allowedTypes.includes(file.type), {
      message: "Formatos suportados: JPG, PNG, MP4",
    }),
});
