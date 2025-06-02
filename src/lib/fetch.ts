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
    let errorData: any = null;

    try {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        errorData = await response.json();
        errorMessage =
          errorData?.message ||
          errorData?.error?.message ||
          errorData?.error ||
          errorMessage;
      } else {
        // Tenta ler como texto se não for JSON (ex: HTML de erro do servidor)
        const textError = await response.text();
        if (textError) {
          errorMessage = textError; // Use o texto do erro se disponível e não vazio
        }
      }
    } catch (e) {
      // Falhou ao analisar o corpo da resposta de erro, mantém a mensagem baseada no statusText
      console.error("serverFetch: Could not parse error response body -", e);
    }
    throw new ApiError(response.status, errorMessage, errorData);
  }

  // Trata respostas 204 No Content, que não têm corpo e fariam response.json() falhar
  if (response.status === 204) {
    console.log(`serverFetch: Received 204 No Content for ${response.url}`);
    return undefined as T; // Ou null, dependendo do que você espera para T em um 204
  }

  try {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      console.log(`serverFetch: Successfully received JSON for ${response.url}`);
      return (await response.json()) as T;
    } else {
      console.log(`serverFetch: Response OK but not JSON for ${response.url}. Content-Type: ${contentType}. Returning text.`);
      // Se a resposta for bem-sucedida mas não JSON, você pode querer retornar o texto
      // ou lançar um erro se JSON for estritamente esperado.
      // Se T pode ser string, isso pode funcionar:
      // return await response.text() as T;
      // Por enquanto, vamos assumir que se não for JSON, é um formato inesperado para uma API que deveria retornar dados.
      throw new ApiError(
        200,
        `Formato de resposta inesperado. Esperado JSON, mas recebido: ${
          contentType || "não especificado"
        }`
      );
    }
  } catch (jsonParseError: any) {
    console.log(`serverFetch: Failed to parse successful response body as JSON for ${response.url} -`, jsonParseError);
    throw new ApiError(
      500,
      `Falha ao analisar dados da resposta: ${jsonParseError.message}`
    );
  }
}
