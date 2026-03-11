import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { authSecret } from "@/lib/auth-secret"

export async function proxy(request: NextRequest) {
  let token = null

  try {
    token = await getToken({ req: request, secret: authSecret })
  } catch {
    token = null
  }

  if (!token) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"]
}
