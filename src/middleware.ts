"use server";

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { clearTokens, verifyAndRefreshTokensIfNeeded } from "./lib/authTokens";
import jwtDecode from "./lib/jwtDecode";

// const redirectTo = (url: string, request: NextRequest) => {
//   return NextResponse.redirect(new URL(url, request.url));
// };

async function createRedirectResponse(
  path: string,
  request: NextRequest,
  clearCookie: boolean = false
): Promise<NextResponse> {
  const response = NextResponse.redirect(new URL(path, request.url));
  if (clearCookie) {
    // console.log(`Middleware: Clearing cookie during redirect to ${path}`);
    await clearTokens();
  }
  return response;
}

export async function middleware(request: NextRequest): Promise<NextResponse> {
  // return NextResponse.next();

  const { pathname, href } = request.nextUrl;
  const verificationResult = await verifyAndRefreshTokensIfNeeded();

  let isAuth = false;
  let currentAccessToken: string | undefined;
  let tokensWereRefreshed = false;

  if (verificationResult.status === "valid") {
    isAuth = true;
    currentAccessToken = verificationResult.accessToken;
  } else if (verificationResult.status === "refreshed") {
    isAuth = true;
    currentAccessToken = verificationResult.accessToken;
    tokensWereRefreshed = true; // Define a flag se o token foi refrescado
  } else {
    // status é "unauthorized"
    // console.log("Middleware: User not authenticated or refresh failed.");
    if (pathname.startsWith(`/gestao`) || pathname.startsWith(`/anunciante`)) {
      // Se tentar acessar área privada sem autenticação, redireciona para a raiz e limpa os cookies
      // return createRedirectResponse(`/login?redirect=${href}`, request, true);
      return createRedirectResponse(`/login`, request, true);
    }
    // Se não é área privada, permite acesso sem autenticação (ex: login, homepage)
    return NextResponse.next();
  }

  // Se chegou até aqui, o usuário está autenticado (isAuth é true)
  const isGestaoPath = pathname.startsWith(`/gestao`);
  const isAnctPath = pathname.startsWith(`/anunciante`);
  const isPrivatePath = isGestaoPath || isAnctPath;

  let userRole: string | undefined;

  try {
    // currentAccessToken é definido se isAuth é true
    const decodedToken = jwtDecode(currentAccessToken!);
    userRole = decodedToken.role;
  } catch {
    userRole = undefined;
    // Se não conseguir decodificar, trata como não autorizado ou erro
    // console.log("Middleware: Failed to decode token. Clearing tokens.");
    return createRedirectResponse(`/login`, request, true);
  }

  const isAdmn = userRole === "admn";
  const isAnctRole = userRole === "anct";

  if (!isAdmn && !isAnctRole) {
    // Usuário autenticado, mas com role inválida para áreas protegidas
    // console.log("Middleware: User has invalid role. Redirecting to root.");
    return createRedirectResponse(`/login`, request, true);
  }

  // Redirecionamento para a área correta baseada na role
  if (!isPrivatePath) {
    // Usuário autenticado, mas não está em uma rota privada (ex: está na raiz ou /login)
    if (isAdmn) {
      return createRedirectResponse(`/gestao`, request);
    }
    if (isAnctRole) {
      return createRedirectResponse(`/anunciante`, request);
    }
  } else {
    // Usuário autenticado e está em uma rota privada
    if (isAdmn && isAnctPath) {
      // ADMN tentando acessar /anunciante
      // console.log(
      //   "Middleware: ADMN trying to access /anunciante. Redirecting to /gestao."
      // );
      return createRedirectResponse(`/gestao`, request);
    }
    if (isAnctRole && isGestaoPath) {
      // anct tentando acessar /gestao
      // console.log(
      //   "Middleware: anct trying to access /gestao. Redirecting to /anunciante."
      // );
      return createRedirectResponse(`/anunciante`, request);
    }
  }

  // Se chegamos até aqui, o usuário está autenticado, autorizado para a rota atual,
  // e nenhum outro redirecionamento foi disparado.
  // Agora, verificamos se os tokens foram refrescados nesta requisição.
  if (tokensWereRefreshed) {
    // console.log(
    //   "Middleware: Tokens were refreshed. Forcing redirect to self to pick up new cookies."
    // );
    // Redireciona para a mesma URL. Isso força o navegador a enviar uma nova requisição
    // com os cookies atualizados.
    return NextResponse.redirect(new URL(pathname, request.url));
  }

  // console.log(
  //   "Middleware: Authenticated and authorized user access granted. Continuing."
  // );
  return NextResponse.next();
}

export const config = {
  matcher: ["/gestao(/.*)?", "/anunciante(/.*)?", "/login(/.*)?"],
};
