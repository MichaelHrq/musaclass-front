"use server";

import { createSession, deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";

export async function loginAction(data: FormData) {
  await new Promise((res) => setTimeout(res, 2000));

  if (
    data.get("email") !== "michaelhrqfs@gmail.com" ||
    data.get("password") !== "321654"
  ) {
    return { success: false, message: "E-mail ou senha está incorreto!" };
  }

  console.log('logando...')

  const sessionId = [...crypto.getRandomValues(new Uint8Array(255))]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  await createSession({ sessionId });
  redirect("/anunciante");
}

export async function logoutAction() {
  await new Promise((res) => setTimeout(res, 2000));
  await deleteSession();
  redirect("/");
}
