"use server";

import { api } from "@/constants/api";
import { clearTokens, setTokens, Tokens } from "@/lib/authTokens";
import { serverFetch } from "@/lib/fetch";
import jwtDecode from "@/lib/jwtDecode";
import { redirect } from "next/navigation";

export async function loginAction(data: string) {
  try {
    const { access_token, refresh_token } = await serverFetch<Tokens>(
      api.auth.login,
      {
        method: "post",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    await setTokens({ access_token, refresh_token });
    const { role } = jwtDecode(access_token!);

    if (role === `admn`) {
      return {
        message: "Login realizado com sucesso",
        sucess: true,
        redirect: `/gestao`,
      };
    }

    if (role === `anct`) {
      return {
        message: "Login realizado com sucesso",
        sucess: true,
        redirect: `/anunciante`,
      };
    }

    return {
      message: `Falha em realizar login`,
      sucess: false,
      redirect: `#`,
    };
  } catch (error: any) {
    return {
      message: error?.message ?? `Falha em realizar login`,
      sucess: false,
      redirect: `#`,
    };
  }
}

export async function createAnuncAction(data: string) {
  try {
    await serverFetch(api.auth.create, {
      method: "post",
      body: data,
    });
    return {
      message: `Cadastro realizado com sucesso!`,
      success: true,
    };
  } catch (error: any) {
    return {
      message: error?.message ?? `Falha em realizar login`,
      success: false,
    };
  }
}

export async function logoutAction() {
  await clearTokens();
  redirect(`/`);
}
