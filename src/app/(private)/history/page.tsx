"use client"

import { useCallback, useDeferredValue, useMemo } from "react"
import { Archive, CheckCircle2, Clock3, WandSparkles } from "lucide-react"
import { toast } from "sonner"
import { Card } from "@/components/ui/Card"
import { LoadingOverlay, useLoadingDelay } from "@/components/ui/Loading"
import { StatePanel } from "@/components/ui/StatePanel"
import { HistoryFilters } from "@/features/history/components/HistoryFilters"
import { HistoryItemCard } from "@/features/history/components/HistoryItemCard"
import { useHistory } from "@/features/history/hooks/useHistory"
import { useProfiles } from "@/features/profiles/hooks/useProfiles"
import { useHistoryUIStore } from "@/store/useHistoryUIStore"
import { useLanguageStore } from "@/store/useLanguageStore"

export default function HistoryPage() {
    const { data: history, isLoading, isError, moveToTrash, updateFeedback } = useHistory()
    const { data: profiles } = useProfiles()
    const {
        selectedProfileId,
        appliedFilter,
        search,
        setSelectedProfileId,
        setAppliedFilter,
        setSearch,
        resetFilters
    } = useHistoryUIStore()
    const { t } = useLanguageStore()
    const showLoading = useLoadingDelay(isLoading)
    const deferredSearch = useDeferredValue(search)

    const hasActiveFilters = useMemo(() => {
        return search.trim().length > 0 || selectedProfileId !== "all" || appliedFilter !== "all"
    }, [search, selectedProfileId, appliedFilter])

    const profileMap = useMemo(() => {
        return new Map((profiles ?? []).map((profile) => [profile.id, profile.name]))
    }, [profiles])

    const profileOptions = useMemo(() => {
        return [
            { label: t.app.history.filterAllProfiles, value: "all" },
            ...((profiles ?? []).map((profile) => ({ label: profile.name, value: profile.id })))
        ]
    }, [profiles, t])

    const indexedHistory = useMemo(() => {
        return (history ?? []).map((item) => ({
            item,
            searchText: [item.postAuthor, item.postHeadline, item.postSnippet, item.generatedText]
                .filter(Boolean)
                .join(" ")
                .toLowerCase()
        }))
    }, [history])

    const filteredHistory = useMemo(() => {
        const normalizedSearch = deferredSearch.trim().toLowerCase()

        return indexedHistory
            .filter(({ item, searchText }) => {
                if (selectedProfileId !== "all" && item.profileId !== selectedProfileId) return false
                if (appliedFilter !== "all" && item.status !== appliedFilter) return false

                if (!normalizedSearch) return true
                return searchText.includes(normalizedSearch)
            })
            .map(({ item }) => item)
    }, [indexedHistory, selectedProfileId, appliedFilter, deferredSearch])

    const summary = useMemo(() => {
        const items = history ?? []
        let applied = 0

        for (const item of items) {
            if (item.status === "applied") {
                applied += 1
            }
        }

        return {
            total: items.length,
            applied
        }
    }, [history])

    const handleCopy = useCallback(async (comment: string) => {
        try {
            await navigator.clipboard.writeText(comment)
            toast.success(t.app.common.commentCopied || "Comment copied")
        } catch {
            toast.error(t.app.common.commentCopyError || "Could not copy comment")
        }
    }, [t])

    const handleMoveToTrash = useCallback(async (id: string) => {
        try {
            await moveToTrash(id)
            toast.success(t.app.common.historyUpdated || "History item updated")
        } catch {
            toast.error(t.app.common.historyUpdateError || "Could not update history item")
        }
    }, [moveToTrash, t])

    const handleUpdateFeedback = useCallback(async (input: {
        id: string
        liked?: boolean | null
        feedbackNote?: string | null
    }) => {
        try {
            await updateFeedback(input)
            toast.success(t.app.common.historyUpdated || "History item updated")
        } catch {
            toast.error(t.app.common.historyUpdateError || "Could not update history item")
        }
    }, [t, updateFeedback])

    if (showLoading) {
        return <LoadingOverlay show={true} />
    }

    if (isError) {
        return (
            <StatePanel
                tone="error"
                title={t.app.common.historyErrorTitle}
                description={t.app.common.historyErrorDesc}
            />
        )
    }

    return (
        <div className="space-y-6">
            <section className="workspace-hero-shell">
                <div aria-hidden="true" className="absolute -right-14 top-0 h-44 w-44 rounded-full workspace-hero-orb-purple" />
                <div aria-hidden="true" className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full workspace-hero-orb-cyan" />

                <div className="relative grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
                    <div className="max-w-2xl">
                        <h1 className="max-w-xl text-4xl font-black tracking-[-0.05em] text-primary-text md:text-5xl">
                            {t.app.history.heroTitle}
                        </h1>
                        <p className="mt-4 max-w-xl text-[15px] leading-7 text-secondary-text">
                            {t.app.history.heroDesc}
                        </p>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <div className="workspace-hero-chip">{t.app.history.chip1}</div>
                            <div className="workspace-hero-chip">{t.app.history.chip2}</div>
                            <div className="workspace-hero-chip">{t.app.history.chip3}</div>
                        </div>
                    </div>

                    <Card className="dashboard-dark-panel">
                        <h2 className="text-[24px] font-black tracking-[-0.04em] text-white">{t.app.history.archiveGlance}</h2>
                        <p className="mt-2 text-[14px] leading-6 text-white/82">{t.app.history.archiveGlanceDesc}</p>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <div className="dashboard-dark-stat">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/80">{t.app.history.archived}</p>
                                <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white">{summary.total}</p>
                            </div>
                            <div className="dashboard-dark-stat">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/80">{t.app.history.applied}</p>
                                <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white">{summary.applied}</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
                <Card className="dashboard-card-lg">
                    <div className="icon-box icon-bg-purple">
                        <WandSparkles className="h-5 w-5" />
                    </div>
                    <h2 className="mt-4 text-[18px] font-semibold tracking-[-0.03em] text-primary-text">{t.app.history.reviewAngle}</h2>
                    <p className="mt-2 body-muted">{t.app.history.reviewAngleDesc}</p>
                </Card>

                <Card className="dashboard-card-lg">
                    <div className="icon-box icon-bg-green">
                        <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <h2 className="mt-4 text-[18px] font-semibold tracking-[-0.03em] text-primary-text">{t.app.history.executionTruth}</h2>
                    <p className="mt-2 body-muted">{t.app.history.executionTruthDesc}</p>
                </Card>

                <Card className="dashboard-card-lg">
                    <div className="icon-box icon-bg-amber">
                        <Clock3 className="h-5 w-5" />
                    </div>
                    <h2 className="mt-4 text-[18px] font-semibold tracking-[-0.03em] text-primary-text">{t.app.history.fastRetrieval}</h2>
                    <p className="mt-2 body-muted">{t.app.history.fastRetrievalDesc}</p>
                </Card>
            </section>

            <HistoryFilters
                profileValue={selectedProfileId}
                appliedValue={appliedFilter}
                searchValue={search}
                resultsCount={filteredHistory.length}
                totalCount={summary.total}
                profileOptions={profileOptions}
                onProfileChange={setSelectedProfileId}
                onAppliedChange={setAppliedFilter}
                onSearchChange={setSearch}
                onReset={resetFilters}
            />

            <section>
                <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h2 className="section-heading">{t.app.history.recentOutputs}</h2>
                        <p className="body-muted">{t.app.history.recentOutputsDesc}</p>
                    </div>
                    <p className="text-[13px] font-medium text-secondary-text">
                        {filteredHistory.length === 1
                            ? t.app.history.resultsCount.replace("{0}", "1")
                            : t.app.history.resultsCountPlural.replace("{0}", filteredHistory.length.toString())}
                    </p>
                </div>
            </section>

            {filteredHistory.length === 0 ? (
                <StatePanel
                    icon={<Archive className="h-6 w-6 text-primary-text" />}
                    title={t.app.common.historyEmptyTitle}
                    description={t.app.common.historyEmptyDesc}
                    actionLabel={hasActiveFilters ? t.app.common.historyEmptyAction : undefined}
                    onAction={hasActiveFilters ? resetFilters : undefined}
                />
            ) : (
                <div className="space-y-4">
                    {filteredHistory.map((item) => (
                        <HistoryItemCard
                            key={item.id}
                            item={item}
                            profileName={item.profileId ? (profileMap.get(item.profileId) ?? t.app.common.unknownProfile) : t.app.common.unknownProfile}
                            onCopy={handleCopy}
                            onMoveToTrash={handleMoveToTrash}
                            onUpdateFeedback={handleUpdateFeedback}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

