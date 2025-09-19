"use server";

import { api } from "@/constants/api";
import { clearTokens, setTokens, Tokens } from "@/lib/authTokens";
import { serverFetch } from "@/lib/fetch";
import jwtDecode from "@/lib/jwtDecode";
import { redirect } from "next/navigation";

export async function loginAction(data: string) {
  let access_token: string;
  try {
    const tokens = await serverFetch(api.auth.login, {
      method: "post",
      body: data,
    });
    access_token = tokens.access_token;
    await setTokens({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    });
  } catch (error: any) {
    return {
      success: false,
      message: error.message ?? "Falha ao tentar fazer login",
      redirect: "#",
    };
  }

  const { role } = jwtDecode(access_token!);

  if (!role || (role !== "admn" && role !== "anct")) {
    await clearTokens();
    return {
      success: false,
      message: "Falha ao tentar fazer login",
      redirect: "#",
    };
  }

  if (role === `admn`) {
    return {
      success: true,
      message: "Login realizado com sucesso!",
      redirect: "/gestao",
    };
  }

  if (role === `anct`) {
    return {
      success: true,
      message: "Login realizado com sucesso!",
      redirect: "/anunciante",
    };
  }

  await clearTokens();

  return {
    success: false,
    message: "Falha ao tentar fazer login",
    redirect: "#",
  };
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

export async function logoutAction(route = "/login") {
  await clearTokens();
  redirect(route);
}
