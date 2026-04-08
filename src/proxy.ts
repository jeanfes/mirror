import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import {
  DEFAULT_AUTHENTICATED_ROUTE,
  ROUTES,
  isAuthPath,
  isPrivatePath,
  normalizeExtensionNext
} from "@/lib/routes"
import { getSupabasePublicEnv } from "@/lib/supabase/env"

export async function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-pathname", request.nextUrl.pathname)

  let response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  const supabaseEnv = getSupabasePublicEnv()
  if (!supabaseEnv) {
    const pathname = request.nextUrl.pathname

    if (isPrivatePath(pathname)) {
      return NextResponse.redirect(new URL(ROUTES.auth.login, request.url))
    }

    return response
  }

  const supabase = createServerClient(
    supabaseEnv.url,
    supabaseEnv.key,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )

          response = NextResponse.next({
            request: {
              headers: requestHeaders,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        }
      }
    }
  )

  const {
    data: { user }
  } = await supabase.auth.getUser()
  
  const pathname = request.nextUrl.pathname
  const nextParam = request.nextUrl.searchParams.get("next")
  const extensionNext = normalizeExtensionNext(nextParam)

  if (user && (pathname === ROUTES.public.index || isAuthPath(pathname))) {
    if (pathname === "/auth/extension-redirect" || pathname === "/auth/extension-sync") {
      return response
    }
    if (extensionNext) {
      const redirectUrl = new URL(ROUTES.auth.extensionRedirect, request.url)
      redirectUrl.searchParams.set("next", extensionNext)
      return NextResponse.redirect(redirectUrl)
    }
    return NextResponse.redirect(new URL(DEFAULT_AUTHENTICATED_ROUTE, request.url))
  }

  if (isPrivatePath(pathname) && !user) {
    return NextResponse.redirect(new URL(ROUTES.auth.login, request.url))
  }

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"
  ]
}