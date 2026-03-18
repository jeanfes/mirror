import { getAuthContext } from "@/lib/supabase/auth-context"
import type { UserSettings } from "@/types/database.types"
const defaultUserSettings: UserSettings = {
  language: "en",
  theme: "auto",
  defaultProfileId: null,
  autoInsertComments: false,
  autoSaveDrafts: true,
  requireStrictTone: true,
  showConfidenceHints: true,
  desktopAlertsEnabled: false,
  notificationsEnabled: true,
  onboardingCompleted: false
}

function mapRowToSettings(row: Record<string, unknown>): UserSettings {
  const language = row.language
  const theme = row.theme
  const defaultProfileId = row.default_profile_id
  const autoInsertComments = row.auto_insert_comments
  const autoSaveDrafts = row.auto_save_drafts
  const requireStrictTone = row.require_strict_tone
  const showConfidenceHints = row.show_confidence_hints
  const desktopAlertsEnabled = row.desktop_alerts_enabled
  const notificationsEnabled = row.notifications_enabled
  const onboardingCompleted = row.onboarding_completed

  return {
    language:
      language === "es" || language === "en" || language === "pt" || language === "fr" || language === "de"
        ? language
        : defaultUserSettings.language,
    theme: theme === "light" || theme === "dark" || theme === "auto" ? theme : defaultUserSettings.theme,
    defaultProfileId: typeof defaultProfileId === "string" ? defaultProfileId : null,
    autoInsertComments: typeof autoInsertComments === "boolean" ? autoInsertComments : false,
    autoSaveDrafts: typeof autoSaveDrafts === "boolean" ? autoSaveDrafts : true,
    requireStrictTone: typeof requireStrictTone === "boolean" ? requireStrictTone : true,
    showConfidenceHints: typeof showConfidenceHints === "boolean" ? showConfidenceHints : true,
    desktopAlertsEnabled: typeof desktopAlertsEnabled === "boolean" ? desktopAlertsEnabled : false,
    notificationsEnabled: typeof notificationsEnabled === "boolean" ? notificationsEnabled : true,
    onboardingCompleted: typeof onboardingCompleted === "boolean" ? onboardingCompleted : false
  }
}

export async function getUserSettings(): Promise<UserSettings> {
  const { supabase, userId } = await getAuthContext()

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

export async function updateUserSettings(input: Partial<UserSettings>): Promise<UserSettings> {
  const { supabase, userId } = await getAuthContext()
  const payload: Record<string, unknown> = { user_id: userId, updated_at: new Date().toISOString() }
  if (input.language !== undefined) payload.language = input.language
  if (input.theme !== undefined) payload.theme = input.theme
  if (input.defaultProfileId !== undefined) payload.default_profile_id = input.defaultProfileId
  if (input.autoInsertComments !== undefined) payload.auto_insert_comments = input.autoInsertComments
  if (input.autoSaveDrafts !== undefined) payload.auto_save_drafts = input.autoSaveDrafts
  if (input.requireStrictTone !== undefined) payload.require_strict_tone = input.requireStrictTone
  if (input.showConfidenceHints !== undefined) payload.show_confidence_hints = input.showConfidenceHints
  if (input.desktopAlertsEnabled !== undefined) payload.desktop_alerts_enabled = input.desktopAlertsEnabled
  if (input.notificationsEnabled !== undefined) payload.notifications_enabled = input.notificationsEnabled
  if (input.onboardingCompleted !== undefined) payload.onboarding_completed = input.onboardingCompleted

  const { data, error } = await supabase
    .from("user_settings")
    .upsert(payload, { onConflict: "user_id" })
    .select("*")
    .single()

  if (error) throw error
  if (input.theme && typeof window !== "undefined") {
    let resolvedTheme = input.theme
    if (resolvedTheme === "auto") {
      resolvedTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    }
    document.documentElement.setAttribute("data-theme", resolvedTheme)
  }

  return mapRowToSettings(data)
}

export async function updateUserName(name: string): Promise<void> {
  const { supabase, userId } = await getAuthContext()
  const { error } = await supabase
    .from("user_profiles")
    .update({ name })
    .eq("id", userId)

  if (error) throw error
}

export async function updateUserAvatar(file: File): Promise<string> {
  const { supabase, userId } = await getAuthContext()
  
  const ext = file.name.split('.').pop()
  const path = `${userId}/avatar.${ext}`

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(path, file, { upsert: true })

  if (uploadError) throw uploadError

  const { data: { publicUrl } } = supabase.storage
    .from("avatars")
    .getPublicUrl(path)

  const { error: updateError } = await supabase
    .from("user_profiles")
    .update({ avatar_url: publicUrl, avatar_source: "upload" })
    .eq("id", userId)

  if (updateError) throw updateError

  return publicUrl
}

export async function exportUserData() {
  const { supabase } = await getAuthContext()
  const { data, error } = await supabase.functions.invoke("export-data", {})

  if (error) throw error
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `mirror-export-${new Date().toISOString().split("T")[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export async function deleteAccount() {
  const { supabase } = await getAuthContext()
  const { data, error } = await supabase.functions.invoke("delete-account", { body: {} })
  
  if (error) throw error

  if (data?.ok) {
    await supabase.auth.signOut()
    if (typeof window !== "undefined") {
      window.location.href = "/"
    }
  }
  
  return data
}

