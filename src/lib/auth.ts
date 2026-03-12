import { isAuthEnabled } from "@/lib/auth-config"
import { createClient } from "@/lib/supabase/server"

export async function getServerSession() {
  if (!isAuthEnabled()) {
    return { id: "dev-user", email: "dev@local" }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}
