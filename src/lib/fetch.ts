"use server";

import { env } from "@/locales/env";
import { getTokens } from "./authTokens";
import { ApiError } from "./api-error";

export async function serverFetch<T = any>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<T> {
  const { access_token, refresh_token } = await getTokens();

  const headers = new Headers(init?.headers);

  if (access_token) {
    headers.set("Authorization", `Bearer ${access_token}`);
    headers.set(
      "Cookie",
      `access_token=${access_token};refresh_token=${refresh_token}`
    );
  }

  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let response: Response;
  try {
    console.log(`serverFetch: Requesting ${env.server}${input}`);
    response = await fetch(`${env.server}${input}`, {
      ...init,
      headers,
    });
  } catch (networkError: any) {
    throw new ApiError(
      503,
      `Erro de rede: ${networkError.message || "Serviço indisponível"}`
    );
  }

  if (!response.ok) {
    console.error(`serverFetch: API error - Status ${response.status} for ${response.url}`);
    let errorMessage = `Erro na API: ${
      response.statusText || "Resposta inválida"
    }`;

    const errorData = await response.json();

    console.log(errorData)

    throw new ApiError(response.status, errorMessage, errorData);
  }

   return await response.json();
}
