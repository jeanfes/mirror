import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { getRequiredSupabasePublicEnv } from "@/lib/supabase/env"

export async function createClient() {
  const cookieStore = await cookies()
  const supabaseEnv = getRequiredSupabasePublicEnv()

  return createServerClient(
    supabaseEnv.url,
    supabaseEnv.key,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // noop - cookies can only be set during request handling, so this will fail if attempted during static generation
          }
        }
      }
    }
  )
}
