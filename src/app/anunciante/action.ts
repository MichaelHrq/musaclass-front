"use server";

import { serverFetch } from "@/lib/fetch";
import withAuth from "@/lib/withAuth";
import { api } from "@/locales/api";

const DATA = [
  {
    id: 1,
    title: "Anúncio 1",
    status: "ativo",
    vencimento: "2025-10-01",
    url: false,
  },
  {
    id: 2,
    title: "Anúncio 2",
    status: "pendente",
    vencimento: "2025-11-01",
    url: false,
  },
  {
    id: 3,
    title: "Anúncio 3",
    status: "ativo",
    vencimento: "2025-12-01",
    url: false,
  },
  {
    id: 4,
    title: "Anúncio 4",
    status: "recusado",
    vencimento: "2025-10-15",
    url: false,
  },
  {
    id: 5,
    title: "Anúncio 5",
    status: "ativo",
    vencimento: "2025-11-15",
    url: false,
  },
];

export const getAnunciosAction = withAuth(async function () {
  try {
    const resp = await serverFetch(`${api.anunc.getAnuncios}`, {
      method: "post",
      body: JSON.stringify({ cpf: "07182340305" }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(resp);

    return DATA;
  } catch (error) {
    return DATA;
  }
});
