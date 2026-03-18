import { getAuthContext } from "@/lib/supabase/auth-context"

export interface TrashItem {
  id: string
  title: string
  kind: "profile" | "comment" | "draft"
  deletedAt: number
  summary: string
}

interface DeletedProfileRow {
  id: string
  name: string
  description: string | null
  deleted_at: string
}

interface DeletedHistoryRow {
  id: string
  kind: string
  post_author: string | null
  post_snippet: string | null
  generated_text: string
  deleted_at: string
}

export async function getTrashCounts() {
  const { supabase, userId } = await getAuthContext()

  const [profilesRes, historyRes] = await Promise.all([
    supabase
      .from("voice_profiles")
      .select("id", { count: "exact" })
      .eq("user_id", userId)
      .not("deleted_at", "is", null),
    supabase
      .from("generation_history")
      .select("id, kind", { count: "exact" })
      .eq("user_id", userId)
      .not("deleted_at", "is", null)
  ])
  
  return {
    profiles: profilesRes.count ?? 0,
    history: historyRes.count ?? 0
  }
}

export async function listTrash(): Promise<TrashItem[]> {
  const { supabase, userId } = await getAuthContext()

  const [{ data: deletedProfiles, error: profilesError }, { data: deletedHistory, error: historyError }] = await Promise.all([
    supabase
      .from("voice_profiles")
      .select("id, name, description, deleted_at")
      .eq("user_id", userId)
      .not("deleted_at", "is", null)
      .order("deleted_at", { ascending: false }),
    supabase
      .from("generation_history")
      .select("id, kind, post_author, post_snippet, generated_text, deleted_at")
      .eq("user_id", userId)
      .not("deleted_at", "is", null)
      .order("deleted_at", { ascending: false })
  ])

  if (profilesError) throw profilesError
  if (historyError) throw historyError

  const profileItems: TrashItem[] = ((deletedProfiles ?? []) as DeletedProfileRow[]).map((item) => ({
    id: item.id,
    title: item.name,
    kind: "profile",
    deletedAt: Date.parse(item.deleted_at),
    summary: item.description ?? "Deleted profile"
  }))

  const historyItems: TrashItem[] = ((deletedHistory ?? []) as DeletedHistoryRow[]).map((item) => ({
    id: item.id,
    title: item.post_author ? `Comment draft for ${item.post_author}` : "Deleted generation",
    kind: item.kind === "comment" ? "comment" : "draft",
    deletedAt: Date.parse(item.deleted_at),
    summary: item.post_snippet ?? item.generated_text
  }))

  return [...profileItems, ...historyItems].sort((a, b) => b.deletedAt - a.deletedAt)
}


async function identifyTrashItemType(
  supabase: NonNullable<Awaited<ReturnType<typeof getAuthContext>>["supabase"]>,
  userId: string,
  id: string
): Promise<"profile" | "comment" | null> {
  const { data: profile } = await supabase
    .from("voice_profiles")
    .select("id")
    .eq("id", id)
    .eq("user_id", userId)
    .not("deleted_at", "is", null)
    .maybeSingle()

  if (profile) return "profile"

  const { data: history } = await supabase
    .from("generation_history")
    .select("id")
    .eq("id", id)
    .eq("user_id", userId)
    .not("deleted_at", "is", null)
    .maybeSingle()

  return history ? "comment" : null
}

export async function restoreTrashItem(id: string): Promise<{ id: string; kind: "profile" | "comment" }> {
  const { supabase, userId } = await getAuthContext()
  const kind = await identifyTrashItemType(supabase, userId, id)
  if (!kind) throw new Error(`Item with id ${id} not found in trash`)

  if (kind === "profile") {
    const { error } = await supabase.rpc("restore_profile_from_trash", { p_profile_id: id })
    if (error) {
      const { error: fbErr } = await supabase.from("voice_profiles").update({ deleted_at: null }).eq("id", id).eq("user_id", userId)
      if (fbErr) throw fbErr
    }
  } else {
    const { error } = await supabase.rpc("restore_history_from_trash", { p_history_id: id })
    if (error) {
      const { error: fbErr } = await supabase.from("generation_history").update({ deleted_at: null }).eq("id", id).eq("user_id", userId)
      if (fbErr) throw fbErr
    }
  }

  return { id, kind }
}

export async function restoreAll() {
  const { supabase } = await getAuthContext()
  const { data, error } = await supabase.rpc("restore_all_from_trash")
  if (error) throw error
  return data
}

export async function deleteTrashItem(id: string): Promise<{ id: string; kind: "profile" | "comment" }> {
  const { supabase, userId } = await getAuthContext()
  const kind = await identifyTrashItemType(supabase, userId, id)
  if (!kind) throw new Error(`Item with id ${id} not found in trash`)

  if (kind === "profile") {
    const { error } = await supabase.rpc("permanently_delete_profile", { p_profile_id: id })
    if (error) {
      const { error: fbErr } = await supabase.from("voice_profiles").delete().eq("id", id).eq("user_id", userId)
      if (fbErr) throw fbErr
    }
  } else {
    const { error } = await supabase.rpc("permanently_delete_history", { p_history_id: id })
    if (error) {
      const { error: fbErr } = await supabase.from("generation_history").delete().eq("id", id).eq("user_id", userId)
      if (fbErr) throw fbErr
    }
  }

  return { id, kind }
}
