import { api } from "@/constants/api";
import { serverFetch } from "@/lib/fetch";
import withAuth from "@/lib/withAuth";

export type getApprovedMidiaType = {
  id: number;
  feed_id: number;
  midia: string;
  url: string;
  tipo: "video" | "image";
};

export type getDataApprovedMidiasByCityType = {
  id: number;
  nome: string;
  cidade: string;
  midia: getApprovedMidiaType[];
  publicado_em: string;
};

export type metaType = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};
export type getApprovedMidiasByCityType = {
  data: getDataApprovedMidiasByCityType[];
  meta: metaType;
};

export const getApprovedMidiasByCity = withAuth(async (slug: string, page:number, per_page:number) => {
  try {
    const res = await serverFetch<getApprovedMidiasByCityType>(
      `${api.gestao.getApprovedMidias}?city=${slug}&page=${page}&per_page=${per_page}`
    );
    return {
      data: res,
      success: true,
      message: "",
    };
  } catch (error) {
    return {
      data: {
        data: [],
        meta: {
          current_page: 1,
          last_page: 1,
          per_page: 1,
          total: 0,
        },
      },
      success: false,
      message: error instanceof Error ? error.message : "Erro ao buscar mídias",
    };
  }
});
