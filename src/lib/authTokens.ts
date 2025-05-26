"use server";

import { api } from "@/locales/api";
import { env } from "@/locales/env";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decryptData, encryptData } from "./encryption";
import { serverFetch } from "./fetch";
import jwtDecode from "./jwtDecode";

export type Tokens = {
  access_token: string | undefined;
  refresh_token: string | undefined;
};

export async function getTokens(): Promise<Tokens> {
  const cookieStore = await cookies();
  const encryptedTokens = cookieStore.get(env.token!)?.value;
  if (!encryptedTokens) {
    return { access_token: undefined, refresh_token: undefined };
  }
  try {
    return JSON.parse(decryptData(encryptedTokens));
  } catch (error) {
    console.error("Failed to decrypt/parse tokens", error);
    return { access_token: undefined, refresh_token: undefined };
  }
}

export async function setTokens(tokens: Tokens) {
  "use server";
  (await cookies()).set({
    name: env.token!,
    value: encryptData(JSON.stringify(tokens)),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    sameSite: "strict",
  });
}

export async function clearTokens() {
  "use server";
  (await cookies()).set({
    name: env.token!,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });
  redirect(`/?error=unauthorized`);
}

export async function refreshToken() {
  "use server";
  const { access_token, refresh_token } = await serverFetch<Tokens>(
    api.auth.refresh,
    { method: "post" }
  );
  await setTokens({ access_token, refresh_token });
}

export async function isTokenExpired(): Promise<boolean> {
  const { access_token } = await getTokens();
  if (!access_token) return true;
  try {
    const { exp } = jwtDecode(access_token);
    if (!exp) return true;
    const nowWithBuffer = Date.now() + 5 * 60 * 1000;
    return exp * 1000 < nowWithBuffer;
  } catch {
    return true;
  }
}
