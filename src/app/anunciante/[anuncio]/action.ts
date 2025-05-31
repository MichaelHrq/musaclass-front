"use server";

import { getAnunciosAction } from "../action";

export async function getAnuncioId(id: string) {
  const anuncios = await getAnunciosAction();
  return anuncios.find((item) => item.id.toString() === id);
}

export async function getAnuncioInfos(id: string) {
  const resp = await fetch(
    `https://musaclass.com.br/wp-json/anuncios/v1/anuncio/${id}/dados`
  );

  return await resp.json();
}
