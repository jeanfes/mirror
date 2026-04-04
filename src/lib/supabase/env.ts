const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL

const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export function getSupabasePublicEnv() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return null
  }

  return {
    url: SUPABASE_URL,
    key: SUPABASE_KEY
  }
}

export function getRequiredSupabasePublicEnv() {
  const env = getSupabasePublicEnv()

  if (!env) {
    throw new Error(
      "Missing Supabase configuration. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    )
  }

  return env
}
