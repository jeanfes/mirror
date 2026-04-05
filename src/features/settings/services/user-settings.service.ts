import type { SupabaseClient } from "@supabase/supabase-js"
import type { UserSettings } from "@/types/database.types"

const defaultUserSettings: UserSettings = {
  language: "es",
  commentLanguageMode: "account",
  theme: "auto",
  defaultProfileId: null,
  defaultEmojis: true,
  autoInsert: false,
  confirmBeforeApply: false,
  desktopAlertsEnabled: false,
  notificationsEnabled: true,
  onboardingCompleted: false,
}

function mapRowToSettings(row: Record<string, unknown>): UserSettings {
  const language = row.language
  const theme = row.theme
  const defaultProfileId = row.default_profile_id
  const defaultEmojis = row.default_emojis
  const autoInsert = row.auto_insert
  const confirmBeforeApply = row.confirm_before_apply
  const commentLanguageMode = row.comment_language_mode
  const desktopAlertsEnabled = row.desktop_alerts_enabled
  const notificationsEnabled = row.notifications_enabled
  const onboardingCompleted = row.onboarding_completed

  return {
    language:
      language === "es" ||
      language === "en" ||
      language === "pt" ||
      language === "fr" ||
      language === "de"
        ? language
        : defaultUserSettings.language,
    commentLanguageMode:
      commentLanguageMode === "post" || commentLanguageMode === "account"
        ? commentLanguageMode
        : defaultUserSettings.commentLanguageMode,
    theme:
      theme === "light" || theme === "dark" || theme === "auto"
        ? theme
        : defaultUserSettings.theme,
    defaultProfileId:
      typeof defaultProfileId === "string" ? defaultProfileId : null,
    defaultEmojis:
      typeof defaultEmojis === "boolean" ? defaultEmojis : true,
    autoInsert:
      typeof autoInsert === "boolean" ? autoInsert : false,
    confirmBeforeApply:
      typeof confirmBeforeApply === "boolean" ? confirmBeforeApply : false,
    desktopAlertsEnabled:
      typeof desktopAlertsEnabled === "boolean" ? desktopAlertsEnabled : false,
    notificationsEnabled:
      typeof notificationsEnabled === "boolean" ? notificationsEnabled : true,
    onboardingCompleted:
      typeof onboardingCompleted === "boolean" ? onboardingCompleted : false,
  }
}

export async function getUserSettings(
  supabase: SupabaseClient,
  userId: string
): Promise<UserSettings> {
  const { data, error } = await supabase
    .from("user_settings")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle()

  if (error) throw error

  if (!data) {
    const { data: created, error: createError } = await supabase
      .from("user_settings")
      .insert({ user_id: userId })
      .select("*")
      .single()

    if (createError) throw createError
    return mapRowToSettings(created)
  }

  return mapRowToSettings(data)
}

export async function updateUserSettings(
  supabase: SupabaseClient,
  userId: string,
  input: Partial<UserSettings>
): Promise<UserSettings> {
  const payload: Record<string, unknown> = {
    user_id: userId,
    updated_at: new Date().toISOString(),
  }

  if (input.language !== undefined) payload.language = input.language
  if (input.commentLanguageMode !== undefined)
    payload.comment_language_mode = input.commentLanguageMode
  if (input.theme !== undefined) payload.theme = input.theme
  if (input.defaultProfileId !== undefined)
    payload.default_profile_id = input.defaultProfileId
  if (input.defaultEmojis !== undefined)
    payload.default_emojis = input.defaultEmojis
  if (input.autoInsert !== undefined)
    payload.auto_insert = input.autoInsert
  if (input.confirmBeforeApply !== undefined)
    payload.confirm_before_apply = input.confirmBeforeApply
  if (input.desktopAlertsEnabled !== undefined)
    payload.desktop_alerts_enabled = input.desktopAlertsEnabled
  if (input.notificationsEnabled !== undefined)
    payload.notifications_enabled = input.notificationsEnabled
  if (input.onboardingCompleted !== undefined)
    payload.onboarding_completed = input.onboardingCompleted

  const { data, error } = await supabase
    .from("user_settings")
    .upsert(payload, { onConflict: "user_id" })
    .select("*")
    .single()

  if (error) throw error

  return mapRowToSettings(data)
}
