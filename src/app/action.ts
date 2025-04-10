"use server";

import fetchApi from "@/lib/fetch";
import { createSession, deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";

export async function loginAction(data: FormData) {
  try {
    const path = process.env.NEXT_PUBLIC_SERVER + "auth/login";
    await fetchApi({
      route: path,
      method: "POST",
      body: data,
      next: {revalidate: 60}
    })
    return {
      success: true,
      message: "Login realizado com sucesso!",
      redirect: "/anunciante",
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Credenciais inválidas" };
  }
}

export async function logoutAction() {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  await deleteSession();
  redirect("/");
}
