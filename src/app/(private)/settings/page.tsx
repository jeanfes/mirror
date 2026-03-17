"use client"

import { useMemo, useState } from "react"
import { Globe, ShieldCheck, SlidersHorizontal } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Select } from "@/components/ui/Select"
import { Toggle } from "@/components/ui/Toggle"

export default function SettingsPage() {
    const [autoInsert, setAutoInsert] = useState(false)
    const [saveHistory, setSaveHistory] = useState(true)
    const [language, setLanguage] = useState("en")
    const [strictToneMatch, setStrictToneMatch] = useState(true)
    const [showConfidenceHints, setShowConfidenceHints] = useState(true)
    const [defaultProfile, setDefaultProfile] = useState("adaptive")

    const summary = useMemo(() => {
        const enabledCount = [autoInsert, saveHistory, strictToneMatch, showConfidenceHints].filter(Boolean).length

        return {
            enabledCount,
            automationState: autoInsert ? "Semi-automatic" : "Manual review",
            languageLabel:
                language === "en" ? "English" : language === "es" ? "Spanish" : "Portuguese"
        }
    }, [autoInsert, saveHistory, strictToneMatch, showConfidenceHints, language])

    const handleSave = () => {
        toast.success("Preferences updated")
    }

    return (
        <div className="space-y-6">
            <section className="workspace-hero-shell">
                <div aria-hidden="true" className="absolute -right-14 top-0 h-44 w-44 rounded-full workspace-hero-orb-purple" />
                <div aria-hidden="true" className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full workspace-hero-orb-cyan" />

                <div className="relative grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
                    <div className="max-w-2xl">
                        <h1 className="max-w-xl text-4xl font-black tracking-[-0.05em] text-primary-text md:text-5xl">
                            Tune how Mirror behaves before a comment ever reaches the extension.
                        </h1>
                        <p className="mt-4 max-w-xl text-[15px] leading-7 text-secondary-text">
                            Settings should feel operational, not buried. This screen controls language, automation and quality guardrails so the workflow matches your posting habits.
                        </p>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <div className="workspace-hero-chip">Behavior controls</div>
                            <div className="workspace-hero-chip">Output safeguards</div>
                            <div className="workspace-hero-chip">Language defaults</div>
                        </div>
                    </div>

                    <Card className="dashboard-dark-panel">
                        <h2 className="text-[24px] font-semibold tracking-[-0.03em] text-white">Current setup snapshot</h2>
                        <p className="mt-2 text-[14px] leading-6 text-white/82">A quick summary of how strict, automated and localized the current workspace configuration is.</p>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <div className="dashboard-dark-stat">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/80">Active toggles</p>
                                <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white">{summary.enabledCount}</p>
                            </div>
                            <div className="dashboard-dark-stat">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/80">Mode</p>
                                <p className="mt-2 text-[15px] font-semibold text-white">{summary.automationState}</p>
                            </div>
                            <div className="dashboard-dark-stat">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/80">Language</p>
                                <p className="mt-2 text-[15px] font-semibold text-white">{summary.languageLabel}</p>
                            </div>
                            <div className="dashboard-dark-stat">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/80">Default voice</p>
                                <p className="mt-2 text-[15px] font-semibold text-white">{defaultProfile === "adaptive" ? "Adaptive" : defaultProfile === "insight" ? "Insight Architect" : "Warm Connector"}</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
                <Card className="dashboard-card-lg">
                    <div className="icon-box icon-bg-purple">
                        <SlidersHorizontal className="h-5 w-5" />
                    </div>
                    <h2 className="mt-4 text-[18px] font-semibold tracking-[-0.03em] text-primary-text">Workflow control</h2>
                    <p className="mt-2 body-muted">Decide whether Mirror assists the final insertion flow or waits for explicit review on every generation.</p>
                </Card>

                <Card className="dashboard-card-lg">
                    <div className="icon-box icon-bg-green">
                        <ShieldCheck className="h-5 w-5" />
                    </div>
                    <h2 className="mt-4 text-[18px] font-semibold tracking-[-0.03em] text-primary-text">Quality guardrails</h2>
                    <p className="mt-2 body-muted">Keep tone alignment and confidence hints visible so the extension feels reliable instead of loose.</p>
                </Card>

                <Card className="dashboard-card-lg">
                    <div className="icon-box icon-bg-amber">
                        <Globe className="h-5 w-5" />
                    </div>
                    <h2 className="mt-4 text-[18px] font-semibold tracking-[-0.03em] text-primary-text">Localization defaults</h2>
                    <p className="mt-2 body-muted">Set the default language and baseline profile so the first suggestion already starts near the right voice.</p>
                </Card>
            </section>

            <section className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_420px]">
                <Card className="dashboard-card-xl">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="dashboard-overline">Behavior</p>
                            <h2 className="mt-3 text-[26px] font-semibold tracking-[-0.03em] text-primary-text">How the workspace should behave day to day</h2>
                            <p className="mt-2 max-w-2xl body-muted">These controls affect review friction, archive coverage and how strict the assistant stays with the selected voice.</p>
                        </div>
                        <Button type="button" onClick={handleSave}>Save preferences</Button>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                        <Toggle checked={autoInsert} onChange={setAutoInsert} label="Auto-insert generated comments" className="min-h-14 rounded-2xl px-4 text-[13px]" />
                        <Toggle checked={saveHistory} onChange={setSaveHistory} label="Save generation history" className="min-h-14 rounded-2xl px-4 text-[13px]" />
                        <Toggle checked={strictToneMatch} onChange={setStrictToneMatch} label="Require stricter tone matching" className="min-h-14 rounded-2xl px-4 text-[13px]" />
                        <Toggle checked={showConfidenceHints} onChange={setShowConfidenceHints} label="Show confidence hints in the extension" className="min-h-14 rounded-2xl px-4 text-[13px]" />
                    </div>
                </Card>

                <Card className="dashboard-card-xl">
                    <p className="dashboard-overline">Defaults</p>
                    <h2 className="mt-3 section-heading">Language and profile baseline</h2>
                    <p className="mt-2 body-muted">These choices define how Mirror initializes before you refine a specific generation.</p>

                    <div className="mt-5 space-y-4">
                        <Select
                            value={language}
                            onChange={setLanguage}
                            label="Language"
                            triggerClassName="h-11 rounded-2xl"
                            options={[
                                { label: "English", value: "en" },
                                { label: "Spanish", value: "es" },
                                { label: "Portuguese", value: "pt" }
                            ]}
                        />

                        <Select
                            value={defaultProfile}
                            onChange={setDefaultProfile}
                            label="Default profile"
                            triggerClassName="h-11 rounded-2xl"
                            options={[
                                { label: "Adaptive starter", value: "adaptive" },
                                { label: "Insight Architect", value: "insight" },
                                { label: "Warm Connector", value: "warm" }
                            ]}
                        />
                    </div>

                    <div className="mt-5 rounded-3xl border border-border-soft bg-surface-base p-4">
                        <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-secondary-text">Why this matters</p>
                        <p className="mt-2 body-muted">A good default setup reduces correction work later. The goal is not zero control, but a better first draft every time.</p>
                    </div>
                </Card>
            </section>
        </div>
    )
}

