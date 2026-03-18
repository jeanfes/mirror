import { getAuthContext } from "@/lib/supabase/auth-context"
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


async function getProfileById(
  supabase: NonNullable<Awaited<ReturnType<typeof getAuthContext>>["supabase"]>,
  userId: string,
  profileId: string
): Promise<VoiceProfile> {
  const { data: profileData, error: profileError } = await supabase
    .from("voice_profiles")
    .select("*")
    .eq("id", profileId)
    .eq("user_id", userId)
    .single()

  if (profileError) throw profileError

  const { data: trainingData, error: trainingError } = await supabase
    .from("style_training")
    .select("*")
    .eq("profile_id", profileId)
    .order("display_order", { ascending: true })

  if (trainingError) throw trainingError

  const examples = (trainingData ?? [])
    .filter((row: StyleTrainingRow) => row.content)
    .map((row: StyleTrainingRow) => row.content)

  return mapRowToProfile(profileData as VoiceProfileRow, examples)
}

export async function listProfiles(): Promise<VoiceProfile[]> {
  const { supabase, userId } = await getAuthContext()

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

export async function createProfile(input: CreateProfileInput): Promise<VoiceProfile> {
  const { supabase, userId } = await getAuthContext()

  const { data: createdProfile, error: createError } = await supabase
    .from("voice_profiles")
    .insert({
      user_id: userId,
      name: input.name,
      description: input.description,
      tone: input.tone,
      allow_emojis: input.allowEmojis,
      enabled: input.enabled
    })
    .select("id")
    .single()

  if (createError) throw createError

  const examples = [input.example1, input.example2, input.example3]
    .map((ex) => ex.trim())
    .filter((ex) => ex.length > 0)

  if (examples.length > 0) {
    const rows = examples.map((content, index) => ({
      profile_id: createdProfile.id,
      kind: "example",
      content,
      display_order: index
    }))
    const { error: examplesError } = await supabase.from("style_training").insert(rows)
    if (examplesError) throw examplesError
  }

  return getProfileById(supabase, userId, createdProfile.id)
}

export async function updateProfile(input: UpdateProfileInput): Promise<VoiceProfile> {
  const { supabase, userId } = await getAuthContext()

  const { error: updateError } = await supabase
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

  return getProfileById(supabase, userId, input.id)
}

export async function toggleProfile(id: string): Promise<VoiceProfile> {
  const { supabase, userId } = await getAuthContext()

  const { data: current, error: currentError } = await supabase
    .from("voice_profiles")
    .select("enabled")
    .eq("id", id)
    .eq("user_id", userId)
    .single()

  if (currentError) throw currentError

  const { error: updateError } = await supabase
    .from("voice_profiles")
    .update({
      enabled: !current.enabled,
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
    .eq("user_id", userId)

  if (updateError) throw updateError

  return getProfileById(supabase, userId, id)
}

export async function moveToTrash(id: string): Promise<{ id: string }> {
  const { supabase } = await getAuthContext()
  const { error } = await supabase.rpc("move_profile_to_trash", { p_profile_id: id })
  
  if (error) {
    const { error: fallbackError } = await supabase
      .from("voice_profiles")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id)
      
    if (fallbackError) throw fallbackError
  }

  return { id }
}

export async function getProfileStats() {
  const { supabase, userId } = await getAuthContext()
  
  const [totalRes, emojiRes] = await Promise.all([
    supabase
      .from("voice_profiles")
      .select("id", { count: "exact" })
      .eq("user_id", userId)
      .is("deleted_at", null),
    supabase
      .from("voice_profiles")
      .select("id", { count: "exact" })
      .eq("user_id", userId)
      .eq("allow_emojis", true)
      .is("deleted_at", null)
  ])

  return {
    totalActive: totalRes.count ?? 0,
    emojiReady: emojiRes.count ?? 0
  }
}
