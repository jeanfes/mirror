import { createClient } from "@/lib/supabase/server"
import { cache } from "react"

export const getServerSession = cache(async () => {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getUser()

    if (error) {
      const isNoSession =
        error.message?.includes("Auth session missing") ||
        error.status === 401

      if (!isNoSession) {
        console.error("[getServerSession] Supabase error:", {
          message: error.message,
          status: error.status,
        })
      }

      return null
    }

    return data?.user ?? null
  } catch (e) {
    console.error("[getServerSession] Crash:", e)
    return null
  }
})