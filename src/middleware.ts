// src/middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { clearTokens, verifyAndRefreshTokensIfNeeded } from "./lib/authTokens";
import jwtDecode from "./lib/jwtDecode"; // Sua função para decodificar JWT
import { env } from "./locales/env"; // Para o nome do cookie ao limpar

// Função utilitária para criar respostas de redirecionamento
function createRedirectResponse(
  path: string,
  request: NextRequest,
  clearCookieName?: string
): NextResponse {
  const response = NextResponse.redirect(new URL(path, request.url));
  if (clearCookieName) {
    // console.log(`Middleware: Clearing cookie ${clearCookieName} during redirect to ${path}`);
    response.cookies.set({
      name: clearCookieName,
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,
      path: "/",
      sameSite: "strict", // Adicionado por consistência
    });
  }
  return response;
}

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  // console.log(`Middleware: Processing request for ${pathname}`);

  // await clearTokens()

  const verificationResult = await verifyAndRefreshTokensIfNeeded();

  let isAuth = false;
  let currentAccessToken: string | undefined;

  if (verificationResult.status === "valid" || verificationResult.status === "refreshed") {
    isAuth = true;
    currentAccessToken = verificationResult.accessToken;
    // console.log(`Middleware: User is authenticated. Status: ${verificationResult.status}`);
  } 
  // else {
    // console.log(`Middleware: User is not authenticated. Reason: ${verificationResult.reason || 'unknown'}`);
  // }
  // Se verificationResult.status === "unauthorized", isAuth permanece false.
  // clearTokens() já foi chamado dentro de verifyAndRefreshTokensIfNeeded se uma falha crítica ocorreu.

  const isGestao = pathname.startsWith(`/gestao`);
  const isAnunci = pathname.startsWith(`/anunciante`);
  const isPrivate = isGestao || isAnunci;

  if (isAuth && currentAccessToken) {
    // Usuário está autenticado
    let userRole: string | undefined;
    try {
      const decodedToken = jwtDecode(currentAccessToken);
      userRole = decodedToken.role;
    } catch (e) {
      // console.error("Middleware: Error decoding token for role check, treating as invalid role.", e);
      // Se o token não puder ser decodificado, é um problema sério.
      // Tratar como se a role fosse inválida, levando ao redirecionamento para home com limpeza de cookie.
      userRole = undefined; // Garante que caia na lógica de role inválida
    }

    const isAdmn = userRole === "admn";
    const isAnct = userRole === "anct";

    // console.log(`Middleware: Authenticated user. Role: ${userRole}. Path: ${pathname}`);

    // Se o usuário tem uma role desconhecida/inválida após a autenticação
    if (!isAdmn && !isAnct) {
      // console.log("Middleware: User has invalid/unknown role. Redirecting to home and clearing tokens.");
      return createRedirectResponse(`/`, request, env.token!);
    }

    if (!isPrivate) {
      // Se está autenticado, mas em uma página pública (ex: home `/`)
      // console.log("Middleware: Authenticated user on public page. Redirecting to role-specific area.");
      if (isAdmn) return createRedirectResponse(`/gestao`, request);
      if (isAnct) return createRedirectResponse(`/anunciante`, request);
      // Se por algum motivo chegou aqui com role válida mas sem destino claro, permite prosseguir (raro)
    } else {
      // Se está autenticado E em uma rota privada
      // console.log("Middleware: Authenticated user on private page. Verifying access.");
      // Admin tentando acessar área de anunciante indevidamente
      if (isAdmn && isAnunci) {
        // console.log("Middleware: Admin attempting to access /anunciante. Redirecting to /gestao.");
        return createRedirectResponse(`/gestao`, request);
      }
      // Anunciante tentando acessar área de gestão indevidamente
      if (isAnct && isGestao) {
        // console.log("Middleware: Anunciante attempting to access /gestao. Redirecting to /anunciante.");
        return createRedirectResponse(`/anunciante`, request);
      }
    }

    // console.log("Middleware: Authenticated user access granted.");
    // Se todas as verificações passaram, permite o acesso.
    // Cookies (se atualizados pelo refresh) serão enviados com esta resposta.
    // É importante retornar um NOVO objeto NextResponse se você quiser que os cookies atualizados
    // por setTokens (dentro de verifyAndRefreshTokensIfNeeded) sejam aplicados.
    // NextResponse.next() por si só não necessariamente propaga cookies setados em chamadas anteriores
    // DENTRO da mesma execução do middleware se essas chamadas não modificaram um objeto response.
    // No entanto, como setTokens opera diretamente nos cookies() da requisição, o Next.js deve pegá-los.
    // Para máxima segurança de que os cookies atualizados sejam enviados:
    const response = NextResponse.next();
    // Se `setTokens` foi chamado, a instância de `cookies()` já foi atualizada.
    // O Next.js deve incluir os cabeçalhos Set-Cookie automaticamente na `response`.
    return response;

  } else {
    // Usuário NÃO está autenticado (ou a verificação resultou em não autorizado)
    // console.log("Middleware: User not authenticated.");
    if (isPrivate) {
      // Se tentar acessar rota privada sem auth, redireciona para home e garante limpeza de cookie.
      // console.log("Middleware: Unauthenticated user attempting to access private page. Redirecting to home and clearing tokens.");
      return createRedirectResponse(`/`, request, env.token!);
    }
    // Se rota pública e não autenticado, permite o acesso
    // console.log("Middleware: Unauthenticated user on public page. Allowing access.");
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * (Adicione aqui outras rotas públicas que não devem passar pelo grosso da lógica de auth,
     * como /login, /registrar, /public-page, etc., se não quiser que o middleware
     * tente redirecionar um usuário já logado para /gestao ou /anunciante a partir delas)
     * Ex: "/((?!api|_next/static|_next/image|login|favicon.ico|sitemap.xml|robots.txt).*)",
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};