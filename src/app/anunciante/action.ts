"use server";

import { api } from "@/constants/api";
import { serverFetch } from "@/lib/fetch";
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
