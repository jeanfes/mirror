import { createClient } from "@/lib/supabase/client"

export type SupportedLanguage = "es" | "en" | "pt" | "fr" | "de"

export interface UserSettings {
  language: SupportedLanguage
  defaultProfileId: string
  autoInsertComments: boolean
  autoSaveDrafts: boolean
  requireStrictTone: boolean
  showConfidenceHints: boolean
  desktopAlertsEnabled: boolean
  notificationsEnabled: boolean
}

export interface UpdateUserSettingsInput {
  language: SupportedLanguage
  defaultProfileId: string
  autoInsertComments: boolean
  autoSaveDrafts: boolean
  requireStrictTone: boolean
  showConfidenceHints: boolean
  desktopAlertsEnabled: boolean
  notificationsEnabled: boolean
}

interface UserSettingsRow {
  language: SupportedLanguage
  default_profile_id: string | null
  auto_insert_comments: boolean
  auto_save_drafts: boolean
  require_strict_tone: boolean
  show_confidence_hints: boolean
  desktop_alerts_enabled: boolean
  notifications_enabled: boolean
}

const defaultUserSettings: UserSettings = {
  language: "en",
  defaultProfileId: "",
  autoInsertComments: false,
  autoSaveDrafts: true,
  requireStrictTone: true,
  showConfidenceHints: true,
  desktopAlertsEnabled: false,
  notificationsEnabled: true
}

async function getAuthContext() {
  const supabase = createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data.user) {
    throw new Error("Could not resolve authenticated user")
  }

  return {
    supabase,
    userId: data.user.id
  }
}

function mapRowToSettings(row: UserSettingsRow): UserSettings {
  return {
    language: row.language,
    defaultProfileId: row.default_profile_id ?? "",
    autoInsertComments: row.auto_insert_comments,
    autoSaveDrafts: row.auto_save_drafts,
    requireStrictTone: row.require_strict_tone,
    showConfidenceHints: row.show_confidence_hints,
    desktopAlertsEnabled: row.desktop_alerts_enabled,
    notificationsEnabled: row.notifications_enabled
  }
}

export async function getUserSettings(): Promise<UserSettings> {
  const { supabase, userId } = await getAuthContext()

  const { data, error } = await supabase
    .from("user_settings")
    .select("language, default_profile_id, auto_insert_comments, auto_save_drafts, require_strict_tone, show_confidence_hints, desktop_alerts_enabled, notifications_enabled")
    .eq("user_id", userId)
    .maybeSingle()

  if (error) {
    throw error
  }

  if (!data) {
    const { data: created, error: createError } = await supabase
      .from("user_settings")
      .insert({ user_id: userId })
      .select("language, default_profile_id, auto_insert_comments, auto_save_drafts, require_strict_tone, show_confidence_hints, desktop_alerts_enabled, notifications_enabled")
      .single()

    if (createError) {
      throw createError
    }

    return mapRowToSettings(created as UserSettingsRow)
  }

  return mapRowToSettings(data as UserSettingsRow)
}

export async function updateUserSettings(input: UpdateUserSettingsInput): Promise<UserSettings> {
  const { supabase, userId } = await getAuthContext()

  const { data, error } = await supabase
    .from("user_settings")
    .upsert({
      user_id: userId,
      language: input.language,
      default_profile_id: input.defaultProfileId || null,
      auto_insert_comments: input.autoInsertComments,
      auto_save_drafts: input.autoSaveDrafts,
      require_strict_tone: input.requireStrictTone,
      show_confidence_hints: input.showConfidenceHints,
      desktop_alerts_enabled: input.desktopAlertsEnabled,
      notifications_enabled: input.notificationsEnabled,
      updated_at: new Date().toISOString()
    }, { onConflict: "user_id" })
    .select("language, default_profile_id, auto_insert_comments, auto_save_drafts, require_strict_tone, show_confidence_hints, desktop_alerts_enabled, notifications_enabled")
    .single()

  if (error) {
    throw error
  }

  return mapRowToSettings((data as UserSettingsRow) ?? defaultUserSettings)
}
