"use server";

import { cookies } from "next/headers";
import { env } from "@/locales/env";
import { api } from "@/locales/api";
import { serverFetch } from "./fetch";
// import { encryptData, decryptData } from "./encryption";
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
    // const decrypted = decryptData(encryptedTokens);
    return JSON.parse(encryptedTokens) as Tokens;
  } catch (error) {
    // console.error("Failed to decrypt/parse tokens in getTokens:", error);
    await clearTokensOnError();
    return { access_token: undefined, refresh_token: undefined };
  }
}

export async function setTokens(tokens: Tokens): Promise<void> {
  if (!tokens.access_token || !tokens.refresh_token) {
    // console.warn("Attempted to set invalid tokens:", tokens);
    await clearTokens();
    return;
  }
  (await cookies()).set({
    name: env.token!,
    // value: encryptData(JSON.stringify(tokens)),
    value: JSON.stringify(tokens),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 dias
    path: "/",
    sameSite: "strict",
  });
}

export async function setTokensTeste(teste: string): Promise<void> {
  (await cookies()).set({
    name: `teste`,
    value: teste,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 dias
    path: "/",
    sameSite: "strict",
  });
}

export async function clearTokens(): Promise<void> {
  (await cookies()).set({
    name: env.token!,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });
}

async function clearTokensOnError(): Promise<void> {
  (await cookies()).set({
    name: env.token!,
    value: "",
    maxAge: 0,
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
}

async function attemptRefreshToken(
  existingRefreshToken: string | undefined
): Promise<Tokens> {
  if (!existingRefreshToken) {
    // console.log("No existing refresh token provided to attemptRefreshToken.");
    return { access_token: undefined, refresh_token: undefined };
  }
  try {
    // console.log("Attempting to refresh token with:", existingRefreshToken);
    const newTokens = await serverFetch<Tokens>(api.auth.refresh, {
      method: "POST",
      body: JSON.stringify({ refresh_token: existingRefreshToken }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    // console.log("Refresh API call returned new tokens:", newTokens);
    if (!newTokens.access_token) {
      // console.warn("Refresh API call did not return a new access_token.");
      return { access_token: undefined, refresh_token: undefined };
    }
    return newTokens;
  } catch (error) {
    // console.error("Error during refresh token API call:", error);
    return { access_token: undefined, refresh_token: undefined };
  }
}

export async function isTokenExpired(accessToken?: string): Promise<boolean> {
  if (!accessToken) {
    // console.log("isTokenExpired: No access token provided.");
    return true;
  }
  try {
    const { exp } = jwtDecode(accessToken);
    if (typeof exp !== "number") {
      // console.log(
      //   "isTokenExpired: 'exp' field is missing or not a number in token."
      // );
      return true;
    }
    const expirationTimeInSeconds = exp;
    const nowInSeconds = Date.now() / 1000;
    const bufferInSeconds = 5 * 60; // Buffer de 5 minutos
    // const bufferInSeconds = 0;

    // console.log(
    //   `isTokenExpired: ${
    //     expirationTimeInSeconds < nowInSeconds + bufferInSeconds
    //   }`
    // );

    return expirationTimeInSeconds < nowInSeconds + bufferInSeconds;
  } catch (error) {
    // console.error("isTokenExpired: Error decoding token:", error);
    return true;
  }
}

export type VerificationOutcome =
  | { status: "valid"; accessToken: string; tokens: Tokens }
  | { status: "refreshed"; accessToken: string; tokens: Tokens }
  | { status: "unauthorized"; reason?: string };

export async function verifyAndRefreshTokensIfNeeded(): Promise<VerificationOutcome> {
  let currentTokens = await getTokens();

  if (!currentTokens.access_token) {
    // console.log("verifyAndRefresh: No access token found initially.");
    return { status: "unauthorized", reason: "no_initial_token" };
  }

  try {
    if (await isTokenExpired(currentTokens.access_token)) {
      // console.log(
      //   "verifyAndRefresh: Access token expired. Attempting refresh."
      // );
      const newTokens = await attemptRefreshToken(currentTokens.refresh_token);

      if (newTokens.access_token && newTokens.refresh_token) {
        await setTokens(newTokens);
        // console.log("verifyAndRefresh: Token refreshed and set successfully.");
        return {
          status: "refreshed",
          accessToken: newTokens.access_token,
          tokens: newTokens,
        };
      } else {
        // console.log("verifyAndRefresh: Refresh failed. Clearing tokens.");
        await clearTokens();
        return { status: "unauthorized", reason: "refresh_failed" };
      }
    }
    // console.log("verifyAndRefresh: Access token is valid.");
    return {
      status: "valid",
      accessToken: currentTokens.access_token,
      tokens: currentTokens,
    };
  } catch (error: any) {
    // console.log(
    //   "verifyAndRefresh: General error during verification. Clearing tokens.",
    //   error.message ? error.message : error
    // );
    await clearTokens();
    return { status: "unauthorized", reason: "verification_error" };
  }
}
