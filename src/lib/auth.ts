import { isAuthEnabled } from "@/lib/auth-config"
import { MOCK_AUTH_COOKIE, parseMockSessionCookie } from "@/lib/mock-auth"
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function getServerSession() {
  if (!isAuthEnabled()) {
    const cookieStore = await cookies()
    return parseMockSessionCookie(cookieStore.get(MOCK_AUTH_COOKIE)?.value)
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}
