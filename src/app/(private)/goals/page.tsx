"use client"

import { useCallback, useMemo, useState } from "react"
import { Check, Flag, Sparkles, Plus, MoreHorizontal, Trash2, Edit2, Layout, Zap, Download } from "lucide-react"
import { toast } from "sonner"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/DropdownMenu"
import { LoadingOverlay } from "@/components/ui/Loading"
import { StatePanel } from "@/components/ui/StatePanel"
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"
import { useHistory } from "@/features/history/hooks/useHistory"
import { useUserSettings } from "@/features/settings/hooks/useUserSettings"
import { startDataExport } from "@/features/settings/services/account-data.service"
import { createClient } from "@/lib/supabase/client"
import { notifyExtensionSettingsChanged } from "@/lib/extension-bridge"
import { useLanguageStore } from "@/store/useLanguageStore"
import type {
    GoalType,
    ObjectiveProfile,
    PlatformId,
    UserSettings
} from "@/types/database.types"
import { GoalFormDialog, type GoalFormValues } from "./components/GoalFormDialog"

const PLATFORM_ORDER: PlatformId[] = ["linkedin", "upwork", "twitter", "reddit", "youtube"]

const GOAL_TYPE_TO_HISTORY_VALUE: Record<GoalType, string> = {
    "Add Value": "add_value",
    Challenge: "challenge",
    Networking: "networking",
    Question: "question",
    Proposal: "proposal"
}

type GoalMetrics = {
    generated: number
    applied: number
    applyRate: number
}

function isObjectiveApplicable(objective: ObjectiveProfile, platformId: PlatformId): boolean {
    return objective.active && objective.scope.includes(platformId)
}

export default function GoalsPage() {
    const { data: settings, isLoading, isError, updateSettings, isMutating } = useUserSettings()
    const { data: history } = useHistory()
    const { t } = useLanguageStore()

    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingGoal, setEditingGoal] = useState<ObjectiveProfile | null>(null)
    const [goalToDelete, setGoalToDelete] = useState<string | null>(null)
    const [isExporting, setIsExporting] = useState(false)
    const supabase = createClient()

    const platformLabelById = useMemo<Record<PlatformId, string>>(
        () => ({
            linkedin: t.app.settings.platformLinkedIn,
            upwork: t.app.settings.platformUpwork,
            twitter: t.app.settings.platformTwitter,
            reddit: t.app.settings.platformReddit,
            youtube: t.app.settings.platformYoutube
        }),
        [t]
    )

    const objectiveLibrary = useMemo<ObjectiveProfile[]>(
        () => settings?.objectiveLibrary ?? [],
        [settings?.objectiveLibrary]
    )

    const localizedBaseObjectiveNames = useMemo<Record<string, string>>(() => {
        return (t.app.goals.baseObjectiveNames ?? {}) as Record<string, string>
    }, [t])

    const localizedBaseObjectiveDescriptions = useMemo<Record<string, string>>(() => {
        return (t.app.goals.baseObjectiveDescriptions ?? {}) as Record<string, string>
    }, [t])

    const getObjectiveDisplayName = useCallback((objective: ObjectiveProfile): string => {
        if (objective.source === "platform_base") {
            return localizedBaseObjectiveNames[objective.id] ?? objective.name
        }
        return objective.name
    }, [localizedBaseObjectiveNames])

    const getObjectiveDisplayDescription = useCallback((objective: ObjectiveProfile): string => {
        if (objective.source === "platform_base") {
            return (
                localizedBaseObjectiveDescriptions[objective.id] ||
                objective.description ||
                objective.strategyPrompt ||
                ""
            )
        }

        return objective.description || objective.strategyPrompt || ""
    }, [localizedBaseObjectiveDescriptions])

    const activeObjectiveLibrary = useMemo<ObjectiveProfile[]>(
        () => objectiveLibrary.filter((item: ObjectiveProfile) => item.active),
        [objectiveLibrary]
    )

    const userObjectives = useMemo<ObjectiveProfile[]>(
        () => objectiveLibrary.filter((item: ObjectiveProfile) => item.source !== "platform_base"),
        [objectiveLibrary]
    )

    const goalMetricsByType = useMemo<Record<GoalType, GoalMetrics>>(() => {
        const seed = (): GoalMetrics => ({ generated: 0, applied: 0, applyRate: 0 })
        const metrics: Record<GoalType, GoalMetrics> = {
            "Add Value": seed(),
            Challenge: seed(),
            Networking: seed(),
            Question: seed(),
            Proposal: seed()
        }

        for (const item of history ?? []) {
            const goalType = (Object.keys(GOAL_TYPE_TO_HISTORY_VALUE) as GoalType[])
                .find((candidate) => GOAL_TYPE_TO_HISTORY_VALUE[candidate] === item.goal)
            if (!goalType) continue
            metrics[goalType].generated += 1
            if (item.status === "applied") metrics[goalType].applied += 1
        }

        for (const goalType of Object.keys(metrics) as GoalType[]) {
            const snapshot = metrics[goalType]
            snapshot.applyRate = snapshot.generated > 0 ? Math.round((snapshot.applied / snapshot.generated) * 100) : 0
        }
        return metrics
    }, [history])

    const recommendedObjectivesByPlatform = useMemo(() => {
        return PLATFORM_ORDER.map((platformId) => {
            const rankedObjectives = activeObjectiveLibrary
                .filter((objective) => isObjectiveApplicable(objective, platformId))
                .map((objective) => {
                    const metrics = goalMetricsByType[objective.canonicalGoal]
                    const score = metrics.applied * 3 + metrics.generated
                    return { objective, metrics, score }
                })
                .sort((left, right) => right.score - left.score || right.metrics.applyRate - left.metrics.applyRate || left.objective.name.localeCompare(right.objective.name))

            return { platformId, topObjectives: rankedObjectives }
        })
    }, [activeObjectiveLibrary, goalMetricsByType])

    const patchGoals = async (payload: Partial<UserSettings>, options?: { successToast?: boolean }) => {
        try {
            await updateSettings(payload)
            void notifyExtensionSettingsChanged({ force: true })
            if (options?.successToast !== false) toast.success(t.app.goals.saved)
            return true
        } catch {
            toast.error(t.app.goals.saveError)
            return false
        }
    }

    const handleCreateOrUpdateGoal = async (values: GoalFormValues, goalId?: string): Promise<void> => {
        if (!settings) return
        let nextLibrary = [...settings.objectiveLibrary]
        const normalizedValues = {
            name: values.name.trim(),
            canonicalGoal: values.canonicalGoal,
            strategyPrompt: values.strategyPrompt.trim(),
            scope: values.scope as PlatformId[],
            active: values.active,
            description: values.description?.trim() ?? ""
        }

        if (goalId) {
            nextLibrary = nextLibrary.map(g => g.id === goalId ? { ...g, ...normalizedValues, updatedAt: Date.now() } : g)
        } else {
            const duplicate = nextLibrary.some(g => g.name.toLowerCase() === normalizedValues.name.toLowerCase())
            if (duplicate) {
                toast.error(t.app.goals.duplicateNameError)
                return
            }

            const now = Date.now()
            nextLibrary.push({
                id: crypto.randomUUID(),
                ...normalizedValues,
                source: "user_custom",
                createdAt: now,
                updatedAt: now
            })
        }

        await patchGoals({ objectiveLibrary: nextLibrary })
        setIsFormOpen(false)
        setEditingGoal(null)
    }

    const toggleObjectiveActive = async (objectiveId: string) => {
        if (!settings) return
        const nextLibrary = settings.objectiveLibrary.map(item =>
            item.id === objectiveId ? { ...item, active: !item.active, updatedAt: Date.now() } : item
        )
        await patchGoals({ objectiveLibrary: nextLibrary }, { successToast: false })
    }

    const removeObjective = async (objectiveId: string) => {
        if (!settings) return
        const nextLibrary = settings.objectiveLibrary.filter(item => item.id !== objectiveId)
        await patchGoals({ objectiveLibrary: nextLibrary })
        setGoalToDelete(null)
    }

    const handleExportOne = async (objectiveId: string) => {
        try {
            setIsExporting(true)
            const downloadUrl = await startDataExport(supabase, { profiles: [], objectives: [objectiveId] })
            if (downloadUrl) {
                const link = document.createElement("a")
                link.href = downloadUrl
                link.download = `mirror-export-objective.json`
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                setTimeout(() => URL.revokeObjectURL(downloadUrl), 500)
            }
            toast.success(t.app.settingsModal.backupStarted)
        } catch {
            toast.error(t.app.common.exportError)
        } finally {
            setIsExporting(false)
        }
    }

    const handleExportAll = async () => {
        try {
            setIsExporting(true)
            const downloadUrl = await startDataExport(supabase, { profiles: [], objectives: userObjectives.map(o => o.id) })
            if (downloadUrl) {
                const link = document.createElement("a")
                link.href = downloadUrl
                link.download = `mirror-export-objectives.json`
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                setTimeout(() => URL.revokeObjectURL(downloadUrl), 500)
            }
            toast.success(t.app.settingsModal.backupStarted)
        } catch {
            toast.error(t.app.common.exportError)
        } finally {
            setIsExporting(false)
        }
    }

    if (isLoading || !settings) {
        return <LoadingOverlay show={true} />
    }

    if (isError) {
        return <StatePanel tone="error" title={t.app.common.accountErrorTitle} description={t.app.common.accountErrorDesc} />
    }

    return (
        <div className="w-full space-y-8 pb-20">
            {/* Mirror Hero */}
            <section className="workspace-hero-shell">
                <div aria-hidden="true" className="absolute -right-8 top-0 h-32 w-32 rounded-full opacity-80 workspace-hero-orb-purple sm:-right-12 sm:h-40 sm:w-40 sm:opacity-100 md:-right-14 md:h-44 md:w-44" />
                <div aria-hidden="true" className="absolute -bottom-12 -left-6 h-28 w-28 rounded-full opacity-80 workspace-hero-orb-cyan sm:-bottom-14 sm:-left-8 sm:h-36 sm:w-36 sm:opacity-100 md:-bottom-16 md:-left-10 md:h-40 md:w-40" />

                <div className="relative grid gap-5 md:grid-cols-[1.12fr_0.88fr] md:items-start md:gap-4 lg:grid-cols-[1.15fr_0.85fr] lg:gap-6">
                    <div className="max-w-2xl md:max-w-none">
                        <h1 className="text-3xl font-black tracking-[-0.05em] text-primary-text sm:text-4xl md:text-[2.55rem] lg:text-5xl">
                            {t.app.goals.heroTitle}
                        </h1>
                        <p className="mt-3 text-[14px] leading-6 text-secondary-text sm:mt-4 sm:text-[15px] sm:leading-7">
                            {t.app.goals.heroDesc}
                        </p>

                        <div className="mt-5 flex flex-wrap gap-2.5 sm:mt-6 sm:gap-3">
                            <div className="workspace-hero-chip">
                                <Layout className="h-4 w-4 text-primary-text" />
                                {t.app.goals.modeTitle}
                            </div>
                            <div className="workspace-hero-chip">
                                <Zap className="h-4 w-4 text-primary-text" />
                                {t.app.goals.metricApplied}
                            </div>
                        </div>
                    </div>

                    <div className="dashboard-dark-panel p-4 sm:p-5 md:p-4 lg:p-5">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/60 sm:text-[12px]">{t.app.goals.recommendedObjectivesTitle}</p>
                                <p className="mt-1.5 text-[2rem] font-black tracking-[-0.04em] sm:mt-2 sm:text-3xl">{PLATFORM_ORDER.length}</p>
                            </div>
                            <Button
                                onClick={() => { setEditingGoal(null); setIsFormOpen(true); }}
                                className="h-10 whitespace-nowrap border border-border-soft bg-surface-elevated px-3 text-[13px] text-primary-text hover:bg-surface-hover sm:px-4"
                            >
                                <Plus className="h-4 w-4" />
                                {t.app.goals.createObjective}
                            </Button>
                        </div>
                        <div className="mt-5 sm:mt-6">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/50 sm:text-[12px]">{t.app.goals.customLibraryTitle}</p>
                            <p className="mt-1.5 text-[1.75rem] font-black tracking-[-0.03em] sm:mt-2 sm:text-2xl">{userObjectives.length}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Tip card aligned with Review style */}
            <Card className="dashboard-card-lg border border-border-soft bg-surface-base shadow-premium-md">
                <div className="icon-box icon-bg-purple">
                    <Sparkles className="h-5 w-5" />
                </div>
                <h2 className="mt-4 text-[18px] font-semibold tracking-[-0.03em] text-primary-text">
                    {t.app.goals.extensionPanelHintTitle}
                </h2>
                <p className="mt-2 body-muted">
                    {t.app.goals.extensionPanelHintDesc}
                </p>
            </Card>

            {/* Platform Boards - Refined Mirror Style */}
            <section className="space-y-6">
                <div className="px-2">
                    <h2 className="text-2xl font-bold tracking-tight text-primary-text">{t.app.goals.recommendedObjectivesTitle}</h2>
                    <p className="mt-1 text-[14px] text-secondary-text">{t.app.goals.recommendedObjectivesDesc}</p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {recommendedObjectivesByPlatform.map(({ platformId, topObjectives }) => (
                        <Card key={platformId} className="dashboard-card-lg border border-border-soft bg-surface-base shadow-premium-md">
                            <div className="flex items-center justify-between gap-3">
                                <h3 className="text-[18px] font-semibold tracking-[-0.03em] text-primary-text">
                                    {platformLabelById[platformId]}
                                </h3>
                                <span className="inline-flex min-w-8 items-center justify-center rounded-full border border-border-soft bg-surface-elevated px-2 py-0.5 text-[11px] font-semibold text-secondary-text">
                                    {topObjectives.length}
                                </span>
                            </div>

                            <div className="mt-4 max-h-88 space-y-2 overflow-y-auto pr-1 custom-scrollbar">
                                {topObjectives.map(({ objective, metrics }) => (
                                    <div key={objective.id} className="rounded-2xl border border-border-soft bg-surface-elevated p-3">
                                        <div className="flex items-start justify-between gap-2">
                                            <p className="text-[13px] font-semibold leading-5 text-primary-text">
                                                {getObjectiveDisplayName(objective)}
                                            </p>
                                            {metrics.applyRate > 0 && (
                                                <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-accent-purple/25 bg-accent-purple/10 px-2 py-0.5 text-[10px] font-semibold text-accent-purple">
                                                    <Zap className="h-3 w-3" />
                                                    {metrics.applyRate}%
                                                </span>
                                            )}
                                        </div>
                                        <p className="mt-1 text-[12px] leading-relaxed text-secondary-text">
                                            {getObjectiveDisplayDescription(objective)}
                                        </p>
                                    </div>
                                ))}
                                {topObjectives.length === 0 && (
                                    <div className="flex flex-col items-center py-6 text-center opacity-50">
                                        <Layout className="h-7 w-7 text-muted-text" />
                                        <p className="mt-2 text-[12px] italic text-secondary-text">
                                            {t.app.goals.noRecommendedObjectives}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Custom Strategies - Standardizing on Profile Style */}
            <section className="space-y-6">
                <div className="px-2 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-primary-text">{t.app.goals.myStrategy}</h2>
                        <p className="mt-1 text-[14px] text-secondary-text">{t.app.goals.myStrategyDesc}</p>
                    </div>
                    {userObjectives.length > 0 && (
                        <div className="flex items-center">
                            <Button onClick={handleExportAll} disabled={isExporting} variant="ghost" className="border border-border-soft bg-surface-elevated text-secondary-text hover:text-primary-text">
                                <Download className="mr-2 h-4 w-4" />
                                {t.app.settingsModal.tabExport}
                            </Button>
                        </div>
                    )}
                </div>

                <div className={userObjectives.length === 0 ? "grid gap-4 grid-cols-1" : "grid gap-4 xl:grid-cols-2"}>
                    {userObjectives.length === 0 ? (
                        <Card className="flex flex-col items-center py-16 text-center rounded-4xl border-dashed border-2 border-border-soft bg-surface-base/50">
                            <div className="h-14 w-14 rounded-full bg-surface-elevated flex items-center justify-center shadow-premium-sm">
                                <Flag className="h-6 w-6 text-secondary-text" />
                            </div>
                            <p className="mt-4 font-bold text-primary-text">{t.app.goals.emptyObjectivesTitle}</p>
                            <p className="mt-1 text-sm text-secondary-text max-w-sm">{t.app.goals.emptyObjectivesDesc}</p>
                            <Button
                                onClick={() => { setEditingGoal(null); setIsFormOpen(true); }}
                                variant="ghost"
                                className="mt-6 border border-border-soft bg-surface-elevated"
                            >
                                <Plus className="h-4 w-4" />
                                {t.app.goals.createObjective}
                            </Button>
                        </Card>
                    ) : (
                        userObjectives.map((objective) => (
                            <Card key={objective.id} className="relative overflow-hidden rounded-[28px] border border-border-soft p-5 shadow-premium-md transition-all hover:shadow-premium-lg">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div
                                            onClick={() => toggleObjectiveActive(objective.id)}
                                            className={`flex h-12 w-12 cursor-pointer items-center justify-center rounded-2xl transition-all ${objective.active
                                                ? "bg-accent-purple/10 text-accent-purple shadow-inner"
                                                : "bg-surface-base text-secondary-text grayscale"
                                                }`}
                                        >
                                            <Check className={`h-6 w-6 transition-transform ${objective.active ? "scale-100" : "scale-50 opacity-40"}`} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-lg text-primary-text leading-tight">{objective.name}</h3>
                                                {!objective.active && (
                                                    <span className="rounded-full bg-surface-base border border-border-soft px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider text-secondary-text">
                                                        {t.app.profiles.disabled}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="mt-1 flex flex-wrap items-center gap-2">
                                                <span className="rounded-full bg-surface-elevated border border-border-soft px-2.5 py-0.5 text-[11px] font-bold text-secondary-text">
                                                    {objective.canonicalGoal}
                                                </span>
                                                <span className="text-[12px] text-secondary-text/60">•</span>
                                                <span className="text-[11px] font-bold text-secondary-text">
                                                    {t.app.goals.platformCount.replace("{0}", objective.scope.length.toString())}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1.5">
                                        <Button variant="ghost" size="md" onClick={() => { setEditingGoal(objective); setIsFormOpen(true); }} className="h-10 w-10 rounded-full border border-border-soft bg-surface-elevated px-0 text-secondary-text hover:text-primary-text">
                                            <Edit2 className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="md" onClick={() => setGoalToDelete(objective.id)} className="h-10 w-10 rounded-full border border-border-soft bg-surface-elevated px-0 text-secondary-text hover:text-red-500">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="md" className="h-10 w-10 rounded-full border border-border-soft bg-surface-elevated px-0 text-secondary-text">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-2xl border-border-soft p-1.5 shadow-premium-md">
                                                <DropdownMenuItem onClick={() => toggleObjectiveActive(objective.id)} className="rounded-xl px-3 py-2 text-[13px] font-medium">
                                                    {objective.active ? t.app.goals.deactivate : t.app.goals.activate}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleExportOne(objective.id)} className="rounded-xl px-3 py-2 text-[13px] font-medium">
                                                    <Download className="mr-2 h-4 w-4" />
                                                    {t.app.settingsModal.tabExport}
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                                {objective.description && (
                                    <p className="mt-4 text-[13px] leading-relaxed text-secondary-text line-clamp-2 italic">
                                        {objective.description}
                                    </p>
                                )}
                            </Card>
                        )))}
                </div>
            </section>

            {/* Modals & Dialogs */}
            <GoalFormDialog
                open={isFormOpen}
                goal={editingGoal}
                isPending={isMutating}
                onClose={() => { setIsFormOpen(false); setEditingGoal(null); }}
                onSubmit={handleCreateOrUpdateGoal}
            />

            <ConfirmDialog
                open={!!goalToDelete}
                title={t.app.goals.deleteConfirmTitle}
                description={t.app.goals.deleteConfirmDesc}
                confirmLabel={t.app.goals.remove}
                onConfirm={() => {
                    if (goalToDelete) {
                        void removeObjective(goalToDelete)
                    }
                }}
                onCancel={() => setGoalToDelete(null)}
            />
        </div>
    )
}
