"use server";

import { api } from "@/constants/api";
import { serverFetch } from "@/lib/fetch";
import { ResetType } from "@/schema/esqueci-senha";

export const changePasswordAction = async (data: ResetType) => {
  try {
    await serverFetch(api.auth.change, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return {
      success: true,
      message: "Senha alterada com sucesso!",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message ?? "Erro ao tentar alterar senha",
    };
  }
};
