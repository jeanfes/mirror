import type { SupabaseClient } from "@supabase/supabase-js"
import { callEdgeFunction } from "@/lib/supabase/edge-functions"


export interface ExportOptions {
  profiles?: string[] | "all"
  objectives?: string[] | "all"
}

export async function startDataExport(
  supabase: SupabaseClient,
  options: ExportOptions = { profiles: "all", objectives: "all" }
): Promise<string | null> {

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl) {
    throw new Error("Supabase URL is not configured")
  }

  const {
    data: { session }
  } = await supabase.auth.getSession()

  const accessToken = session?.access_token
  if (!accessToken) {
    throw new Error("Missing session token")
  }

  const response = await fetch(`${supabaseUrl}/functions/v1/export-data`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(options)
  })

  if (!response.ok) {
    const raw = await response.text()
    let errorMessage = "Edge function export-data failed"

    if (raw) {
      try {
        const parsed = JSON.parse(raw) as { error?: string; message?: string }
        errorMessage = parsed.error || parsed.message || errorMessage
      } catch {
        errorMessage = raw
      }
    }

    throw new Error(errorMessage)
  }

  const blob = await response.blob()

  if (blob.size === 0) {
    return null
  }

  return URL.createObjectURL(blob)
}

export async function deleteAccount(supabase: SupabaseClient): Promise<void> {
  await callEdgeFunction<Record<string, unknown>>(supabase, "delete-account", undefined, "DELETE")
}