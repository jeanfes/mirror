"use client"

import { useSyncSettings } from "@/features/settings/hooks/useSyncSettings"

export function SettingsSyncBridge() {
    useSyncSettings()
    return null
}
