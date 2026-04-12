"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Check, Flag, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { Card } from "@/components/ui/Card"
import { Select } from "@/components/ui/Select"
import { Button } from "@/components/ui/Button"
import { LoadingOverlay, useLoadingDelay } from "@/components/ui/Loading"
import { StatePanel } from "@/components/ui/StatePanel"
import { useUserSettings } from "@/features/settings/hooks/useUserSettings"
import { useLanguageStore } from "@/store/useLanguageStore"
import type {
    GoalType,
    ObjectiveProfile,
    ObjectiveScope,
    PlatformDefaultObjectiveIds,
    PlatformId,
    UserSettings
} from "@/types/database.types"

const PLATFORM_ORDER: PlatformId[] = ["linkedin", "upwork", "twitter", "reddit", "youtube"]

const DEFAULT_PLATFORM_DEFAULT_OBJECTIVE_IDS: PlatformDefaultObjectiveIds = {
    linkedin: null,
    twitter: null,
    reddit: null,
    youtube: null,
    upwork: null
}

function isObjectiveApplicable(objective: ObjectiveProfile, platformId: PlatformId): boolean {
    return objective.active && objective.scope.includes(platformId)
}

function resolvePlatformDefaultObjectiveIds(
    current: PlatformDefaultObjectiveIds,
    objectiveLibrary: ObjectiveProfile[]
): PlatformDefaultObjectiveIds {
    const next = { ...current }

    for (const platformId of PLATFORM_ORDER) {
        const selected = objectiveLibrary.find((item) => item.id === next[platformId])
        if (selected && isObjectiveApplicable(selected, platformId)) {
            continue
        }

        const fallback = objectiveLibrary.find((item) => isObjectiveApplicable(item, platformId))
        next[platformId] = fallback?.id ?? null
    }

    return next
}

export default function GoalsPage() {
    const { data: settings, isLoading, isError, updateSettings, isMutating } = useUserSettings()
    const { t } = useLanguageStore()
    const showLoading = useLoadingDelay(isLoading)

    const [objectiveName, setObjectiveName] = useState("")
    const [objectiveDescription, setObjectiveDescription] = useState("")
    const [objectivePrompt, setObjectivePrompt] = useState("")
    const [objectiveGoal, setObjectiveGoal] = useState<GoalType>("Add Value")
    const [objectiveScope, setObjectiveScope] = useState<ObjectiveScope>([...PLATFORM_ORDER])
    const [optimisticDefaults, setOptimisticDefaults] = useState<PlatformDefaultObjectiveIds | null>(null)
    const [savingPlatformId, setSavingPlatformId] = useState<PlatformId | null>(null)

    const goalOptions = useMemo<Array<{ label: string; value: GoalType }>>(
        () => [
            { label: t.app.settings.goalValue, value: "Add Value" },
            { label: t.app.settings.goalChallenge, value: "Challenge" },
            { label: t.app.settings.goalConnect, value: "Networking" },
            { label: t.app.settings.goalQuestion, value: "Question" }
        ],
        [t]
    )

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

    const platformDefaultObjectiveIds = useMemo(
        () => settings?.platformDefaultObjectiveIds ?? DEFAULT_PLATFORM_DEFAULT_OBJECTIVE_IDS,
        [settings?.platformDefaultObjectiveIds]
    )

    useEffect(() => {
        setOptimisticDefaults(platformDefaultObjectiveIds)
    }, [platformDefaultObjectiveIds])

    const effectivePlatformDefaultObjectiveIds = optimisticDefaults ?? platformDefaultObjectiveIds

    const localizedBaseObjectiveNames = useMemo<Record<string, string>>(() => {
        return (t.app.goals.baseObjectiveNames ?? {}) as Record<string, string>
    }, [t])

    const getObjectiveDisplayName = useCallback((objective: ObjectiveProfile): string => {
        if (objective.source === "platform_base") {
            return localizedBaseObjectiveNames[objective.id] ?? objective.name
        }

        return objective.name
    }, [localizedBaseObjectiveNames])

    const activeObjectiveLibrary = useMemo<ObjectiveProfile[]>(
        () => objectiveLibrary.filter((item: ObjectiveProfile) => item.active),
        [objectiveLibrary]
    )

    const userObjectives = useMemo<ObjectiveProfile[]>(
        () => objectiveLibrary.filter((item: ObjectiveProfile) => item.source !== "platform_base"),
        [objectiveLibrary]
    )

    const optionsByPlatform = useMemo(() => {
        const result: Record<PlatformId, Array<{ label: string; value: string }>> = {
            linkedin: [],
            upwork: [],
            twitter: [],
            reddit: [],
            youtube: []
        }

        for (const platformId of PLATFORM_ORDER) {
            result[platformId] = activeObjectiveLibrary
                .filter((objective: ObjectiveProfile) => isObjectiveApplicable(objective, platformId))
                .map((objective: ObjectiveProfile) => ({
                    value: objective.id,
                    label: `${getObjectiveDisplayName(objective)} (${goalOptions.find((goal) => goal.value === objective.canonicalGoal)?.label ?? objective.canonicalGoal})`
                }))
        }

        return result
    }, [activeObjectiveLibrary, getObjectiveDisplayName, goalOptions])

    const patchGoals = async (
        payload: Partial<UserSettings>,
        options?: { successToast?: boolean; errorToast?: boolean }
    ) => {
        try {
            await updateSettings(payload)
            if (options?.successToast !== false) {
                toast.success(t.app.goals.saved)
            }
            return true
        } catch {
            if (options?.errorToast !== false) {
                toast.error(t.app.goals.saveError)
            }
            return false
        }
    }

    const applyObjectiveModelUpdate = async (
        nextObjectiveLibrary: ObjectiveProfile[],
        nextPlatformDefaultObjectiveIds: PlatformDefaultObjectiveIds,
        extraPayload?: Partial<UserSettings>,
        options?: { successToast?: boolean; errorToast?: boolean }
    ) => {
        const normalizedDefaults = resolvePlatformDefaultObjectiveIds(
            nextPlatformDefaultObjectiveIds,
            nextObjectiveLibrary
        )

        return patchGoals({
            goalModelVersion: 2,
            objectiveLibrary: nextObjectiveLibrary,
            platformDefaultObjectiveIds: normalizedDefaults,
            ...(extraPayload ?? {})
        }, options)
    }

    const updatePlatformDefault = async (platformId: PlatformId, objectiveId: string) => {
        if (!settings) return

        if (savingPlatformId === platformId) return

        const previousDefaults = effectivePlatformDefaultObjectiveIds
        const nextDefaults = {
            ...effectivePlatformDefaultObjectiveIds,
            [platformId]: objectiveId || null
        }

        setOptimisticDefaults(nextDefaults)
        setSavingPlatformId(platformId)

        const success = await applyObjectiveModelUpdate(
            settings.objectiveLibrary,
            nextDefaults,
            undefined,
            { successToast: false, errorToast: false }
        )

        setSavingPlatformId(null)

        if (!success) {
            setOptimisticDefaults(previousDefaults)
            toast.error(t.app.goals.saveError)
            return
        }

        toast.success(t.app.goals.saved)
    }

    const isAllScopeSelected = objectiveScope.length === PLATFORM_ORDER.length
    const selectedScopeCount = objectiveScope.length

    const toggleScopePlatform = (platformId: PlatformId) => {
        setObjectiveScope((current) => {
            if (current.includes(platformId)) {
                const next = current.filter((id) => id !== platformId)
                return next.length > 0 ? next : current
            }

            return [...PLATFORM_ORDER.filter((id) => current.includes(id)), platformId]
        })
    }

    const selectAllScope = () => {
        setObjectiveScope([...PLATFORM_ORDER])
    }

    const formatScopeLabel = (scope: ObjectiveScope): string => {
        if (scope.length === PLATFORM_ORDER.length) {
            return t.app.goals.allPlatformsLabel
        }

        return PLATFORM_ORDER
            .filter((platformId) => scope.includes(platformId))
            .map((platformId) => platformLabelById[platformId])
            .join(", ")
    }

    const handleCreateObjective = async () => {
        if (!settings) return

        const nextName = objectiveName.trim()
        if (!nextName) {
            toast.error(t.app.goals.nameRequiredError)
            return
        }

        const duplicateName = settings.objectiveLibrary.some(
            (item: ObjectiveProfile) => item.name.trim().toLowerCase() === nextName.toLowerCase()
        )

        if (duplicateName) {
            toast.error(t.app.goals.duplicateNameError)
            return
        }

        const now = Date.now()
        const nextObjective: ObjectiveProfile = {
            id: crypto.randomUUID(),
            name: nextName.slice(0, 64),
            canonicalGoal: objectiveGoal,
            description: objectiveDescription.trim().slice(0, 300),
            strategyPrompt: objectivePrompt.trim().slice(0, 1200),
            scope: [...objectiveScope],
            source: "user_custom",
            active: true,
            createdAt: now,
            updatedAt: now
        }

        await applyObjectiveModelUpdate(
            [...settings.objectiveLibrary, nextObjective],
            effectivePlatformDefaultObjectiveIds
        )

        setObjectiveName("")
        setObjectiveDescription("")
        setObjectivePrompt("")
        setObjectiveGoal("Add Value")
        setObjectiveScope([...PLATFORM_ORDER])
    }

    const toggleObjectiveActive = async (objectiveId: string) => {
        if (!settings) return

        const nextObjectiveLibrary = settings.objectiveLibrary.map((item: ObjectiveProfile) =>
            item.id === objectiveId
                ? {
                    ...item,
                    active: !item.active,
                    updatedAt: Date.now()
                }
                : item
        )

        await applyObjectiveModelUpdate(nextObjectiveLibrary, effectivePlatformDefaultObjectiveIds)
    }

    const removeObjective = async (objectiveId: string) => {
        if (!settings) return

        const nextObjectiveLibrary = settings.objectiveLibrary.filter((item: ObjectiveProfile) => item.id !== objectiveId)
        await applyObjectiveModelUpdate(nextObjectiveLibrary, effectivePlatformDefaultObjectiveIds)
    }

    if (showLoading) {
        return <LoadingOverlay show={true} />
    }

    if (isError || !settings) {
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
                <div
                    aria-hidden="true"
                    className="absolute -right-14 top-0 h-44 w-44 rounded-full workspace-hero-orb-purple"
                />
                <div
                    aria-hidden="true"
                    className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full workspace-hero-orb-cyan"
                />

                <div className="relative">
                    <div className="max-w-2xl">
                        <h1 className="max-w-xl text-4xl font-black tracking-[-0.05em] text-primary-text md:text-5xl">
                            {t.app.goals.heroTitle}
                        </h1>
                        <p className="mt-4 max-w-xl text-[15px] leading-7 text-secondary-text">
                            {t.app.goals.heroDesc}
                        </p>
                    </div>
                </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2">
                <Card className="dashboard-card-lg">
                    <div className="icon-box icon-bg-purple">
                        <Flag className="h-5 w-5" />
                    </div>
                    <h2 className="mt-4 text-[18px] font-semibold tracking-[-0.03em] text-primary-text">
                        {t.app.goals.baseByPlatformTitle}
                    </h2>
                    <p className="mt-2 body-muted">
                        {t.app.goals.baseByPlatformDesc}
                    </p>
                </Card>

                <Card className="dashboard-card-lg">
                    <div className="icon-box icon-bg-amber">
                        <Sparkles className="h-5 w-5" />
                    </div>
                    <h2 className="mt-4 text-[18px] font-semibold tracking-[-0.03em] text-primary-text">
                        {t.app.goals.customLibraryTitle}
                    </h2>
                    <p className="mt-2 body-muted">
                        {t.app.goals.customLibraryDesc}
                    </p>
                </Card>
            </section>

            <section className="grid gap-4 lg:grid-cols-2">
                <Card className="dashboard-card-xl">
                    <p className="dashboard-overline">{t.app.goals.modeTitle}</p>
                    <h2 className="mt-3 section-heading">{t.app.goals.modeDesc}</h2>

                    <div className="mt-5 space-y-4">
                        <Select
                            value={settings.goalMode}
                            onChange={(value) => {
                                void patchGoals({ goalMode: value as UserSettings["goalMode"] })
                            }}
                            label={t.app.settings.goalModeLabel}
                            triggerClassName="h-11 rounded-2xl"
                            options={[
                                { label: t.app.settings.goalModeManual, value: "manual" },
                                { label: t.app.settings.goalModeAuto, value: "auto" }
                            ]}
                        />

                        <div className="rounded-2xl border border-border-soft bg-surface-elevated p-3.5">
                            <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-secondary-text">
                                {t.app.settings.platformDefaultsLabel}
                            </p>
                            <div className="mt-3 space-y-3">
                                {PLATFORM_ORDER.map((platformId) => {
                                    const options = optionsByPlatform[platformId]
                                    const selectedId = effectivePlatformDefaultObjectiveIds[platformId] ?? options[0]?.value ?? ""

                                    return (
                                        <Select
                                            key={platformId}
                                            value={selectedId}
                                            onChange={(value) => {
                                                void updatePlatformDefault(platformId, value)
                                            }}
                                            label={platformLabelById[platformId]}
                                            triggerClassName="h-10 rounded-xl"
                                            options={options}
                                        />
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="dashboard-card-xl">
                    <p className="dashboard-overline">{t.app.goals.customLibraryTitle}</p>
                    <h2 className="mt-3 section-heading">{t.app.goals.customLibraryDesc}</h2>

                    <div className="mt-5 space-y-4">
                        <div className="space-y-3 rounded-2xl border border-border-soft bg-surface-elevated p-3.5">
                            <input
                                value={objectiveName}
                                onChange={(event) => setObjectiveName(event.target.value)}
                                placeholder={t.app.goals.objectiveNamePlaceholder}
                                className="h-10 w-full rounded-xl border border-border-soft bg-surface-base px-3 text-[13px] text-primary-text outline-none focus:border-accent-purple/50"
                            />
                            <Select
                                value={objectiveGoal}
                                onChange={(value) => setObjectiveGoal(value as GoalType)}
                                label={t.app.goals.objectiveGoalLabel}
                                triggerClassName="h-10 rounded-xl"
                                options={goalOptions}
                            />
                            <p className="text-[11px] text-secondary-text">{t.app.goals.objectiveGoalHelp}</p>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-secondary-text">
                                            {t.app.goals.scopeLabel}
                                        </span>
                                        <span className="rounded-full border border-border-soft bg-surface-base px-2 py-0.5 text-[10px] font-semibold text-secondary-text">
                                            {selectedScopeCount}/{PLATFORM_ORDER.length}
                                        </span>
                                    </div>
                                    {!isAllScopeSelected ? (
                                        <button
                                            type="button"
                                            onClick={selectAllScope}
                                            className="text-[11px] font-semibold text-accent-purple hover:opacity-80"
                                        >
                                            {t.app.goals.selectAllScope}
                                        </button>
                                    ) : null}
                                </div>
                                <p className="text-[11px] text-secondary-text">{t.app.goals.scopeHelp}</p>
                                <div className="flex flex-wrap gap-2 rounded-xl border border-border-soft bg-surface-base p-2">
                                    {PLATFORM_ORDER.map((platformId) => {
                                        const selected = objectiveScope.includes(platformId)
                                        return (
                                            <button
                                                key={platformId}
                                                type="button"
                                                onClick={() => toggleScopePlatform(platformId)}
                                                className={[
                                                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors",
                                                    selected
                                                        ? "border-accent-purple bg-accent-purple/15 text-accent-purple"
                                                        : "border-border-soft bg-surface-elevated text-secondary-text hover:text-primary-text"
                                                ].join(" ")}
                                            >
                                                {selected ? <Check className="h-3 w-3" /> : null}
                                                {platformLabelById[platformId]}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                            <textarea
                                value={objectivePrompt}
                                onChange={(event) => setObjectivePrompt(event.target.value)}
                                placeholder={t.app.goals.strategyPromptPlaceholder}
                                className="min-h-22 max-h-56 w-full overflow-y-auto resize-none rounded-xl border border-border-soft bg-surface-base px-3 py-2 text-[13px] text-primary-text outline-none focus:border-accent-purple/50"
                            />
                            <textarea
                                value={objectiveDescription}
                                onChange={(event) => setObjectiveDescription(event.target.value)}
                                placeholder={t.app.goals.objectiveDescriptionPlaceholder}
                                className="min-h-18 max-h-40 w-full overflow-y-auto resize-none rounded-xl border border-border-soft bg-surface-base px-3 py-2 text-[13px] text-primary-text outline-none focus:border-accent-purple/50"
                            />
                            <Button
                                onClick={() => {
                                    void handleCreateObjective()
                                }}
                                disabled={isMutating}
                                className="h-9 rounded-xl px-4 text-[12px]"
                            >
                                {t.app.goals.createObjective}
                            </Button>
                        </div>

                        {userObjectives.length === 0 ? (
                            <StatePanel
                                title={t.app.goals.emptyObjectivesTitle}
                                description={t.app.goals.emptyObjectivesDesc}
                            />
                        ) : (
                            <div className="space-y-2">
                                {userObjectives.map((objective: ObjectiveProfile) => (
                                    <div
                                        key={objective.id}
                                        className="rounded-2xl border border-border-soft bg-surface-elevated p-3"
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <div>
                                                <p className="text-[13px] font-semibold text-primary-text">{objective.name}</p>
                                                <p className="text-[12px] text-secondary-text">
                                                    {goalOptions.find((option) => option.value === objective.canonicalGoal)?.label ?? objective.canonicalGoal}
                                                    {" · "}
                                                    {formatScopeLabel(objective.scope)}
                                                </p>
                                                {objective.strategyPrompt ? (
                                                    <p className="mt-1 text-[12px] text-secondary-text">{objective.strategyPrompt}</p>
                                                ) : null}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => {
                                                        void toggleObjectiveActive(objective.id)
                                                    }}
                                                    className="h-8 rounded-lg px-3 text-[11px]"
                                                >
                                                    {objective.active ? t.app.goals.deactivate : t.app.goals.activate}
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => {
                                                        void removeObjective(objective.id)
                                                    }}
                                                    className="h-8 rounded-lg px-3 text-[11px]"
                                                >
                                                    {t.app.goals.remove}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </Card>
            </section>
        </div>
    )
}
