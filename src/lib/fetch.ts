"use server";

import { env } from "@/locales/env";
import { getTokens } from "./authTokens";

class ApiError extends Error {
  constructor(public status: number, public message: string) {
    super(message);
  }
}

export async function serverFetch<T = any>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<T> {
  const tokens = await getTokens();

  const headers = new Headers(init?.headers);
  headers.set(
    "Cookie",
    `access_token=${tokens.access_token};refresh_token=${tokens.refresh_token}`
  );

  try {
    const response = await fetch(`${env.server}${input}`, {
      ...init,
      headers,
      credentials: "include",
    });

    console.log(`response: `, response);
    console.log(`json: `, await response.json());
    console.log(`text: `, await response.text());

    if (!response.ok) {
      console.log(`json: `, await response.json());
      console.log(`text: `, await response.text());
      const errorData =
        (await response.json().catch(() => ({}))) ?? "Erro desconhecido";
      throw new ApiError(response?.status, errorData);
    }
    return await response.json();
  } catch (error: any) {
    console.log(`server fetch catch:`);
    console.log(Object.entries(error));

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      error?.status ?? 400,
      error?.data ?? "Erro desconhecido"
    );
  }
}
