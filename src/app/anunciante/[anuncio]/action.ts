"use server";

import { phoneFormat } from "@/lib/format";
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
  const resp = await fetch(
    `https://musaclass.com.br/wp-json/anuncios/v1/anuncio/${id}/dados`
  );
  const infos: getAnuncioInfosType = await resp.json();
  return {
    post_id: infos.post_id.toString(),
    telefone: format(
      infos.meta.whatsapp_acompanhante.replace(/\D/g, ""),
      phoneFormat
    ),
    local: infos.meta.novoatendimento_acompanhante,
    cache: infos.meta.cache_acompanhante,
    cartao: infos.meta.cartao_acompanhante,
    altura: infos.meta.novoaltura_acompanhante,
    peso: infos.meta.novopeso_acompanhante,
    manequim: infos.meta.quadril_acompanhante,
    pes: infos.meta.novopes_acompanhante,
    acompanha: infos.meta.novoacompanha_acompanhante.map((item) => ({
      value: item,
      label: item,
    })),
  };
}
