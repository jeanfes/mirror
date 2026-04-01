import type { SupabaseClient } from "@supabase/supabase-js"
import { callEdgeFunction } from "@/lib/supabase/edge-functions"

interface ExportDataResponse {
  download_url?: string
  downloadUrl?: string
  url?: string
  file_url?: string
  fileUrl?: string
}

export async function startDataExport(
  supabase: SupabaseClient
): Promise<string | null> {
  const payload = await callEdgeFunction<ExportDataResponse>(
    supabase,
    "export-data",
    {}
  )

  return (
    payload.download_url ||
    payload.downloadUrl ||
    payload.file_url ||
    payload.fileUrl ||
    payload.url ||
    null
  )
}

export async function deleteAccount(supabase: SupabaseClient): Promise<void> {
  await callEdgeFunction<Record<string, unknown>>(supabase, "delete-account", {})
}