"use client"

import { useMemo, useState } from "react"
import { Globe, SlidersHorizontal, Lock, ArrowRight } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { ROUTES } from "@/lib/routes"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Select } from "@/components/ui/Select"
import { Toggle } from "@/components/ui/Toggle"
import { LoadingOverlay, useLoadingDelay } from "@/components/ui/Loading"
import { StatePanel } from "@/components/ui/StatePanel"
import { useProfiles } from "@/features/profiles/hooks/useProfiles"
import { useUserSettings } from "@/features/settings/hooks/useUserSettings"
import { useLanguageStore } from "@/store/useLanguageStore"
import type { UpdateUserSettingsInput } from "@/features/settings/services/user-settings.service"

const defaultDraft: UpdateUserSettingsInput = {
    language: "en",
    defaultProfileId: "",
    autoInsertComments: false,
    autoSaveDrafts: true,
    requireStrictTone: true,
    showConfidenceHints: true,
    desktopAlertsEnabled: false,
    notificationsEnabled: true
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
            autoInsertComments: settings.autoInsertComments,
            autoSaveDrafts: settings.autoSaveDrafts,
            requireStrictTone: settings.requireStrictTone,
            showConfidenceHints: settings.showConfidenceHints,
            desktopAlertsEnabled: settings.desktopAlertsEnabled,
            notificationsEnabled: settings.notificationsEnabled
        }
    }, [draft, settings])

    const updateDraft = <K extends keyof UpdateUserSettingsInput>(
        key: K,
        value: UpdateUserSettingsInput[K]
    ) => {
        setDraft((current) => ({
            ...(current ?? resolvedSettings),
            [key]: value
        }))
    }

    const profileOptions = useMemo(() => {
        const baseOption = [{ label: "No default profile", value: "" }]
        const profileItems = (profiles ?? []).map((profile) => ({
            label: profile.name,
            value: profile.id
        }))
        return [...baseOption, ...profileItems]
    }, [profiles])

    const handleSave = async () => {
        try {
            const saved = await updateSettings(resolvedSettings)
            setDraft(null)
            setAppLanguage(saved.language as "es" | "en" | "pt" | "fr" | "de")
            toast.success("Preferences updated")
        } catch {
            toast.error("Could not save preferences")
        }
    }

    if (showLoading) {
        return <LoadingOverlay show={true} />
    }

    if (isError) {
        return (
            <StatePanel
                tone="error"
                title={t.app.accountErrorTitle}
                description={t.app.accountErrorDesc}
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
                            Configure Mirror in one place, without jumping between sections.
                        </h1>
                        <p className="mt-4 max-w-xl text-[15px] leading-7 text-secondary-text">
                            Keep only what matters: automation behavior, output quality defaults, language and a default voice profile.
                        </p>
                    </div>
                </div>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
                <Card className="dashboard-card-lg">
                    <div className="icon-box icon-bg-purple">
                        <SlidersHorizontal className="h-5 w-5" />
                    </div>
                    <h2 className="mt-4 text-[18px] font-semibold tracking-[-0.03em] text-primary-text">Behavior and safeguards</h2>
                    <p className="mt-2 body-muted">Define review friction and tone strictness in one section.</p>
                </Card>

                <Card className="dashboard-card-lg">
                    <div className="icon-box icon-bg-amber">
                        <Globe className="h-5 w-5" />
                    </div>
                    <h2 className="mt-4 text-[18px] font-semibold tracking-[-0.03em] text-primary-text">Language and default profile</h2>
                    <p className="mt-2 body-muted">Set startup defaults so every generation starts close to your voice.</p>
                </Card>

                <Link href={`${ROUTES.private.settings}/security`} className="block group">
                    <Card className="dashboard-card-lg h-full transition-all group-hover:border-accent-purple/30 group-hover:bg-surface-elevated/50">
                        <div className="icon-box icon-bg-blue">
                            <Lock className="h-5 w-5" />
                        </div>
                        <h2 className="mt-4 text-[18px] font-semibold tracking-[-0.03em] text-primary-text group-hover:text-accent-purple transition-colors flex items-center gap-2">
                            Security and Password
                            <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                        </h2>
                        <p className="mt-2 body-muted">Manage your account authentication and keep your access secure.</p>
                    </Card>
                </Link>
            </section>

            <section className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_420px]">
                <Card className="dashboard-card-xl">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="dashboard-overline">Controls</p>
                            <h2 className="mt-3 text-[26px] font-semibold tracking-[-0.03em] text-primary-text">Behavior and output quality</h2>
                            <p className="mt-2 max-w-2xl body-muted">Use these toggles to control automation, history capture and tone strictness.</p>
                        </div>
                        <Button type="button" onClick={handleSave} loading={isMutating}>Save preferences</Button>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                        <Toggle checked={resolvedSettings.autoInsertComments} onChange={(value) => updateDraft("autoInsertComments", value)} label="Auto-insert generated comments" className="min-h-14 rounded-2xl px-4 text-[13px]" />
                        <Toggle checked={resolvedSettings.autoSaveDrafts} onChange={(value) => updateDraft("autoSaveDrafts", value)} label="Save generation history" className="min-h-14 rounded-2xl px-4 text-[13px]" />
                        <Toggle checked={resolvedSettings.requireStrictTone} onChange={(value) => updateDraft("requireStrictTone", value)} label="Require stricter tone matching" className="min-h-14 rounded-2xl px-4 text-[13px]" />
                        <Toggle checked={resolvedSettings.showConfidenceHints} onChange={(value) => updateDraft("showConfidenceHints", value)} label="Show confidence hints in the extension" className="min-h-14 rounded-2xl px-4 text-[13px]" />
                    </div>
                </Card>

                <Card className="dashboard-card-xl">
                    <p className="dashboard-overline">Defaults</p>
                    <h2 className="mt-3 section-heading">Language and profile baseline</h2>
                    <p className="mt-2 body-muted">These choices define how Mirror initializes before each generation.</p>

                    <div className="mt-5 space-y-4">
                        <Select
                            value={resolvedSettings.language}
                            onChange={(value) => updateDraft("language", value as UpdateUserSettingsInput["language"])}
                            label="Language"
                            triggerClassName="h-11 rounded-2xl"
                            options={[
                                { label: "English", value: "en" },
                                { label: "Spanish", value: "es" },
                                { label: "Portuguese", value: "pt" },
                                { label: "French", value: "fr" },
                                { label: "German", value: "de" }
                            ]}
                        />

                        <Select
                            value={resolvedSettings.defaultProfileId}
                            onChange={(value) => updateDraft("defaultProfileId", value)}
                            label="Default profile"
                            triggerClassName="h-11 rounded-2xl"
                            options={profileOptions}
                        />
                    </div>

                    <div className="mt-5 rounded-3xl border border-border-soft bg-surface-base p-4">
                        <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-secondary-text">Why this matters</p>
                        <p className="mt-2 body-muted">Good defaults reduce manual cleanup and keep results consistent with your normal writing style.</p>
                    </div>
                </Card>
            </section>
        </div>
    )
}

