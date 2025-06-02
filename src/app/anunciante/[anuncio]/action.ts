"use server";

import { phoneFormat } from "@/lib/format";
import { format } from "@react-input/mask";
import { getAnunciosAction } from "../action";
import { serverFetch } from "@/lib/fetch";
import { api } from "@/locales/api";
import { AnuncioType } from "@/schema/anuncio";
import withAuth from "@/lib/withAuth";

export async function getAnuncioId(id: string) {
  const anuncios = await getAnunciosAction();
  return anuncios.find((item) => item.id.toString() === id);
}

type getAnuncioInfosType = {
  post_id: number;
  meta: {
    whatsapp_acompanhante: string;
    novoatendimento_acompanhante: string[];
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
  return {
    post_id: resp.post_id.toString(),
    telefone: format(
      resp.meta.whatsapp_acompanhante.replace(/\D/g, ""),
      phoneFormat
    ),
    local: resp.meta.novoatendimento_acompanhante,
    cache: resp.meta.cache_acompanhante,
    cartao: resp.meta.cartao_acompanhante,
    altura: resp.meta.novoaltura_acompanhante,
    peso: resp.meta.novopeso_acompanhante,
    manequim: resp.meta.quadril_acompanhante,
    pes: resp.meta.novopes_acompanhante,
    acompanha: resp.meta.novoacompanha_acompanhante.map((item) => ({
      value: item,
      label: item,
    })),
  };
}

// export async function updateDadosAnuncio(data: AnuncioType) = withAuth()

export const updateDadosAnuncio = withAuth(async (data: AnuncioType) => {
  const submit = {
    ...data,
    acompanha: data.acompanha.map((item) => item.value),
  };

  try {
    const resp = await serverFetch<getAnuncioInfosType>(
      `${api.anunc.getAnuncioDadosById}/${data.post_id}`,
      {
        method: "post",
        body: JSON.stringify(submit),
      }
    );
  } catch (error: any) {
    console.log(Object.entries(error));
  }
});
