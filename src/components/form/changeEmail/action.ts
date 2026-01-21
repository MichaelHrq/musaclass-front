'use server'

import { api } from "@/constants/api";
import { serverFetch } from "@/lib/fetch";
import withAuth from "@/lib/withAuth";
import { ChangeEmailType } from "@/schema/searchCpf";

export const updateEmailAnuncianteAction = withAuth(async (data: ChangeEmailType) => {
  try {
    await serverFetch(api.gestao.updateEmailAnunc, {
      method: "post",
      body: JSON.stringify(data),
    });
    return {
      success: true,
      message: 'Email do anunciante alterado com sucesso',
      data: undefined,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message ?? `Falha ao alterar email do anunciante`,
      data: undefined,
    };
  }
});