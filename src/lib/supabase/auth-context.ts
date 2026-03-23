import { createClient } from "@/lib/supabase/client"
import type { SupabaseClient } from "@supabase/supabase-js"

interface AuthContext {
  supabase: SupabaseClient
  userId: string
}

let authContextPromise: Promise<AuthContext> | null = null

export function getAuthContext(): Promise<AuthContext> {
  if (authContextPromise) return authContextPromise

  authContextPromise = (async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.getUser()
      if (error || !data.user) {
        throw new Error("Could not resolve authenticated user")
      }
      return { supabase, userId: data.user.id }
    } catch (err) {
      authContextPromise = null
      throw err
    }
  })()

  return authContextPromise
}

/** Call this on logout to prevent stale user context on next login. */
export function clearAuthContext(): void {
  authContextPromise = null
}
