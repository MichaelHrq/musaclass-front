"use server";

import { api } from "@/constants/api";
import { currency } from "@/lib/currency";
import { serverFetch } from "@/lib/fetch";
import { phoneFormat } from "@/lib/format";
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
  };
};

export async function getAnuncioInfos(id: string) {
  const resp = await serverFetch<getAnuncioInfosType>(
    `${api.anunc.getAnuncioDadosById}/${id}`
  );

  const isComb = resp.meta.cache_acompanhante === "A Combinar";
  const cache = Number(resp.meta.cache_acompanhante.replace(/\D/g, "")) / 100;

  return {
    edit: {
      post_id: resp.post_id.toString(),
      novoatendimento_acompanhante: isValidJson(
        resp.meta.novoatendimento_acompanhante
      ),
      cache_acompanhante: isComb ? undefined : cache,
      combinar: isComb ? true : false,
      cartao_acompanhante: resp.meta.cartao_acompanhante,
      novoaltura_acompanhante: resp.meta.novoaltura_acompanhante,
      novopeso_acompanhante: resp.meta.novopeso_acompanhante,
      quadril_acompanhante: resp.meta.quadril_acompanhante,
      novopes_acompanhante: resp.meta.novopes_acompanhante,
      whatsapp_acompanhante: format(
        resp.meta.whatsapp_acompanhante.replace(/\D/g, ""),
        phoneFormat
      ),
      novoacompanha_acompanhante: isValidJson(
        resp.meta.novoacompanha_acompanhante
      ),
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
      data.novoatendimento_acompanhante
    ),
    cache_acompanhante: data.combinar
      ? "A Combinar"
      : currency(data.cache_acompanhante!),
    novoacompanha_acompanhante: JSON.stringify(data.novoacompanha_acompanhante),
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
      }
    );
    return {
      sucess: true,
      message: "Anúncio atualizado com sucesso",
    };
  } catch (error: any) {
    console.log(Object.entries(error));
    return {
      sucess: false,
      message: "Falha em atualizar anúncio",
    };
  }
});

[
  {
    id: "d9e42174-52b2-4e17-8a65-8019a12084d5",
    type: "App\\Notifications\\PostReprovado",
    notifiable_type: "App\\Models\\User",
    notifiable_id: "01989ec2-7c44-70e1-99a5-a07ac8a65263",
    data: {
      post_id: 137,
      motivo:
        "Aenean eu scelerisque sapien. Aliquam porta sit amet diam at elementum. Duis eu tellus in nisl vestibulum volutpat. Aliquam erat volutpat. Curabitur nec lorem dui. Praesent in lacus quis mi feugiat accumsan. Ut et turpis a lorem accumsan scelerisque.",
    },
    read_at: null,
    created_at: "2025-08-13T16:11:34.000000Z",
    updated_at: "2025-08-13T16:11:34.000000Z",
  },
];

export type getFeedType = {
  id: number;
  user_id: string;
  titulo: string;
  post: string;
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

export const getFeedAction = async (anuncio: string) => {
  try {
    const resp = await serverFetch(`${api.anunc.getFeedByAnuncio}/${anuncio}`);
    return resp.data as getFeedType[];
  } catch (error) {
    return [];
  }
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
  }
);

export const deleteFeedAction = withAuth(async (idfeed: number) => {
  try {
    await serverFetch(`${api.anunc.deleteFeed}/${idfeed}`, {
      method: "delete",
    });
    return {
      sucess: true,
      message: "Feed deletado com sucesso",
    };
  } catch (error: any) {
    return {
      sucess: false,
      message: error.message ?? "Falha em deletar feed",
    };
  }
});
