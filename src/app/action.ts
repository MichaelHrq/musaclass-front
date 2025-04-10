"use server";

import { fetchApi } from "@/lib/fetch";
import { deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";

export async function loginAction(data: FormData) {
  const path = process.env.NEXT_PUBLIC_SERVER + "auth/login";

  const response = await fetchApi({
    route: path,
    method:"POST",
    body: data,
  })

  return {
    status: response.status,
    error: response.error,
    data: response.data
  };
}

export async function logoutAction() {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  await deleteSession();
  redirect("/");
}
