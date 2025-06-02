"use server";

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { clearTokens, verifyAndRefreshTokensIfNeeded } from "./lib/authTokens";
import jwtDecode from "./lib/jwtDecode";

async function createRedirectResponse(
  path: string,
  request: NextRequest,
  clearCookie: boolean = false
): Promise<NextResponse> {
  const response = NextResponse.redirect(new URL(path, request.url));
  if (clearCookie) {
    //console.log(`Middleware: Clearing cookie during redirect to ${path}`);
    await clearTokens();
  }
  return response;
}

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  const verificationResult = await verifyAndRefreshTokensIfNeeded();

  //console.log(`pathname: `, pathname)

  let isAuth = false;
  let currentAccessToken: string | undefined;

  if (
    verificationResult.status === "valid" ||
    verificationResult.status === "refreshed"
  ) {
    isAuth = true;
    currentAccessToken = verificationResult.accessToken;
  }

  const isGestao = pathname.startsWith(`/gestao`);
  const isAnunci = pathname.startsWith(`/anunciante`);
  const isPrivate = isGestao || isAnunci;

  if (isAuth && currentAccessToken) {
    let userRole: string | undefined;
    try {
      const decodedToken = jwtDecode(currentAccessToken);
      userRole = decodedToken.role;
    } catch {
      userRole = undefined;
    }

    const isAdmn = userRole === "admn";
    const isAnct = userRole === "anct";

    if (!isAdmn && !isAnct) {
      return createRedirectResponse(`/`, request, true);
    }

    if (!isPrivate) {
      if (isAdmn) return createRedirectResponse(`/gestao`, request);
      if (isAnct) return createRedirectResponse(`/anunciante`, request);
    } else {
      if (isAdmn && isAnunci) {
        return createRedirectResponse(`/gestao`, request);
      }
      if (isAnct && isGestao) {
        return createRedirectResponse(`/anunciante`, request);
      }
    }

    //console.log("Middleware: Authenticated user access granted.");

    return NextResponse.next();
  } else {
    //console.log("Middleware: User not authenticated.");
    if (isPrivate) {
      return createRedirectResponse(`/`, request, true);
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/gestao/:path*", "/anunciante/:path*", "/cadastro/:path*", "/"],
};
