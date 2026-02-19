"use server";

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

export type getVideosPostAnuncioByIdType = {
  id: number;
  name: string;
  thumbnail: string;
  url: string;
};

export const getVideosPostAnuncioById = withAuth(
  async (id: string): Promise<getVideosPostAnuncioByIdType[]> => {
    const resp = await serverFetch(`${api.gestao.anuncioVideos}/${id}`);
    return (resp.items ?? []).map((item: any, index: number) => ({
      ...item,
      id: index + 1,
    }));
  },
);

export type taxonomiaType = {
  term_id: number;
  name: string;
  slug: string;
  term_group: 0;
  term_taxonomy_id: number;
  taxonomy: string;
  description: string;
  parent: number;
  count: number;
  filter: string;
};

export type getAdminFormAnucioMetaType = {
  dtensaio_acompanhante: string;
  telegram_acompanhante: string;
  nomeoriginal_acompanhante: string;
  novoidade_acompanhante: string;
  novofotos_acompanhante: string;
  obs_acompanhante: string;
  estreia_acompanhante: string;
  termino_acompanhante: string;
  ultimos: "1";
  comvideo: "1";
  post_id: string;
  ddi_acompanhante: string;
  whatsapp_acompanhante: string;
  novoatendimento_acompanhante: string[];
  cartao_acompanhante: string;
  novoacompanha_acompanhante: string[];
  cache_acompanhante?: string | null | undefined;
  novoaltura_acompanhante?: string | undefined;
  novopeso_acompanhante?: string | undefined;
  quadril_acompanhante?: string | undefined;
  novopes_acompanhante?: string | undefined;
};

export type getAdminFormAnucioType = {
  id: number;
  titulo: string;
  status: string;
  meta: getAdminFormAnucioMetaType;
  taxonomias: {
    secao: taxonomiaType[];
    cidadevirtual: taxonomiaType[];
    cidade: taxonomiaType[];
  };
};

export const getFormPostAnuncioById = withAuth(
  async (id: string): Promise<getAdminFormAnucioType> => {
    return await serverFetch(`${api.gestao.anucioPost}/${id}`);
  },
);

export const updateFormPostAnuncioById = withAuth(
  async (id: string, data:any) => {
    try {
      const res = await serverFetch(
        api.gestao.anucioPostUpdate + `/${id}`,
        {
          body: JSON.stringify(data),
          method: "POST",
        },
      );
      return {
        success: true,
        message: "Anúncio atualizado com sucesso",
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Falha ao tentar atualizar anúncio",
      };
    }
  },
);

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

export const reorderVideosAnuncio = withAuth(
  async (id: string, ordem: string[]) => {
    try {
      const res = await serverFetch(
        api.gestao.anuncioVideos + `/reorder/${id}`,
        {
          body: JSON.stringify({ ordem }),
          method: "POST",
        },
      );
      return {
        success: true,
        message: "Vídeos ordenados com sucesso",
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Falha ao tentar reordenar vídeos",
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

export const uploadVideosAnuncio = withAuth(
  async (formData: FormData, id: string) => {
    try {
      await serverFetch(`${api.gestao.anuncioVideos}/upload/${id}`, {
        body: formData,
        method: "POST",
      });
      return {
        success: true,
        message: "Vídeos importados com sucesso",
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Falha ao tentar importar vídeos",
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

export const deleteVideosAnuncio = withAuth(
  async (idPost: string, idVideo: string) => {
    try {
      await serverFetch(
        `${api.gestao.anuncioVideos}/delete/${idPost}`,
        {
          method: "delete",
          body: JSON.stringify({ url: idVideo }),
        },
      );
      return {
        success: true,
        message: "Vídeo excluído com sucesso",
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Falha ao tentar excluir vídeo",
      };
    }
  },
);
