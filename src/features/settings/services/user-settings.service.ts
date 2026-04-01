import type { SupabaseClient } from "@supabase/supabase-js"
import type { UserSettings } from "@/types/database.types"

const defaultUserSettings: UserSettings = {
  language: "en",
  theme: "auto",
  defaultProfileId: null,
  desktopAlertsEnabled: false,
  notificationsEnabled: true,
  onboardingCompleted: false,
}

function mapRowToSettings(row: Record<string, unknown>): UserSettings {
  const language = row.language
  const theme = row.theme
  const defaultProfileId = row.default_profile_id
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
    theme:
      theme === "light" || theme === "dark" || theme === "auto"
        ? theme
        : defaultUserSettings.theme,
    defaultProfileId:
      typeof defaultProfileId === "string" ? defaultProfileId : null,
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
  if (input.theme !== undefined) payload.theme = input.theme
  if (input.defaultProfileId !== undefined)
    payload.default_profile_id = input.defaultProfileId
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
