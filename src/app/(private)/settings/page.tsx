"use client"

import { useMemo, useState } from "react"
import { Globe, SlidersHorizontal } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Select } from "@/components/ui/Select"
import { Toggle } from "@/components/ui/Toggle"
import { LoadingOverlay, useLoadingDelay } from "@/components/ui/Loading"
import { StatePanel } from "@/components/ui/StatePanel"
import { useProfiles } from "@/features/profiles/hooks/useProfiles"
import { useUserSettings } from "@/features/settings/hooks/useUserSettings"
import { useLanguageStore } from "@/store/useLanguageStore"
import type { UserSettings } from "@/types/database.types"

type UpdateUserSettingsInput = Omit<UserSettings, "theme">

const defaultDraft: UpdateUserSettingsInput = {
    language: "es",
    defaultProfileId: null,
    defaultEmojis: true,
    autoInsert: false,
    confirmBeforeApply: false,
    desktopAlertsEnabled: false,
    notificationsEnabled: true,
    onboardingCompleted: false
}

export default function SettingsPage() {
    const { data: settings, isLoading, isError, updateSettings, isMutating } = useUserSettings()
    const { data: profiles } = useProfiles()
    const { setLanguage: setAppLanguage, t } = useLanguageStore()
    const showLoading = useLoadingDelay(isLoading)
    const [draft, setDraft] = useState<UpdateUserSettingsInput | null>(null)

    const resolvedSettings = useMemo<UpdateUserSettingsInput>(() => {
        if (draft) return draft
        if (!settings) return defaultDraft

        return {
            language: settings.language,
            defaultProfileId: settings.defaultProfileId,
            defaultEmojis: settings.defaultEmojis,
            autoInsert: settings.autoInsert,
            confirmBeforeApply: settings.confirmBeforeApply,
            desktopAlertsEnabled: settings.desktopAlertsEnabled,
            notificationsEnabled: settings.notificationsEnabled,
            onboardingCompleted: settings.onboardingCompleted
        }
    }, [draft, settings])

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
        const baseOption = [{ label: t.app.settings.noDefaultProfile, value: "" }]
        const profileItems = (profiles ?? []).map((profile) => ({
            label: profile.name,
            value: profile.id
        }))
        return [...baseOption, ...profileItems]
    }, [profiles, t])

    const handleSave = async () => {
        try {
            const saved = await updateSettings(resolvedSettings)
            setDraft(null)
            setAppLanguage(saved.language as "es" | "en" | "pt" | "fr" | "de")
            toast.success(t.app.settings.preferencesUpdated)
        } catch {
            toast.error(t.app.settings.preferencesError)
        }
    }

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
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="dashboard-overline">{t.app.settings.controlsLabel}</p>
                            <h2 className="mt-3 text-[26px] font-semibold tracking-[-0.03em] text-primary-text">{t.app.settings.behaviorQualityTitle}</h2>
                            <p className="mt-2 max-w-2xl body-muted">{t.app.settings.behaviorQualityDesc}</p>
                        </div>
                        <Button type="button" onClick={handleSave} loading={isMutating}>{t.app.settings.savePreferences}</Button>
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
                        <Toggle
                            checked={resolvedSettings.confirmBeforeApply}
                            onChange={(value) => updateDraft("confirmBeforeApply", value)}
                            label={t.app.settings.confirmBeforeApplyLabel}
                            className="min-h-14 rounded-2xl px-4 text-[13px]"
                        />
                    </div>
                </Card>

                <Card className="dashboard-card-xl">
                    <p className="dashboard-overline">{t.app.settings.defaultsLabel}</p>
                    <h2 className="mt-3 section-heading">{t.app.settings.languageBaselineTitle}</h2>
                    <p className="mt-2 body-muted">{t.app.settings.languageBaselineDesc}</p>

                    <div className="mt-5 space-y-4">
                        <Select
                            value={resolvedSettings.language}
                            onChange={(value) => updateDraft("language", value as UpdateUserSettingsInput["language"])}
                            label={t.app.settings.languageLabel}
                            triggerClassName="h-11 rounded-2xl"
                            options={[
                                { label: t.app.settings.labelEn, value: "en" },
                                { label: t.app.settings.labelEs, value: "es" },
                                { label: t.app.settings.labelPt, value: "pt" },
                                { label: t.app.settings.labelFr, value: "fr" },
                                { label: t.app.settings.labelDe, value: "de" }
                            ]}
                        />

                        <Select
                            value={resolvedSettings.defaultProfileId ?? ""}
                            onChange={(value) => updateDraft("defaultProfileId", value)}
                            label={t.app.settings.defaultProfileLabel}
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

