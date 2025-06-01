import { z } from "zod";

const allowedTypes = ["image/jpeg", "image/png", "video/mp4"];

export const postSchema = z.object({
  post: z.string().nonempty("Descrição do post é obrigatório").trim(),
  midia: z
    .any()
    .refine((files) => files?.length > 0, "É necessário selecionar um arquivo.")
    .refine(
      (files) =>
        files?.[0]?.type.startsWith("image/") ||
        files?.[0]?.type.startsWith("video/"),
      "O arquivo deve ser uma imagem ou vídeo."
    )
    .refine(
      (files) => allowedTypes.includes(files?.[0]?.type),
      "O arquivo deve ser do tipo PNG, JPEG ou MP4"
    ),
});

export type PostFormData = z.infer<typeof postSchema>;