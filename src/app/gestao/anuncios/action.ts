"use server";

import { getAnuncioInfos } from "@/app/anunciante/[anuncio]/action";
import { api } from "@/constants/api";
import { serverFetch } from "@/lib/fetch";
import withAuth from "@/lib/withAuth";

export type anuncianteType = {
  id: number;
  title: string;
  link: string;
  thumb: string;
  foto1: string;
};

export type getAllAnunciosType = {
  id: string;
  name: string;
  slug: string;
  url: string;
  total: number;
  anunciantes: anuncianteType[];
};

export const getAllAnuncios = withAuth(async () => {
  const resp = await fetch(
    "https://musaclass.com.br/wp-json/musaclass/v1/menu-cidades",
  );

  const data = await resp.json();

  return data;
});

export type getImagesPostAnuncioByIdType = {
  id: number;
  medium: string;
  menu_order: number;
  thumb: string;
  url: string;
};

export const getImagesPostAnuncioById = withAuth(
  async (id: string): Promise<getImagesPostAnuncioByIdType[]> => {
    const resp = await serverFetch(api.gestao.anuncioImagens + `/${id}`);
    return resp.items;
  },
);

export const getPostAnuncioInfosById = withAuth(async (id: string) => {
  const [imagens, form] = await Promise.all([
    getImagesPostAnuncioById(id),
    getAnuncioInfos(id),
  ]);

  return {
    imagens,
    form,
  };
});

export const reorderImagensAnuncio = withAuth(
  async (id: string, reorder: number[]) => {
    try {
      const res = await serverFetch(
        api.gestao.anuncioImagens + `/${id}/reorder`,
        {
          body: JSON.stringify({ ordered_ids: reorder }),
          method: "POST",
        },
      );
      return {
        success: true,
        message: "Imagens ordenadas com sucesso",
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Falha ao tentar reordenar imagens",
      };
    }
  },
);

export const uploadImagesAnuncio = withAuth(
  async (formData: FormData, id: string) => {
    try {
      await serverFetch(`${api.gestao.anuncioImagens}/upload/${id}`, {
        body: formData,
        method: "POST",
      });
      return {
        success: true,
        message: "Imagens importadas com sucesso",
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Falha ao tentar importar imagens",
      };
    }
  },
);

export const deleteImagesAnuncio = withAuth(
  async (idPost: string, idImage: number) => {
    try {
      await serverFetch(
        `${api.gestao.anuncioImagens}/${idPost}/delete/${idImage}`,
        {
          method: "DELETE",
        },
      );
      return {
        success: true,
        message: "Imagem excluída com sucesso",
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Falha ao tentar excluir imagem",
      };
    }
  },
);
