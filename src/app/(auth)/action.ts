"use server";

import { signIn, signOut } from "@/auth";
import { fetchApi } from "@/lib/fetch";
import { api } from "@/locales/api";
import { redirect } from "next/navigation";

type LoginType = {
  email: string;
  password: string;
};

export async function loginAction(data: LoginType) {
  try {
    await signIn("credentials", { ...data, redirect: false });
    return {
      data: undefined,
      error: "Login realizado com sucesso",
      status: 200,
      sucess: false,
    };
  } catch (error: any) {
    return {
      data: undefined,
      error: error.code,
      status: error.status,
      sucess: false,
    };
  }
}

export async function logoutAction() {
  try {
    await fetchApi({
      route: api.auth.logout,
      method: "POST",
    });
    await signOut({ redirect: false });
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
  redirect("/login");
}
