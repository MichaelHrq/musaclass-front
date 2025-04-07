import { z, ZodLazy } from "zod";

const allowedTypes = [
  "image/jpeg",
  "image/png",
  // "image/gif",
  // "image/webp",
  "video/mp4",
  // "video/webm",
  // "video/quicktime",
];

export const postSchema = z.object({
  post: z.string().nonempty("Descrição do post é obrigatório").trim(),
  midia: z
    .instanceof(File, { message: "Uma imagem ou vídeo é obrigatório" })
    .refine((file) => allowedTypes.includes(file.type), { message: "Formatos suportados: JPG, PNG, MP4" }),
});
