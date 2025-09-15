"use server";

import { api } from "@/constants/api";
import { serverFetch } from "@/lib/fetch";
import {
  ResetType,
  SendCodeType,
  VerifyCodeType,
} from "@/schema/esqueci-senha";

export const sendCodeAction = async (data: SendCodeType) => {
  try {
    await serverFetch(api.auth.forgot.sendCode, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return {
      success: true,
      message: "Código enviado com sucesso",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message ?? "Erro ao enviar código",
    };
  }
};

export const verifyCodeAction = async (data: VerifyCodeType & SendCodeType) => {
  try {
    await serverFetch(api.auth.forgot.verifyCode, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return {
      success: true,
      message: "Código validado com sucesso",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message ?? "Erro ao tentar validar código",
    };
  }
};

export const resetPasswordAction = async (
  data: ResetType & VerifyCodeType & SendCodeType
) => {
  try {
    await serverFetch(api.auth.forgot.reset, {
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
