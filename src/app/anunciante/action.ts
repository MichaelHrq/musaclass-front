"use server";

import { api } from "@/constants/api";
import { serverFetch } from "@/lib/fetch";
import { AnuncioWPType } from "../gestao/anunciante/type";

export const getAnunciosAction = async (): Promise<AnuncioWPType[]> => {
  try {
      const resp = await serverFetch(api.anunc.getAnuncios);

  if (!resp) {
    throw new Error("Failed to fetch anuncios");
  }

  return resp.data;
  } catch (error: any) {
    console.error(error.message)
    return [] as AnuncioWPType[]
  }

};
