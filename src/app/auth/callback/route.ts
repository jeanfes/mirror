import { NextRequest, NextResponse } from "next/server"
import {
  DEFAULT_AUTHENTICATED_ROUTE,
  ROUTES,
} from "@/lib/routes"
import { createClient as createSupabaseServerClient } from "@/lib/supabase/server"
import { isExtensionNext, sanitizeAuthNext } from "@/lib/extension-handoff"

function resolveNextTarget(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const queryNext = requestUrl.searchParams.get("next")
  if (queryNext !== null) {
    return {
      target: sanitizeAuthNext(queryNext) ?? DEFAULT_AUTHENTICATED_ROUTE,
      hasExplicitNext: true
    }
  }

  const nextFromCookie = sanitizeAuthNext(request.cookies.get("mirror_extension_sync")?.value ?? null)
  if (nextFromCookie !== null) {
    return {
      target: nextFromCookie,
      hasExplicitNext: true
    }
  }

  return {
    target: DEFAULT_AUTHENTICATED_ROUTE,
    hasExplicitNext: false
  }
}

function isLikelyNewOAuthUser(createdAt?: string | null, lastSignInAt?: string | null) {
  if (!createdAt || !lastSignInAt) {
    return false
  }

  const createdAtMs = Date.parse(createdAt)
  const lastSignInAtMs = Date.parse(lastSignInAt)

  if (!Number.isFinite(createdAtMs) || !Number.isFinite(lastSignInAtMs)) {
    return false
  }

  // On first OAuth sign-in, Supabase timestamps are usually created nearly at the same time.
  return Math.abs(lastSignInAtMs - createdAtMs) <= 2 * 60 * 1000
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
  const { target: nextPath, hasExplicitNext } = resolveNextTarget(request)

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
      const shouldOnboardNewOAuthUser = Boolean(
        user &&
        !hasExplicitNext &&
        !isExtensionNext(nextPath) &&
        isLikelyNewOAuthUser(user.created_at, user.last_sign_in_at)
      )
      const redirectTarget = shouldOnboardNewOAuthUser
        ? `${ROUTES.private.profiles}?create=1`
        : nextPath

      const response = NextResponse.redirect(
        isExtensionNext(redirectTarget)
          ? new URL(`${ROUTES.auth.extensionRedirect}?next=${encodeURIComponent(redirectTarget)}`, request.url)
          : new URL(redirectTarget, request.url)
      )
      
      if (user) {
        const { data: settings } = await supabase
          .from("user_settings")
          .select("theme, language")
          .eq("user_id", user.id)
          .maybeSingle()

        if (settings) {
          const themePreference = settings.theme

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
    isExtensionNext(nextPath)
      ? new URL(`${ROUTES.auth.extensionRedirect}?next=${encodeURIComponent(nextPath)}`, request.url)
      : new URL(nextPath, request.url)
  )
}
