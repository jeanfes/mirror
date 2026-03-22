import { createClient } from "@/lib/supabase/client"
import type { UserProfile, UserSettings, UserAccount } from "@/types/database.types"

interface SignInInput {
  email: string
  password: string
}

interface SignUpInput extends SignInInput {
  name: string
}

export async function signInWithPassword(input: SignInInput) {
  const supabase = createClient()
  return supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password
  })
}

export async function signInWithGoogle(redirectTo: string) {
  const supabase = createClient()
  return supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo, queryParams: { prompt: "select_account" } }
  })
}

export async function signUpWithPassword(input: SignUpInput) {
  const supabase = createClient()
  return supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: { name: input.name }
    }
  })
}

export async function signOut() {
  const supabase = createClient()
  return supabase.auth.signOut()
}


async function initializePostLogin(userId: string) {
  const supabase = createClient()
  
  const [profileRes, settingsRes, accountRes] = await Promise.all([
    supabase
      .from("user_profiles")
      .select("id, name, avatar_url, avatar_source, password_updated_at, created_at")
      .eq("id", userId)
      .single(),
    supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", userId)
      .single(),
    supabase
      .from("user_account")
      .select("user_id, plan, credits_remaining, credits_used_this_month, renewal_date, subscription_status, last_generation_at, provider_subscription_id")
      .eq("user_id", userId)
      .single()
  ])

  if (settingsRes.error) {
    console.error("Failed to load settings on init", settingsRes.error)
  } else if (settingsRes.data && typeof window !== "undefined") {
    try {
      let theme = settingsRes.data.theme as "light" | "dark" | "auto"
      if (theme === "auto") {
        theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      }
      document.documentElement.setAttribute("data-theme", theme)
    } catch (e) {
      console.error("Error setting theme:", e)
    }
  }

  return {
    profile: profileRes.data as UserProfile | null,
    settings: settingsRes.data as UserSettings | null,
    account: accountRes.data as UserAccount | null
  }
}

