"use server";

import { api } from "@/constants/api";
import { serverFetch } from "@/lib/fetch";
import withAuth from "@/lib/withAuth";
import { SearchCpfType, SendEmailType } from "@/schema/searchCpf";

export const searchCpfAction = withAuth(async (data: SearchCpfType) => {
  try {
    const resp = await serverFetch(api.gestao.searchAnuncCpf, {
      method: "post",
      body: JSON.stringify({ cpf: data.cpf.replace(/[^\d]/g, "") }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(resp);
    return {
      success: true,
      message: undefined,
      data: resp,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message ?? `Falha ao buscar CPF`,
      data: undefined,
    };
  }
});

export async function SendEmail(data: SendEmailType) {
  try {
    const resp = await serverFetch(api.gestao.sendInvite, {
      method: "post",
      body: JSON.stringify({ ...data }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(resp);
    return {
      success: true,
      message: resp?.message ?? `Convite enviado com sucesso!`,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message ?? `Falha em enviar convite`,
    };
  }
}
