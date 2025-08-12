"use server";

import { api } from "@/constants/api";
import postagens from "@/db/postagens.json";
import { serverFetch } from "@/lib/fetch";

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
  data: getDataPostagensType;
};

export default async function getPostagensAction() {
  return await serverFetch<getPostagensType>(api.gestao.dashboard);
}
