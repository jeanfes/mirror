import { NextRequest, NextResponse } from "next/server"
import {
  DEFAULT_AUTHENTICATED_ROUTE,
  ROUTES,
  normalizeExtensionNext,
  normalizeSafeInternalRoute
} from "@/lib/routes"
import { createClient as createSupabaseServerClient } from "@/lib/supabase/server"

function isExtensionTarget(value: string) {
  return value.startsWith("chrome-extension://")
}

function resolveNextTarget(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const queryNext = requestUrl.searchParams.get("next")
  const cookieNext = request.cookies.get("mirror_extension_sync")?.value ?? null

  const extensionNext =
    normalizeExtensionNext(queryNext) ??
    normalizeExtensionNext(cookieNext)

  if (extensionNext) return extensionNext

  return (
    normalizeSafeInternalRoute(queryNext) ??
    normalizeSafeInternalRoute(cookieNext) ??
    DEFAULT_AUTHENTICATED_ROUTE
  )
}

function redirectToLoginWithError(request: NextRequest, errorCode: string, nextPath: string) {
  const loginUrl = new URL(ROUTES.auth.login, request.url)
  loginUrl.searchParams.set("error", errorCode)

  if (nextPath !== DEFAULT_AUTHENTICATED_ROUTE) {
    loginUrl.searchParams.set("next", nextPath)
  }

  return NextResponse.redirect(loginUrl)
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const error = requestUrl.searchParams.get("error")
  const nextPath = resolveNextTarget(request)

  if (error) {
    return redirectToLoginWithError(request, "oauth_failed", nextPath)
  }

  if (code) {
    try {
      const supabase = await createSupabaseServerClient()
      const { data: { session }, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

      if (exchangeError) {
        return redirectToLoginWithError(request, "oauth_exchange_failed", nextPath)
      }

      const user = session?.user
      const response = NextResponse.redirect(
        isExtensionTarget(nextPath)
          ? new URL(`${ROUTES.auth.extensionRedirect}?next=${encodeURIComponent(nextPath)}`, request.url)
          : new URL(nextPath, request.url)
      )
      
      if (user) {
        const { data: settings } = await supabase
          .from("user_settings")
          .select("theme, language")
          .eq("user_id", user.id)
          .single()

        if (settings) {
          const themePreference = settings.theme === "auto" ? "system" : settings.theme

          if (themePreference) {
            response.cookies.set("mirror-theme-preference", themePreference, { path: "/", maxAge: 31536000, sameSite: "lax" })
          }
          if (settings.language) {
            response.cookies.set("NEXT_LOCALE", settings.language, { path: "/", maxAge: 31536000, sameSite: "lax" })
          }
        }
      }

      response.cookies.delete("mirror_extension_sync")

      return response
    } catch {
      return redirectToLoginWithError(request, "supabase_config_missing", nextPath)
    }
  }

  return NextResponse.redirect(
    isExtensionTarget(nextPath)
      ? new URL(`${ROUTES.auth.extensionRedirect}?next=${encodeURIComponent(nextPath)}`, request.url)
      : new URL(nextPath, request.url)
  )
}
