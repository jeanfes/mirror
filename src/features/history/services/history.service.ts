import type { SupabaseClient } from "@supabase/supabase-js"
import type { GenerationHistory, GenerationHistoryRow } from "@/types/database.types"

const HISTORY_SELECT_COLUMNS =
  "id, profile_id, platform, sync_fingerprint, kind, source, status, post_author, post_headline, post_snippet, generated_text, goal, origin, liked, feedback_note, created_at"

type HistoryRowProjection = Pick<
  GenerationHistoryRow,
  "id" | "profile_id" | "platform" | "sync_fingerprint" | "kind" | "source" | "status" | "post_author" | "post_headline" | "post_snippet" | "generated_text" | "goal" | "origin" | "liked" | "feedback_note" | "created_at"
>

function mapRowToHistoryItem(row: HistoryRowProjection & { profileName?: string }): GenerationHistory {
  return {
    id: row.id,
    profileId: row.profile_id,
    profileName: row.profileName,
    platform: row.platform ?? "linkedin",
    syncFingerprint: row.sync_fingerprint ?? undefined,
    kind: row.kind,
    source: row.source,
    status: row.status,
    postAuthor: row.post_author ?? "Unknown author",
    postHeadline: row.post_headline ?? undefined,
    postSnippet: row.post_snippet ?? "",
    generatedText: row.generated_text,
    goal: row.goal ?? undefined,
    liked: row.liked,
    feedbackNote: row.feedback_note,
    origin: row.origin ?? "web",
    createdAt: Date.parse(row.created_at)
  }
}

export interface ListHistoryFilters {
  profileId?: string
  status?: "all" | "applied"
  search?: string
}

export async function listHistory(supabase: SupabaseClient, userId: string, filters?: ListHistoryFilters): Promise<GenerationHistory[]> {
  let query = supabase
    .from("generation_history")
    .select(`${HISTORY_SELECT_COLUMNS}, voice_profiles(name)`)
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

  const rows = (data ?? []) as Array<HistoryRowProjection & { voice_profiles?: { name?: string }[] | { name?: string } | null }>
  return rows.map((row) => {
    const profileRelation = row.voice_profiles
    const profileName = Array.isArray(profileRelation)
      ? profileRelation[0]?.name
      : profileRelation?.name

    return mapRowToHistoryItem({ ...row, profileName })
  })
}

export async function moveToTrash(supabase: SupabaseClient, userId: string, id: string): Promise<void> {
  const { error } = await supabase
    .from("generation_history")
    .update({ deleted_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", userId)

  if (error) {
    throw error
  }
}

export async function updateHistoryFeedback(
  supabase: SupabaseClient,
  userId: string,
  id: string,
  input: {
    liked?: boolean | null
    feedbackNote?: string | null
  }
): Promise<void> {
  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString()
  }

  if (input.liked !== undefined) {
    updates.liked = input.liked
  }

  if (input.feedbackNote !== undefined) {
    updates.feedback_note = input.feedbackNote?.trim() ? input.feedbackNote.trim() : null
  }

  const { error } = await supabase
    .from("generation_history")
    .update(updates)
    .eq("id", id)
    .eq("user_id", userId)

  if (error) {
    throw error
  }
}

