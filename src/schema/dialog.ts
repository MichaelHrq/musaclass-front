import { z } from "zod";

export const reprovarSchema = z.object({
    motivo: z
      .string()
      .nonempty("Texto ")
      .trim()
  });