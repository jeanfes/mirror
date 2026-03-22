import { createClient } from "@/lib/supabase/server"

export const getServerSession = async () => {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getUser()

    if (error) {
      console.error("Supabase error:", error)
      return null
    }

    return data?.user ?? null
  } catch (e) {
    console.error("Server session crash:", e)
    return null
  }
}