
import { createClient } from "@/lib/supabase/client"

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
