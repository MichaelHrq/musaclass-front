"use server";

import { api } from "@/constants/api";
import postagens from "@/db/postagens.json";
import { serverFetch } from "@/lib/fetch";
import withAuth from "@/lib/withAuth";

export type getDataMidiaPostagensType = {
  id: number;
  feed_id: number;
  midia: string;
  url: string;
  tipo: "image" | "video";
};

export type getDataPostagensType = {
  id: number;
  user_id: string;
  post: string;
  ativo: true;
  publicado_em: string;
  post_id: string;
  publish: "Pendente" | "Aprovado" | "Reprovado";
  anunciante: { id: string };
  midia: getDataMidiaPostagensType[];
};

export type getPostagensType = {
  total: number;
  last_page: number;
  current_page: number;
  data: getDataPostagensType[];
};

export async function getPostagensAction({ pageParam = 1 }: { pageParam?: number }) {
  return await serverFetch<getPostagensType>(
    `${api.gestao.dashboard}?page=${pageParam}`
  );
}

export const aprovarFeedAction = withAuth(async (id: number) => {
  try {
    await serverFetch(`${api.gestao.aprovarFeed}/${id}`, {
      method: "POST",
      body: JSON.stringify({ publish: "Aprovado" }),
    });
    return {
      success: true,
      message: "Feed aprovado com sucesso",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message ?? "Falha ao tentar aprovar o feed",
    };
  }
});

export const reprovarFeedAction = withAuth(
  async (id: number, motivo: string) => {
    try {
      await serverFetch(`${api.gestao.aprovarFeed}/${id}`, {
        method: "POST",
        body: JSON.stringify({ motivo, publish: "Reprovado" }),
      });
      return {
        success: true,
        message: "Feed reprovado com sucesso",
      };
    } catch (error: any) {
      console.log(error);
      return {
        success: false,
        message: error.message ?? "Falha ao tentar reprovado o feed",
      };
    }
  }
);
