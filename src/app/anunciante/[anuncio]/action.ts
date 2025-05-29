'use server'

import { AnuncioType } from "@/app/gestao/anunciante/type";
import { serverFetch } from "@/lib/fetch";
import { api } from "@/locales/api";


export async function getAnuncioId(id: string) : Promise<AnuncioType | null> {

    const res = await serverFetch(`${api.anunc.getAnuncioById}${id}`)

    console.log(res);

    const DATA = [
      { id: 1, title: "Anúncio 1", status: "ativo", vencimento: "2025-10-01", url: false },
      { id: 2, title: "Anúncio 2", status: "pendente", vencimento: "2025-11-01", url: false },
      { id: 3, title: "Anúncio 3", status: "ativo", vencimento: "2025-12-01", url: false },
      { id: 4, title: "Anúncio 4", status: "recusado", vencimento: "2025-10-15", url: false },
      { id: 5, title: "Anúncio 5", status: "ativo", vencimento: "2025-11-15", url: false },
    ];

    return DATA.find(item => item.id === Number(id)) || null;
}