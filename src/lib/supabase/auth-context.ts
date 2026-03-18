import { createClient } from "@/lib/supabase/client"

export async function getAuthContext() {
  const supabase = createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data.user) {
    throw new Error("Could not resolve authenticated user")
  }

  return {
    supabase,
    userId: data.user.id
  }
}
