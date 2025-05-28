"use server";

import { env } from "@/locales/env";
import { getTokens } from "./authTokens";

class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
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

    console.log(response)

    if (!response.ok) {
      console.log(await response.json())
      console.log(await response.text())
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(response?.status, response?.statusText, errorData);
    }

    return await response.json();
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(error?.status, error?.message, error?.data);
  }
}
