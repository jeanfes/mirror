import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { DEFAULT_AUTHENTICATED_ROUTE, ROUTES } from "@/lib/routes"

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
    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          }
        }
      }
    )

    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(new URL(nextPath, request.url))
}
