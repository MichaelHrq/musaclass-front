"use server";

import { api } from "@/constants/api";
import { currency } from "@/lib/currency";
import { serverFetch } from "@/lib/fetch";
import { phoneDDDFormat, phoneFormat } from "@/lib/format";
import { isValidJson } from "@/lib/isJson";
import withAuth from "@/lib/withAuth";
import { AnuncioType } from "@/schema/anuncio";
import { format } from "@react-input/mask";
import { getAnunciosAction } from "../action";

export async function getAnuncioId(id: string) {
  const anuncios = await getAnunciosAction();
  return anuncios.find((item) => item.id.toString() === id);
}

type getAnuncioInfosType = {
  post_id: number;
  titulo: string;
  url: string | false;
  meta: {
    whatsapp_acompanhante: string;
    novoatendimento_acompanhante: string[] | string;
    cache_acompanhante: string;
    cartao_acompanhante: string;
    novoaltura_acompanhante: string;
    novopeso_acompanhante: string;
    quadril_acompanhante: string;
    novopes_acompanhante: string;
    novoacompanha_acompanhante: string[];
    ddi_acompanhante: string;
    novoaltura_esconder: any;
    novopeso_esconder: any;
    quadril_esconder: any;
    novopes_esconder: any;
  };
};

export async function getAnuncioInfos(id: string) {
  const resp = await serverFetch<getAnuncioInfosType>(
    `${api.anunc.getAnuncioDadosById}/${id}`,
  );

  const cache = Number(resp.meta.cache_acompanhante.replace(/\D/g, "")) / 100;

  return {
    edit: {
      post_id: resp.post_id.toString(),
      novoatendimento_acompanhante:
        resp.meta.novoatendimento_acompanhante.length > 0
          ? isValidJson(resp.meta.novoatendimento_acompanhante)
          : [],
      cache_acompanhante: cache,
      cartao_acompanhante: resp.meta.cartao_acompanhante,
      novoaltura_acompanhante: resp.meta.novoaltura_acompanhante,
      novopeso_acompanhante: resp.meta.novopeso_acompanhante,
      quadril_acompanhante: resp.meta.quadril_acompanhante,
      novoaltura_esconder: !!Number(resp.meta.novoaltura_esconder),
      novopeso_esconder: !!Number(resp.meta.novopeso_esconder),
      quadril_esconder: !!Number(resp.meta.quadril_esconder),
      novopes_esconder: !!Number(resp.meta.novopes_esconder),
      novopes_acompanhante: resp.meta.novopes_acompanhante,
      whatsapp_acompanhante: format(
        resp.meta.whatsapp_acompanhante.replace(/\D/g, ""),
        phoneFormat,
      ),
      ddi_acompanhante: format(
        resp.meta.ddi_acompanhante.replace(/\D/g, ""),
        phoneDDDFormat,
      ),
      novoacompanha_acompanhante:
        resp.meta.novoacompanha_acompanhante.length > 0
          ? isValidJson(resp.meta.novoacompanha_acompanhante)
          : [],
    },
    infos: {
      titulo: resp.titulo,
      url: resp.url,
    },
  };
}

export const updateDadosAnuncio = withAuth(async (data: AnuncioType) => {
  const submit = {
    ...data,
    novoatendimento_acompanhante: JSON.stringify(
      data.novoatendimento_acompanhante,
    ),
    cache_acompanhante: currency(data.cache_acompanhante!),
    novoacompanha_acompanhante: JSON.stringify(data.novoacompanha_acompanhante),
    novoaltura_esconder: data.novoaltura_esconder ? 1 : 0,
    novopeso_esconder: data.novopeso_esconder ? 1 : 0,
    quadril_esconder: data.quadril_esconder ? 1 : 0,
    novopes_esconder: data.novopes_esconder ? 1 : 0,
    // cache_acompanhante_esconder: data.cache_acompanhante_esconder ? 1 : 0,
  };

  try {
    await serverFetch<getAnuncioInfosType>(
      `${api.anunc.updateAnuncio}/${data.post_id}`,
      {
        method: "post",
        body: JSON.stringify(submit),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return {
      sucess: true,
      message: "Anúncio atualizado com sucesso",
    };
  } catch (error: any) {
    return {
      sucess: false,
      message: "Falha em atualizar anúncio",
    };
  }
});

export type midiaResponseType = {
  id: number;
  user_id: string;
  post: string;
  ativo: boolean;
  publicado_em: string;
  post_id: number;
  publish: string;
  tipo: string;
  expires_at: string;
  tipo_arquivo: string;
  notifications: {
    id: string;
    data: {
      motivo: string;
    };
  }[];
  anunciante: {
    id: string;
  };
  midia: {
    id: number;
    feed_id: number;
    midia: string;
    url: string;
    tipo: string;
  }[];
};

export type getMidiasResponseType = {
  aprovado: {
    imagem: midiaResponseType[];
    video: midiaResponseType[];
  };
  reprovado: {
    imagem: midiaResponseType[];
    video: midiaResponseType[];
  };
  pendente: {
    imagem: midiaResponseType[];
    video: midiaResponseType[];
  };
};

export type getFeedDataType = {
  id: number;
  user_id: string;
  titulo: string;
  post: string;
  tipo: string;
  midia_path_master: string;
  midia_path_thumbnail1: string;
  midia_path_thumbnail2: string;
  ativo: boolean;
  publish: string;
  publicado_em: string; // 30/07/2025 14:03:47
  anunciante: any;
  notifications: {
    id: string;
    data: {
      motivo: string;
    };
  }[];
  midia: {
    id: number;
    feed_id: number;
    midia: string;
    url: string;
    tipo: string;
  }[];
};

export type getFeedType = {
  total: number;
  last_page: number;
  current_page: number;
  data: getFeedDataType[];
};

export const getFeedAction = async ({ anuncio }: { anuncio: string }) => {
  return await serverFetch<getMidiasResponseType>(
    `${api.anunc.getFeedByAnuncio}/${anuncio}`,
  );
};

export const createFeedAction = withAuth(
  async (data: FormData, anuncio: string) => {
    try {
      await serverFetch(`${api.anunc.craeteFeed}`, {
        method: "post",
        body: data,
      });
      return {
        sucess: true,
        message: "Feed salvo com sucesso",
      };
    } catch (error: any) {
      return {
        sucess: false,
        message: error.message ?? "Falha em salvar feed",
      };
    }
  },
);

export const deleteMidiaAction = withAuth(async (idfeed: number) => {
  try {
    await serverFetch(`${api.anunc.deleteMidia}/${idfeed}`, {
      method: "delete",
    });
    return {
      sucess: true,
    };
  } catch (error: any) {
    return {
      sucess: false,
    };
  }
});

export const reOrderMidiaAction = withAuth(
  async (anuncio: string, reorder: number[], type: string, status: string) => {
    try {
      await serverFetch(`${api.anunc.reorderMidias}`, {
        method: "post",
        body: JSON.stringify({
          anuncio: anuncio,
          ordem: reorder,
          tipo: type,
          status: status,
        }),
      });
      return {
        success: true,
        message: "Mídias reordenadas com sucesso",
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Erro ao reordenar mídias",
      };
    }
  },
);
