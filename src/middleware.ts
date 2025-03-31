import { NextRequest, NextResponse } from "next/server";

const SESSION_NAME = "sessionId";

const publicRoutes = ["/"]
const privateRoutes = ["/gestao", "/anunciante"]

function redirect(path: string, request: NextRequest) {
  return NextResponse.redirect(new URL(path, request.url))
}

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const session = request.cookies.get(SESSION_NAME)?.value

  if (publicRoutes.includes(pathname) && session) {
    return redirect("/gestao", request)
  }

  if (privateRoutes.includes(pathname) && !session) {
    return redirect("/", request)
  }

  return NextResponse.next()
}
