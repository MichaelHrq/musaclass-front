"use server";

import { setTokens, Tokens } from "@/lib/authTokens";
import { serverFetch } from "@/lib/fetch";
import jwtDecode from "@/lib/jwtDecode";
import { api } from "@/locales/api";

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

    console.log(role)

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
      message: error.?data?.message ?? `Falha em realizar login`,
      sucess: false,
      redirect: `#`,
    };
  }
}

export async function createAnuncAction(data: string) {
  const resp = await serverFetch(
    api.auth.create,
    {
      method: "post",
      body: data,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  console.log(resp)
  try {
    return {
      message: `Cadastro realizado com sucesso!`,
      sucess: true,
      redirect: `#`,
    };
  } catch (error: any) {
    console.log(Object.entries(error))
    return {
      message: error.?data?.message ?? `Falha em realizar login`,
      sucess: false,
      redirect: `#`,
    };
  }
}
