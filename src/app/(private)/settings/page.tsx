"use client"

import { useMemo, useState } from "react"
import { Globe2, ShieldCheck, SlidersHorizontal, Sparkles, Workflow } from "lucide-react"
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
            <section className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_360px]">
                <Card elevated className="overflow-hidden border-white/70 p-6 md:p-7">
                    <div className="relative">
                        <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(117,206,243,0.24),transparent_68%)] blur-2xl" />
                        <div className="absolute left-12 top-10 h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.18),transparent_68%)] blur-2xl" />

                        <div className="relative max-w-3xl">
                            <span className="inline-flex items-center gap-2 rounded-full border border-[#E9DDFE] bg-[#F7F1FF] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6D28D9]">
                                <SlidersHorizontal className="h-3.5 w-3.5" />
                                Workspace preferences
                            </span>
                            <h1 className="mt-4 max-w-2xl text-[34px] font-semibold leading-[1.05] tracking-[-0.04em] text-[#141824] md:text-[42px]">
                                Tune how Mirror behaves before a comment ever reaches the extension.
                            </h1>
                            <p className="mt-4 max-w-2xl text-[15px] leading-7 text-slate-600">
                                Settings should feel operational, not buried. This screen controls language, automation and quality guardrails so the workflow matches your posting habits.
                            </p>

                            <div className="mt-6 flex flex-wrap gap-2 text-[12px] font-semibold text-slate-600">
                                <span className="rounded-full border border-[#E6EAF2] bg-white px-3 py-1.5">Behavior controls</span>
                                <span className="rounded-full border border-[#E6EAF2] bg-white px-3 py-1.5">Output safeguards</span>
                                <span className="rounded-full border border-[#E6EAF2] bg-white px-3 py-1.5">Language defaults</span>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="rounded-4xl border-[#171B2D] bg-[#171B2D] p-6 text-white shadow-[0_28px_80px_rgba(15,23,42,0.22)]">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/85">
                        <Sparkles className="h-3.5 w-3.5" />
                        Preference pulse
                    </span>
                    <h2 className="mt-4 text-[24px] font-semibold tracking-[-0.03em] text-white">Current setup snapshot</h2>
                    <p className="mt-2 text-[14px] leading-6 text-white/82">A quick summary of how strict, automated and localized the current workspace configuration is.</p>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <div className="rounded-3xl border border-white/20 bg-white/12 p-4">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/80">Active toggles</p>
                            <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white">{summary.enabledCount}</p>
                        </div>
                        <div className="rounded-3xl border border-white/20 bg-white/12 p-4">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/80">Mode</p>
                            <p className="mt-2 text-[15px] font-semibold text-white">{summary.automationState}</p>
                        </div>
                        <div className="rounded-3xl border border-white/20 bg-white/12 p-4">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/80">Language</p>
                            <p className="mt-2 text-[15px] font-semibold text-white">{summary.languageLabel}</p>
                        </div>
                        <div className="rounded-3xl border border-white/20 bg-white/12 p-4">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/80">Default voice</p>
                            <p className="mt-2 text-[15px] font-semibold text-white">{defaultProfile === "adaptive" ? "Adaptive" : defaultProfile === "insight" ? "Insight Architect" : "Warm Connector"}</p>
                        </div>
                    </div>
                </Card>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
                <Card className="rounded-[28px] p-5">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(139,92,246,0.14),rgba(117,206,243,0.14))] text-[#141824]">
                        <Workflow className="h-5 w-5" />
                    </div>
                    <h2 className="mt-4 text-[18px] font-semibold tracking-[-0.03em] text-[#141824]">Workflow control</h2>
                    <p className="mt-2 text-[14px] leading-6 text-slate-600">Decide whether Mirror assists the final insertion flow or waits for explicit review on every generation.</p>
                </Card>

                <Card className="rounded-[28px] p-5">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(16,185,129,0.14),rgba(125,211,252,0.14))] text-[#141824]">
                        <ShieldCheck className="h-5 w-5" />
                    </div>
                    <h2 className="mt-4 text-[18px] font-semibold tracking-[-0.03em] text-[#141824]">Quality guardrails</h2>
                    <p className="mt-2 text-[14px] leading-6 text-slate-600">Keep tone alignment and confidence hints visible so the extension feels reliable instead of loose.</p>
                </Card>

                <Card className="rounded-[28px] p-5">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(251,191,36,0.18),rgba(248,250,252,0.2))] text-[#141824]">
                        <Globe2 className="h-5 w-5" />
                    </div>
                    <h2 className="mt-4 text-[18px] font-semibold tracking-[-0.03em] text-[#141824]">Localization defaults</h2>
                    <p className="mt-2 text-[14px] leading-6 text-slate-600">Set the default language and baseline profile so the first suggestion already starts near the right voice.</p>
                </Card>
            </section>

            <section className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_420px]">
                <Card className="rounded-4xl p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-600">Behavior</p>
                            <h2 className="mt-3 text-[26px] font-semibold tracking-[-0.03em] text-[#141824]">How the workspace should behave day to day</h2>
                            <p className="mt-2 max-w-2xl text-[14px] leading-6 text-slate-600">These controls affect review friction, archive coverage and how strict the assistant stays with the selected voice.</p>
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

                <Card className="rounded-4xl p-6">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-600">Defaults</p>
                    <h2 className="mt-3 text-[24px] font-semibold tracking-[-0.03em] text-[#141824]">Language and profile baseline</h2>
                    <p className="mt-2 text-[14px] leading-6 text-slate-600">These choices define how Mirror initializes before you refine a specific generation.</p>

                    <div className="mt-5 space-y-4">
                        <Select
                            value={language}
                            onChange={setLanguage}
                            options={[
                                { label: "English", value: "en" },
                                { label: "Spanish", value: "es" },
                                { label: "Portuguese", value: "pt" }
                            ]}
                        />

                        <Select
                            value={defaultProfile}
                            onChange={setDefaultProfile}
                            options={[
                                { label: "Adaptive starter", value: "adaptive" },
                                { label: "Insight Architect", value: "insight" },
                                { label: "Warm Connector", value: "warm" }
                            ]}
                        />
                    </div>

                    <div className="mt-5 rounded-3xl border border-[#E8ECF4] bg-white/70 p-4">
                        <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-600">Why this matters</p>
                        <p className="mt-2 text-[14px] leading-6 text-slate-600">A good default setup reduces correction work later. The goal is not zero control, but a better first draft every time.</p>
                    </div>
                </Card>
            </section>
        </div>
    )
}
