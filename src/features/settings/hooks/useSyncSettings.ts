"use client"

import { useEffect } from "react"
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

    useEffect(() => {
        if (settings?.language && settings.language !== language) {
            setLanguage(settings.language)
        }
    }, [settings?.language, language, setLanguage])

    useEffect(() => {
        if (!settings?.theme) {
            return
        }

        const nextThemePreference = mapSettingsThemeToPreference(settings.theme)
        if (nextThemePreference !== themePreference) {
            setThemePreference(nextThemePreference)
        }
    }, [settings?.theme, setThemePreference, themePreference])
}
