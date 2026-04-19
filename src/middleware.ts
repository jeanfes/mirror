import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import {
  DEFAULT_AUTHENTICATED_ROUTE,
  ROUTES,
  isAuthPath,
  isPublicPath,
  isPrivatePath
} from "@/lib/routes"
import { sanitizeExtensionNext } from "@/lib/extension-handoff"
import { getSupabasePublicEnv } from "@/lib/supabase/env"

function redirectToLoginWithNext(request: NextRequest) {
  const loginUrl = new URL(ROUTES.auth.login, request.url)
  const requestedPath = `${request.nextUrl.pathname}${request.nextUrl.search}`
  loginUrl.searchParams.set("next", requestedPath)
  return NextResponse.redirect(loginUrl)
}

export async function middleware(request: NextRequest) {
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
      return redirectToLoginWithNext(request)
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
  const extensionNext = sanitizeExtensionNext(nextParam)

  if (user && (isPublicPath(pathname) || isAuthPath(pathname))) {
    if (pathname === "/auth/extension-redirect" || pathname === "/auth/extension-sync") {
      return response
    }
    if (extensionNext) {
      const redirectUrl = new URL(ROUTES.auth.login.replace("/login", "/extension-redirect"), request.url)
      redirectUrl.searchParams.set("next", extensionNext)
      return NextResponse.redirect(redirectUrl)
    }

    if (pathname === ROUTES.public.terms) {
      return NextResponse.redirect(new URL(ROUTES.private.terms, request.url))
    }

    if (pathname === ROUTES.public.privacy) {
      return NextResponse.redirect(new URL(ROUTES.private.privacy, request.url))
    }

    return NextResponse.redirect(new URL(DEFAULT_AUTHENTICATED_ROUTE, request.url))
  }

  if (isPrivatePath(pathname) && !user) {
    return redirectToLoginWithNext(request)
  }

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"
  ]
}