import { z } from "zod";

const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "video/mp4", "video/quicktime"];

export const postSchema = z.object({
  post_id: z.string(),
  post: z
    .string({ message: "Descrição do post é obrigatório" })
    .min(1, "Descrição do post é obrigatório")
    .trim(),
  file: z
    .any()
    .refine(
      (files) => typeof FileList === 'undefined' || files instanceof FileList,
      {
        message: "Ocorreu um erro com o upload do arquivo.",
      }
    )
    .refine((files) => files?.length > 0, "Selecione um arquivo de imagem ou vídeo")
    .refine(
      (files) =>
        files?.[0]?.type.startsWith("image/") ||
        files?.[0]?.type.startsWith("video/"),
      "O arquivo deve ser uma imagem ou vídeo."
    )
    .refine(
      (files) => allowedTypes.includes(files?.[0]?.type),
      "O arquivo deve ser do tipo PNG, JPEG, JPG ou MP4"
    ),
});

export type PostFormData = z.infer<typeof postSchema>;