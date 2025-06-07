"use server";

import { serverFetch } from "@/lib/fetch";
import { phoneFormat } from "@/lib/format";
import { isValidJson } from "@/lib/isJson";
import withAuth from "@/lib/withAuth";
import { api } from "@/locales/api";
import { AnuncioType } from "@/schema/anuncio";
import { format } from "@react-input/mask";
import { getAnunciosAction } from "../action";

export async function getAnuncioId(id: string) {
  const anuncios = await getAnunciosAction();
  return anuncios.find((item) => item.id.toString() === id);
}

type getAnuncioInfosType = {
  post_id: number;
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

  console.log(resp);

  return {
    post_id: resp.post_id.toString(),
    novoatendimento_acompanhante: isValidJson(
      resp.meta.novoatendimento_acompanhante
    ),
    cache_acompanhante: resp.meta.cache_acompanhante,
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
    ).map((item: any) => ({
      value: item,
      label: item,
    })),
  };
}

// export async function updateDadosAnuncio(data: AnuncioType) = withAuth()

export const updateDadosAnuncio = withAuth(async (data: AnuncioType) => {
  const submit = {
    ...data,
    novoatendimento_acompanhante: JSON.stringify(
      data.novoatendimento_acompanhante
    ),
    novoacompanha_acompanhante: JSON.stringify(
      data.novoacompanha_acompanhante.map((item) => item.value)
    ),
  };

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
