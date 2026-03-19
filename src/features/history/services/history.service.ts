import { getAuthContext } from "@/lib/supabase/auth-context"
import type { GenerationHistory, GenerationHistoryRow } from "@/types/database.types"

function mapRowToHistoryItem(row: GenerationHistoryRow & { profileName?: string }): GenerationHistory {
  return {
    id: row.id,
    profileId: row.profile_id,
    profileName: row.profileName,
    kind: row.kind,
    source: row.source,
    status: row.status,
    postAuthor: row.post_author ?? "Unknown author",
    postHeadline: row.post_headline ?? undefined,
    postSnippet: row.post_snippet ?? "",
    generatedText: row.generated_text,
    goal: row.goal ?? undefined,
    origin: row.origin ?? "web",
    createdAt: Date.parse(row.created_at)
  }
}

export interface ListHistoryFilters {
  profileId?: string
  status?: "all" | "pending" | "applied" | "dismissed"
  search?: string
}

export async function listHistory(filters?: ListHistoryFilters): Promise<GenerationHistory[]> {
  const { supabase, userId } = await getAuthContext()

  let query = supabase
    .from("generation_history")
    .select("*, voice_profiles(name)")
    .eq("user_id", userId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })

  if (filters?.profileId && filters.profileId !== "all") {
    query = query.eq("profile_id", filters.profileId)
  }

  if (filters?.status && filters.status !== "all") {
    query = query.eq("status", filters.status)
  }

  if (filters?.search) {
    const term = `%${filters.search}%`
    query = query.or(`post_author.ilike.${term},post_snippet.ilike.${term},generated_text.ilike.${term}`)
  }

  const { data, error } = await query

  if (error) {
    throw error
  }

  const rows = (data ?? []) as Array<GenerationHistoryRow & { voice_profiles?: { name?: string } | null }>
  return rows.map((row) => mapRowToHistoryItem({ ...row, profileName: row.voice_profiles?.name }))
}

export async function updateHistoryStatus(
  id: string,
  newStatus: "pending" | "applied" | "dismissed"
): Promise<void> {
  const { supabase, userId } = await getAuthContext()

  const { error } = await supabase
    .from("generation_history")
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", userId)

  if (error) {
    throw error
  }
}

export async function reuseHistoryItem(id: string): Promise<string> {
  const { supabase } = await getAuthContext()

  const { data: newId, error } = await supabase.rpc("reuse_generation", { p_history_id: id })

  if (error) {
    throw error
  }

  return String(newId)
}

export async function moveToTrash(id: string): Promise<void> {
  const { supabase, userId } = await getAuthContext()

  const { error } = await supabase
    .from("generation_history")
    .update({ deleted_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", userId)

  if (error) {
    throw error
  }
}

export async function getHistoryStats() {
  const { supabase, userId } = await getAuthContext()

  const { data: counts, error } = await supabase
    .from("generation_history")
    .select("status, source")
    .eq("user_id", userId)
    .is("deleted_at", null)

  if (error) {
    throw error
  }

  const items = counts ?? []

  return {
    archived: items.length,
    applied: items.filter((item) => item.status === "applied").length,
    pending: items.filter((item) => item.status === "pending").length,
    reused: items.filter((item) => item.source === "history_reuse").length
  }
}

export interface GenerateInput {
  profile_id: string
  kind: "comment" | "post" | "rewrite"
  post_snippet?: string
  post_author?: string
  post_headline?: string
  draft_text?: string
  goal?: string
  origin?: "web" | "extension"
}

export async function generateContent(input: GenerateInput) {
  const { supabase } = await getAuthContext()

  const { data, error } = await supabase.functions.invoke("generate", {
    body: {
      profile_id: input.profile_id,
      kind: input.kind,
      post_snippet: input.post_snippet,
      post_author: input.post_author,
      post_headline: input.post_headline,
      draft_text: input.draft_text,
      goal: input.goal ?? "networking",
      origin: input.origin ?? "web"
    }
  })

  if (error) {
    throw error
  }

  return data
}
