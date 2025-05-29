"use server";

import { serverFetch } from "@/lib/fetch";
import withAuth from "@/lib/withAuth";
import { api } from "@/locales/api";
import { AnuncioType } from "../gestao/anunciante/type";

// type getAnunciosType = {
//   id: number;
//   title: string;
//   status: string;
//   vencimento: string;
//   url: string | false;
// };

export const getAnunciosAction = withAuth(async (): Promise<AnuncioType[]> => {
  const resp = await serverFetch<AnuncioType[]>(api.anunc.getAnuncios, {
    method: "GET",
    next: {
      tags: ["anuncios"],
      revalidate: 3600,
    },
  });

  if (!resp) {
    throw new Error("Failed to fetch anuncios");
  }

  return resp;
});
