import { getRequiredSupabasePublicEnv } from "@/lib/supabase/env"
import type { SupabaseClient } from "@supabase/supabase-js"
import { createBrowserClient } from "@supabase/ssr"
import { useMemo } from "react"

declare global {
  var __supabaseClient: SupabaseClient | undefined
}

export function createClient(): SupabaseClient {
  if (globalThis.__supabaseClient) return globalThis.__supabaseClient

  const { url, key } = getRequiredSupabasePublicEnv()
  const client = createBrowserClient(url, key)

  globalThis.__supabaseClient = client
  return client
}

export function useSupabaseClient(): SupabaseClient {
  return useMemo(() => createClient(), [])
}