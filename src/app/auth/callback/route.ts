import { NextRequest, NextResponse } from "next/server"
import { DEFAULT_AUTHENTICATED_ROUTE, ROUTES } from "@/lib/routes"
import { createClient as createSupabaseServerClient } from "@/lib/supabase/server"

function sanitizeNextPath(value: string | null) {
  if (!value) return DEFAULT_AUTHENTICATED_ROUTE
  if (!value.startsWith("/")) return DEFAULT_AUTHENTICATED_ROUTE
  if (value.startsWith("//")) return DEFAULT_AUTHENTICATED_ROUTE
  return value
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const error = requestUrl.searchParams.get("error")
  const nextPath = sanitizeNextPath(requestUrl.searchParams.get("next"))

  if (error) {
    return NextResponse.redirect(new URL(`${ROUTES.auth.login}?error=oauth_failed`, request.url))
  }

  if (code) {
    try {
      const supabase = await createSupabaseServerClient()
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

      if (exchangeError) {
        return NextResponse.redirect(new URL(`${ROUTES.auth.login}?error=oauth_exchange_failed`, request.url))
      }
    } catch {
      return NextResponse.redirect(new URL(`${ROUTES.auth.login}?error=supabase_config_missing`, request.url))
    }
  }

  return NextResponse.redirect(new URL(nextPath, request.url))
}
