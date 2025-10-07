import { z } from "zod";

const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "video/mp4", "video/quicktime"];
const MAX_FILE_SIZE_MB = 250;

export const postSchema = z.object({
  post_id: z.string(),
  tipo: z.enum(['post', 'story']),
  post: z
    .string({ message: "Descrição do post é obrigatório" })
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
      (files) => allowedTypes.includes(files?.[0]?.type), "O arquivo deve ser do tipo PNG, JPEG, JPG, MP4 ou MOV."
    )
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE_MB * 1024 * 1024,
      `O tamanho máximo do arquivo é de ${MAX_FILE_SIZE_MB} MB.`
    ),
});

export type PostFormData = z.infer<typeof postSchema>;