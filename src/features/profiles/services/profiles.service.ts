import type { SupabaseClient } from "@supabase/supabase-js"
import type { VoiceProfile, VoiceProfileRow, StyleTrainingRow } from "@/types/database.types"

export interface CreateProfileInput {
  name: string
  description: string
  tone: string
  example1: string
  example2: string
  example3: string
  allowEmojis: boolean
  enabled: boolean
}

export interface UpdateProfileInput extends CreateProfileInput {
  id: string
}

function mapRowToProfile(row: VoiceProfileRow, examples: string[]): VoiceProfile {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? "",
    tone: row.tone ?? "",
    preferredPhrases: row.preferred_phrases ?? [],
    bannedPhrases: row.banned_phrases ?? [],
    targetLength: row.target_length,
    allowEmojis: row.allow_emojis,
    enabled: row.enabled,
    createdAt: Date.parse(row.created_at),
    updatedAt: Date.parse(row.updated_at),
    examples: [examples[0] ?? "", examples[1] ?? "", examples[2] ?? ""]
  }
}

export async function listProfiles(supabase: SupabaseClient, userId: string): Promise<VoiceProfile[]> {
  const { data: profilesData, error: profilesError } = await supabase
    .from("voice_profiles")
    .select("*")
    .eq("user_id", userId)
    .is("deleted_at", null)
    .order("updated_at", { ascending: false })

  if (profilesError) throw profilesError

  const profileRows = (profilesData ?? []) as VoiceProfileRow[]
  const profileIds = profileRows.map((p) => p.id)

  const examplesByProfileId = new Map<string, string[]>()
  if (profileIds.length > 0) {
    const { data: trainingData, error: trainingError } = await supabase
      .from("style_training")
      .select("*")
      .in("profile_id", profileIds)
      .order("display_order", { ascending: true })

    if (trainingError) throw trainingError

    const rows = (trainingData ?? []) as StyleTrainingRow[]
    for (const row of rows) {
      if (!row.content) continue
      const current = examplesByProfileId.get(row.profile_id) ?? []
      current.push(row.content)
      examplesByProfileId.set(row.profile_id, current)
    }
  }

  return profileRows.map((row) => mapRowToProfile(row, examplesByProfileId.get(row.id) ?? []))
}

export async function createProfile(
  supabase: SupabaseClient, 
  userId: string, 
  input: CreateProfileInput
): Promise<VoiceProfile> {
  const { data: created, error: createError } = await supabase
    .from("voice_profiles")
    .insert({
      user_id: userId,
      name: input.name,
      description: input.description,
      tone: input.tone,
      allow_emojis: input.allowEmojis,
      enabled: input.enabled
    })
    .select("*")
    .single()

  if (createError) throw createError

  const examples = [input.example1, input.example2, input.example3]
    .map((ex) => ex.trim())
    .filter((ex) => ex.length > 0)

  if (examples.length > 0) {
    const rows = examples.map((content, index) => ({
      profile_id: created.id,
      kind: "example",
      content,
      display_order: index
    }))
    const { error: examplesError } = await supabase.from("style_training").insert(rows)
    if (examplesError) throw examplesError
  }

  return mapRowToProfile(created as VoiceProfileRow, examples)
}

export async function updateProfile(
  supabase: SupabaseClient, 
  userId: string, 
  input: UpdateProfileInput
): Promise<VoiceProfile> {
  const { data: updated, error: updateError } = await supabase
    .from("voice_profiles")
    .update({
      name: input.name,
      description: input.description,
      tone: input.tone,
      allow_emojis: input.allowEmojis,
      enabled: input.enabled,
      updated_at: new Date().toISOString()
    })
    .eq("id", input.id)
    .eq("user_id", userId)
    .select("*")
    .single()

  if (updateError) throw updateError

  await supabase.from("style_training").delete().eq("profile_id", input.id)

  const examples = [input.example1, input.example2, input.example3]
    .map((ex) => ex.trim())
    .filter((ex) => ex.length > 0)

  if (examples.length > 0) {
    const rows = examples.map((content, index) => ({
      profile_id: input.id,
      kind: "example",
      content,
      display_order: index
    }))
    const { error: examplesError } = await supabase.from("style_training").insert(rows)
    if (examplesError) throw examplesError
  }

  return mapRowToProfile(updated as VoiceProfileRow, examples)
}

export async function toggleProfile(
  supabase: SupabaseClient, 
  userId: string, 
  id: string, 
  currentEnabled: boolean
): Promise<void> {
  const { error } = await supabase
    .from("voice_profiles")
    .update({
      enabled: !currentEnabled,
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
    .eq("user_id", userId)

  if (error) throw error
}

export async function moveToTrash(
  supabase: SupabaseClient, 
  userId: string, 
  id: string
): Promise<{ id: string }> {
  const { error } = await supabase.rpc("move_profile_to_trash", { p_profile_id: id })
  
  if (error) {
    const { error: fallbackError } = await supabase
      .from("voice_profiles")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", userId)
      
    if (fallbackError) throw fallbackError
  }

  return { id }
}


