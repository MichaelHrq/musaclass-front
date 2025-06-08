"use server";

import { serverFetch } from "@/lib/fetch";
import { phoneFormat } from "@/lib/format";
import { isValidJson } from "@/lib/isJson";
import withAuth from "@/lib/withAuth";
import { api } from "@/locales/api";
import { AnuncioType } from "@/schema/anuncio";
import { format } from "@react-input/mask";
import { getAnunciosAction } from "../action";
import { currency } from "@/lib/currency";

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

  console.log(resp)

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

// export async function updateDadosAnuncio(data: AnuncioType) = withAuth()

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

  console.log(submit);

  try {
    const resp = await serverFetch<getAnuncioInfosType>(
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
