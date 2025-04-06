"use server";

import { createSession, deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";

export async function loginAction(data: FormData) {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  if (
    data.get("email") !== "michaelhrqfs@gmail.com" ||
    data.get("password") !== "321654"
  ) {
    return { success: false, message: "E-mail ou senha está incorreto!" };
  }

  const sessionId = Math.random().toString(36).substring(2, 15);
  await createSession({ sessionId });
  // return { success: true, message: "Login realizado com sucesso!", redirect: '/gestao' };
  return { success: true, message: "Login realizado com sucesso!", redirect: '/anunciante' };
}

export async function logoutAction() {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  await deleteSession();
  redirect("/");
}
