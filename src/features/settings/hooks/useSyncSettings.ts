"use client"

import { useEffect, useRef } from "react"
import { useUserSettings } from "@/features/settings/hooks/useUserSettings"
import { useLanguageStore } from "@/store/useLanguageStore"
import { useTheme } from "@/components/providers/ThemeProvider"
import type { ThemePreference } from "@/lib/theme"

function mapSettingsThemeToPreference(theme: "light" | "dark" | "auto"): ThemePreference {
  return theme === "auto" ? "system" : theme
}

export function useSyncSettings() {
  const { data: settings } = useUserSettings()
  const { setLanguage, language } = useLanguageStore()
  const { themePreference, setThemePreference } = useTheme()

  const prevSettingsRef = useRef<{ language?: string; theme?: string }>({})

  useEffect(() => {
    if (!settings) return

    const prev = prevSettingsRef.current

    if (settings.language && settings.language !== language && settings.language !== prev.language) {
      prevSettingsRef.current.language = settings.language
      setLanguage(settings.language as Parameters<typeof setLanguage>[0])
    }

    if (settings.theme && settings.theme !== prev.theme) {
      const nextThemePreference = mapSettingsThemeToPreference(settings.theme)
      prevSettingsRef.current.theme = settings.theme
      if (nextThemePreference !== themePreference) {
        setThemePreference(nextThemePreference)
      }
    }
  }, [settings, language, themePreference, setLanguage, setThemePreference])
}
