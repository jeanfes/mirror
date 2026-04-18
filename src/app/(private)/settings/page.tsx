"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { Globe, SlidersHorizontal } from "lucide-react"
import { toast } from "sonner"
import { Card } from "@/components/ui/Card"
import { Select } from "@/components/ui/Select"
import { Toggle } from "@/components/ui/Toggle"
import { LoadingOverlay, useLoadingDelay } from "@/components/ui/Loading"
import { StatePanel } from "@/components/ui/StatePanel"
import { useProfiles } from "@/features/profiles/hooks/useProfiles"
import { useUserSettings } from "@/features/settings/hooks/useUserSettings"
import { isActiveProfileValidationError } from "@/features/settings/services/user-settings.service"
import { ROUTES } from "@/lib/routes"
import { notifyExtensionSettingsChanged } from "@/lib/extension-bridge"
import { useLanguageStore } from "@/store/useLanguageStore"
import { Button } from "@/components/ui/Button"
import type { UserSettings } from "@/types/database.types"

type UpdateUserSettingsInput = Pick<
    UserSettings,
    | "language"
    | "commentLanguageMode"
    | "activeProfileId"
    | "defaultEmojis"
    | "autoInsert"
    | "desktopAlertsEnabled"
    | "notificationsEnabled"
>

const AUTO_SAVE_DEBOUNCE_MS = 450

const defaultDraft: UpdateUserSettingsInput = {
    language: "es",
    commentLanguageMode: "account",
    activeProfileId: null,
    defaultEmojis: true,
    autoInsert: false,
    desktopAlertsEnabled: false,
    notificationsEnabled: true
}

function areSettingsEqual(left: UpdateUserSettingsInput, right: UpdateUserSettingsInput): boolean {
    return (
        left.language === right.language &&
        left.commentLanguageMode === right.commentLanguageMode &&
        left.activeProfileId === right.activeProfileId &&
        left.defaultEmojis === right.defaultEmojis &&
        left.autoInsert === right.autoInsert &&
        left.desktopAlertsEnabled === right.desktopAlertsEnabled &&
        left.notificationsEnabled === right.notificationsEnabled
    )
}

function buildChangedPayload(
    next: UpdateUserSettingsInput,
    base: UpdateUserSettingsInput
): Partial<UpdateUserSettingsInput> {
    const payload: Partial<UpdateUserSettingsInput> = {}

    if (next.language !== base.language) payload.language = next.language
    if (next.commentLanguageMode !== base.commentLanguageMode)
        payload.commentLanguageMode = next.commentLanguageMode
    if (next.activeProfileId !== base.activeProfileId) payload.activeProfileId = next.activeProfileId
    if (next.defaultEmojis !== base.defaultEmojis) payload.defaultEmojis = next.defaultEmojis
    if (next.autoInsert !== base.autoInsert) payload.autoInsert = next.autoInsert
    if (next.desktopAlertsEnabled !== base.desktopAlertsEnabled)
        payload.desktopAlertsEnabled = next.desktopAlertsEnabled
    if (next.notificationsEnabled !== base.notificationsEnabled)
        payload.notificationsEnabled = next.notificationsEnabled

    return payload
}

export default function SettingsPage() {
    const { data: settings, isLoading, isError, updateSettings, isMutating } = useUserSettings()
    const { data: profiles } = useProfiles()
    const { setLanguage: setAppLanguage, t } = useLanguageStore()
    const showLoading = useLoadingDelay(isLoading)
    const [draft, setDraft] = useState<UpdateUserSettingsInput | null>(null)
    const draftRef = useRef<UpdateUserSettingsInput | null>(null)
    const saveTimeoutRef = useRef<number | null>(null)

    const resolvedSettings = useMemo<UpdateUserSettingsInput>(() => {
        if (draft) return draft
        if (!settings) return defaultDraft

        return {
            language: settings.language,
            commentLanguageMode: settings.commentLanguageMode,
            activeProfileId: settings.activeProfileId,
            defaultEmojis: settings.defaultEmojis,
            autoInsert: settings.autoInsert,
            desktopAlertsEnabled: settings.desktopAlertsEnabled,
            notificationsEnabled: settings.notificationsEnabled
        }
    }, [draft, settings])

    const baseSettings = useMemo<UpdateUserSettingsInput>(() => {
        if (!settings) {
            return defaultDraft
        }

        return {
            language: settings.language,
            commentLanguageMode: settings.commentLanguageMode,
            activeProfileId: settings.activeProfileId,
            defaultEmojis: settings.defaultEmojis,
            autoInsert: settings.autoInsert,
            desktopAlertsEnabled: settings.desktopAlertsEnabled,
            notificationsEnabled: settings.notificationsEnabled
        }
    }, [settings])

    const updateDraft = <K extends keyof UpdateUserSettingsInput>(
        key: K,
        value: UpdateUserSettingsInput[K]
    ) => {
        setDraft((current: UpdateUserSettingsInput | null) => ({
            ...(current ?? resolvedSettings),
            [key]: value
        }))
    }

    const profileOptions = useMemo(() => {
        const baseOption = [{ label: t.app.settings.noActiveProfile, value: "" }]
        const profileItems = (profiles ?? []).map((profile) => ({
            label: profile.name,
            value: profile.id
        }))
        return [...baseOption, ...profileItems]
    }, [profiles, t])

    useEffect(() => {
        draftRef.current = draft
    }, [draft])

    useEffect(() => {
        if (!draft) {
            return
        }

        const initialPayload = buildChangedPayload(draft, baseSettings)
        if (Object.keys(initialPayload).length === 0) {
            return
        }

        if (saveTimeoutRef.current !== null) {
            window.clearTimeout(saveTimeoutRef.current)
        }

        saveTimeoutRef.current = window.setTimeout(() => {
            if (isMutating) {
                return
            }

            const snapshot = draftRef.current
            if (!snapshot) {
                return
            }

            const payload = buildChangedPayload(snapshot, baseSettings)
            if (Object.keys(payload).length === 0) {
                return
            }

            void (async () => {
                try {
                    const saved = await updateSettings(payload)
                    setAppLanguage(saved.language)
                    void notifyExtensionSettingsChanged({ force: true })
                    setDraft((current) =>
                        current && areSettingsEqual(current, snapshot) ? null : current
                    )
                } catch (error) {
                    if (isActiveProfileValidationError(error)) {
                        toast.error(t.app.settings.noActiveProfile)
                        void notifyExtensionSettingsChanged({ force: true })
                        return
                    }

                    toast.error(t.app.settings.preferencesError)
                }
            })()
        }, AUTO_SAVE_DEBOUNCE_MS)

        return () => {
            if (saveTimeoutRef.current !== null) {
                window.clearTimeout(saveTimeoutRef.current)
                saveTimeoutRef.current = null
            }
        }
    }, [baseSettings, draft, isMutating, setAppLanguage, t.app.settings.noActiveProfile, t.app.settings.preferencesError, updateSettings])



    if (showLoading) {
        return <LoadingOverlay show={true} />
    }

    if (isError) {
        return (
            <StatePanel
                tone="error"
                title={t.app.common.accountErrorTitle}
                description={t.app.common.accountErrorDesc}
            />
        )
    }

    return (
        <div className="space-y-6">
            <section className="workspace-hero-shell">
                <div aria-hidden="true" className="absolute -right-14 top-0 h-44 w-44 rounded-full workspace-hero-orb-purple" />
                <div aria-hidden="true" className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full workspace-hero-orb-cyan" />

                <div className="relative">
                    <div className="max-w-2xl">
                        <h1 className="max-w-xl text-4xl font-black tracking-[-0.05em] text-primary-text md:text-5xl">
                            {t.app.settings.heroTitle}
                        </h1>
                        <p className="mt-4 max-w-xl text-[15px] leading-7 text-secondary-text">
                            {t.app.settings.heroDesc}
                        </p>
                    </div>
                </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2">
                <Card className="dashboard-card-lg">
                    <div className="icon-box icon-bg-purple">
                        <SlidersHorizontal className="h-5 w-5" />
                    </div>
                    <h2 className="mt-4 text-[18px] font-semibold tracking-[-0.03em] text-primary-text">{t.app.settings.behaviorTitle}</h2>
                    <p className="mt-2 body-muted">{t.app.settings.behaviorDesc}</p>
                </Card>

                <Card className="dashboard-card-lg">
                    <div className="icon-box icon-bg-amber">
                        <Globe className="h-5 w-5" />
                    </div>
                    <h2 className="mt-4 text-[18px] font-semibold tracking-[-0.03em] text-primary-text">{t.app.settings.languageProfileTitle}</h2>
                    <p className="mt-2 body-muted">{t.app.settings.languageProfileDesc}</p>
                </Card>
            </section>

            <section className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_420px]">
                <Card className="dashboard-card-xl">
                    <div>
                        <div>
                            <p className="dashboard-overline">{t.app.settings.controlsLabel}</p>
                            <h2 className="mt-3 text-[26px] font-semibold tracking-[-0.03em] text-primary-text">{t.app.settings.behaviorQualityTitle}</h2>
                            <p className="mt-2 max-w-2xl body-muted">{t.app.settings.behaviorQualityDesc}</p>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                        <Toggle
                            checked={resolvedSettings.defaultEmojis}
                            onChange={(value) => updateDraft("defaultEmojis", value)}
                            label={t.app.profileForm.allowEmojis}
                            className="min-h-14 rounded-2xl px-4 text-[13px]"
                        />
                        <Toggle
                            checked={resolvedSettings.autoInsert}
                            onChange={(value) => updateDraft("autoInsert", value)}
                            label={t.app.settings.autoInsertLabel}
                            className="min-h-14 rounded-2xl px-4 text-[13px]"
                        />
                    </div>
                </Card>

                <Card className="dashboard-card-xl">
                    <div>
                        <div>
                            <p className="dashboard-overline">{t.app.settings.defaultsLabel}</p>
                            <h2 className="mt-3 section-heading">{t.app.settings.languageBaselineTitle}</h2>
                            <p className="mt-2 body-muted">{t.app.settings.languageBaselineDesc}</p>
                        </div>
                    </div>

                    <div className="mt-5 space-y-4">
                        <Select
                            value={resolvedSettings.commentLanguageMode}
                            onChange={(value) =>
                                updateDraft(
                                    "commentLanguageMode",
                                    value as UpdateUserSettingsInput["commentLanguageMode"]
                                )
                            }
                            label={t.app.settings.commentLanguageModeLabel}
                            triggerClassName="h-11 rounded-2xl"
                            options={[
                                { label: t.app.settings.commentLanguageModePost, value: "post" },
                                { label: t.app.settings.commentLanguageModeAccount, value: "account" }
                            ]}
                        />

                        <Select
                            value={resolvedSettings.activeProfileId ?? ""}
                            onChange={(value) => updateDraft("activeProfileId", value === "" ? null : value)}
                            label={t.app.settings.activeProfileLabel}
                            triggerClassName="h-11 rounded-2xl"
                            options={profileOptions}
                        />
                    </div>

                    <div className="mt-5 rounded-3xl border border-border-soft bg-surface-base p-4">
                        <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-secondary-text">{t.app.settings.whyMattersTitle}</p>
                        <p className="mt-2 body-muted">{t.app.settings.whyMattersDesc}</p>
                    </div>

                </Card>
            </section>

        </div>
    )
}

