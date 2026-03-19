"use client"

import { useEffect } from "react"
import { useUserSettings } from "@/features/settings/hooks/useUserSettings"
import { useLanguageStore } from "@/store/useLanguageStore"

export function useSyncSettings() {
    const { data: settings } = useUserSettings()
    const { setLanguage, language } = useLanguageStore()

    useEffect(() => {
        if (settings?.language && settings.language !== language) {
            setLanguage(settings.language)
        }
    }, [settings?.language, language, setLanguage])
}
