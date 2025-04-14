"use server";

import { fetchApi } from "@/lib/fetch";
import { SearchCpfType } from "@/schema/searchCpf";

export async function SearchCPF(data: SearchCpfType) {
  const cpf = `?cpf=${data.cpf.replace(/[^\d]/g, "")}`;
  const resp = await fetchApi({
    method: "GET",
    route: cpf,
  });

  if (resp.sucess) {
    return {
      success: true,
      message:
        resp.data.length === 0
          ? "Nenhum anúncio foi encontrado!"
          : "Anúncios encontrados!",
      data: resp.data,
    };
  }

  return { success: false, message: resp.error, data: undefined };
}

export async function SendEmail(data: FormData) {
  await new Promise((res) => setTimeout(res, 2000));

  if (data.get("email") === "michaelhrqfs@gmail.com") {
    return { success: true, message: "Convite enviado" };
  }
  return { success: false, message: "Erro ao enviar convite" };
}
