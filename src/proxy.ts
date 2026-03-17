import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import {
  DEFAULT_AUTHENTICATED_ROUTE,
  ROUTES,
  isAuthPath,
  isPrivatePath
} from "@/lib/routes"
import { getSupabasePublicEnv } from "@/lib/supabase/env"

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })

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

          response = NextResponse.next({ request })
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

  if (user && (pathname === ROUTES.public.index || isAuthPath(pathname))) {
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