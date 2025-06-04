"use server";

import { serverFetch } from "@/lib/fetch";
import { api } from "@/locales/api";
import { AnuncioType } from "../gestao/anunciante/type";

export const getAnunciosAction = async (): Promise<AnuncioType[]> => {
  try {
      const resp = await serverFetch<AnuncioType[]>(api.anunc.getAnuncios);

  if (!resp) {
    throw new Error("Failed to fetch anuncios");
  }

  return resp;
  } catch (error: any) {
    console.log(Object.entries(error))
    return [] as AnuncioType[]
  }

};
