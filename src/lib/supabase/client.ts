import { createBrowserClient } from "@supabase/ssr"
import { useMemo } from "react"
import { getRequiredSupabasePublicEnv } from "@/lib/supabase/env"
import type { SupabaseClient } from "@supabase/supabase-js"

let supabaseClient: SupabaseClient | null = null

export function createClient() {
  if (supabaseClient) return supabaseClient

  const supabaseEnv = getRequiredSupabasePublicEnv()
  supabaseClient = createBrowserClient(
    supabaseEnv.url,
    supabaseEnv.key
  )

  return supabaseClient
}

export function useSupabaseClient() {
  return useMemo(() => createClient(), [])
}
