"use server";

import { env } from "@/constants/env";
import { getTokens } from "./authTokens";

export async function serverFetch<T = any>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<T> {
  const { access_token } = await getTokens();
  const headers = new Headers(init?.headers);

  if (access_token && input !== "auth/refresh-token") {
    headers.set("Authorization", `Bearer ${access_token}`);
  }

  if (
    init?.body &&
    !(init.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  let response: Response;
  try {
    // console.log(`serverFetch: Requesting ${env.server}${input}`);
    // console.log(`${env.server}${input}`, {
    //   ...init,
    //   headers,
    // });

    response = await fetch(`${env.server}${input}`, {
      ...init,
      headers,
    });
  } catch (networkError: any) {
    // console.error(
    //   `serverFetch: API error - Status 500 for ${env.server}${input}`
    // );
    throw new Error(
      `Erro de rede: ${networkError.message || "Serviço indisponível"}`
    );
  }

  // console.log(response);

  if (!response.ok) {
    // console.error(
    //   `API error - Status ${response.status} - ${response.statusText} - ${response.url}`
    // );

    let errorData = await response.json();

    throw new Error(errorData.message);
  }

  // console.log(`serverFetch: Request successful`);
  return await response.json();
}
