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
  const payload = await callEdgeFunction<Record<string, unknown>>(
    supabase,
    "export-data",
    options
  )

  if (!payload || Object.keys(payload).length === 0) {
    return null
  }

  // Create a blob URL from the JSON data!
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  })
  
  return URL.createObjectURL(blob)
}

export async function deleteAccount(supabase: SupabaseClient): Promise<void> {
  await callEdgeFunction<Record<string, unknown>>(supabase, "delete-account", {})
}