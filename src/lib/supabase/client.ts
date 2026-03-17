import { createBrowserClient } from "@supabase/ssr"
import { getRequiredSupabasePublicEnv } from "@/lib/supabase/env"

export function createClient() {
  const supabaseEnv = getRequiredSupabasePublicEnv()

  return createBrowserClient(
    supabaseEnv.url,
    supabaseEnv.key
  )
}
