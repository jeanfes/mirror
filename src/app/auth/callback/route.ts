import { NextRequest, NextResponse } from "next/server"
import { DEFAULT_AUTHENTICATED_ROUTE, ROUTES } from "@/lib/routes"
import { createClient as createSupabaseServerClient } from "@/lib/supabase/server"

function sanitizeNextPath(value: string | null) {
  if (!value) return DEFAULT_AUTHENTICATED_ROUTE
  if (value.startsWith("chrome-extension://")) return value
  if (!value.startsWith("/")) return DEFAULT_AUTHENTICATED_ROUTE
  if (value.startsWith("//")) return DEFAULT_AUTHENTICATED_ROUTE
  return value
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const error = requestUrl.searchParams.get("error")
  
  let nextPath = requestUrl.searchParams.get("next")
  if (!nextPath) {
    nextPath = request.cookies.get("mirror_extension_sync")?.value || null
  }
  nextPath = sanitizeNextPath(nextPath)

  if (error) {
    return NextResponse.redirect(new URL(`${ROUTES.auth.login}?error=oauth_failed`, request.url))
  }

  if (code) {
    try {
      const supabase = await createSupabaseServerClient()
      const { data: { session }, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

      if (exchangeError) {
        return NextResponse.redirect(new URL(`${ROUTES.auth.login}?error=oauth_exchange_failed`, request.url))
      }

      const user = session?.user
      const response = NextResponse.redirect(
        nextPath.startsWith("chrome-extension://") 
          ? new URL(`${ROUTES.auth.login.replace("/login", "/extension-redirect")}?next=${encodeURIComponent(nextPath)}`, request.url)
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
      return NextResponse.redirect(new URL(`${ROUTES.auth.login}?error=supabase_config_missing`, request.url))
    }
  }

  return NextResponse.redirect(new URL(nextPath, request.url))
}
