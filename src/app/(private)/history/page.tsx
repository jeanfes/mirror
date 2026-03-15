"use client"

import { useMemo } from "react"
import { Archive, CheckCircle2, Clock3, WandSparkles } from "lucide-react"
import { toast } from "sonner"
import { Card } from "@/components/ui/Card"
import { LoadingPage, useLoadingDelay } from "@/components/ui/Loading"
import { StatePanel } from "@/components/ui/StatePanel"
import { HistoryFilters } from "@/features/history/components/HistoryFilters"
import { HistoryItemCard } from "@/features/history/components/HistoryItemCard"
import { useHistory } from "@/features/history/hooks/useHistory"
import { useProfiles } from "@/features/profiles/hooks/useProfiles"
import { useHistoryUIStore } from "@/store/useHistoryUIStore"
import { useLanguageStore } from "@/store/useLanguageStore"

export default function HistoryPage() {
    const { data: history, isLoading, isError, toggleHistoryApplied, reuseHistoryItem } = useHistory()
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

    const profileMap = useMemo(() => {
        return new Map((profiles ?? []).map((profile) => [profile.id, profile.name]))
    }, [profiles])

    const profileOptions = useMemo(() => {
        return [
            { label: "All profiles", value: "all" },
            ...((profiles ?? []).map((profile) => ({ label: profile.name, value: profile.id })))
        ]
    }, [profiles])

    const filteredHistory = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase()

        return (history ?? []).filter((item) => {
            if (selectedProfileId !== "all" && item.personaId !== selectedProfileId) return false
            if (appliedFilter === "applied" && !item.applied) return false
            if (appliedFilter === "pending" && item.applied) return false

            if (!normalizedSearch) return true

            const haystack = [item.postAuthor, item.postHeadline, item.postSnippet, item.generatedComment]
                .filter(Boolean)
                .join(" ")
                .toLowerCase()

            return haystack.includes(normalizedSearch)
        })
    }, [history, selectedProfileId, appliedFilter, search])

    const summary = useMemo(() => {
        const items = history ?? []

        return {
            total: items.length,
            applied: items.filter((item) => item.applied).length,
            pending: items.filter((item) => !item.applied).length,
            reused: items.filter((item) => item.source === "history_reuse").length
        }
    }, [history])

    const handleCopy = async (comment: string) => {
        try {
            await navigator.clipboard.writeText(comment)
            toast.success("Comment copied")
        } catch {
            toast.error("Could not copy comment")
        }
    }

    const handleReuse = async (id: string) => {
        try {
            await reuseHistoryItem(id)
            toast.success("Comment duplicated in history")
        } catch {
            toast.error("Could not reuse comment")
        }
    }

    const handleToggleApplied = async (id: string) => {
        try {
            await toggleHistoryApplied(id)
            toast.success("History item updated")
        } catch {
            toast.error("Could not update history item")
        }
    }

    if (showLoading) {
        return <LoadingPage />
    }

    if (isError) {
        return (
            <StatePanel
                tone="error"
                title={t.app.historyErrorTitle}
                description={t.app.historyErrorDesc}
            />
        )
    }

    return (
        <div className="space-y-6">
            <section className="workspace-hero-shell">
                <div aria-hidden="true" className="absolute -right-14 top-0 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.24),transparent_72%)]" />
                <div aria-hidden="true" className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(117,206,243,0.28),transparent_74%)]" />

                <div className="relative grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
                    <div className="max-w-2xl">
                        <h1 className="max-w-xl text-4xl font-black tracking-[-0.05em] text-[#141824] md:text-5xl">
                            Keep the best outputs close and the weak ones out of your way.
                        </h1>
                        <p className="mt-4 max-w-xl text-[15px] leading-7 text-slate-600">
                            History should work like a review desk: quick to scan, honest about what was applied, and useful when you need a proven angle again.
                        </p>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <div className="workspace-hero-chip">Reusable comment archive</div>
                            <div className="workspace-hero-chip">Applied status tracking</div>
                            <div className="workspace-hero-chip">Profile-aware review flow</div>
                        </div>
                    </div>

                    <Card className="dashboard-dark-panel">
                        <h2 className="text-[24px] font-black tracking-[-0.04em] text-white">Your archive at a glance</h2>
                        <p className="mt-2 text-[14px] leading-6 text-white/82">A quick read on how much of the comment library is already production-ready versus still waiting for a decision.</p>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <div className="dashboard-dark-stat">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/80">Archived</p>
                                <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white">{summary.total}</p>
                            </div>
                            <div className="dashboard-dark-stat">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/80">Applied</p>
                                <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white">{summary.applied}</p>
                            </div>
                            <div className="dashboard-dark-stat">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/80">Pending</p>
                                <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white">{summary.pending}</p>
                            </div>
                            <div className="dashboard-dark-stat">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/80">Reused</p>
                                <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white">{summary.reused}</p>
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
                    <h2 className="mt-4 text-[18px] font-semibold tracking-[-0.03em] text-[#141824]">Review angle</h2>
                    <p className="mt-2 body-muted">Compare the original post against the generated comment without losing the tone or goal that produced it.</p>
                </Card>

                <Card className="dashboard-card-lg">
                    <div className="icon-box icon-bg-green">
                        <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <h2 className="mt-4 text-[18px] font-semibold tracking-[-0.03em] text-[#141824]">Execution truth</h2>
                    <p className="mt-2 body-muted">Keep the archive honest by marking what was actually used and what still needs a decision.</p>
                </Card>

                <Card className="dashboard-card-lg">
                    <div className="icon-box icon-bg-amber">
                        <Clock3 className="h-5 w-5" />
                    </div>
                    <h2 className="mt-4 text-[18px] font-semibold tracking-[-0.03em] text-[#141824]">Fast retrieval</h2>
                    <p className="mt-2 body-muted">Find a strong previous angle in seconds when you need to comment quickly without starting from zero.</p>
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
                        <h2 className="section-heading">Recent outputs</h2>
                        <p className="body-muted">Each card keeps the source, the generated reply and the decision controls in one place.</p>
                    </div>
                    <p className="text-[13px] font-medium text-slate-500">{filteredHistory.length} result{filteredHistory.length === 1 ? "" : "s"}</p>
                </div>
            </section>

            {filteredHistory.length === 0 ? (
                <StatePanel
                    icon={<Archive className="h-6 w-6 text-[#141824]" />}
                    title={t.app.historyEmptyTitle}
                    description={t.app.historyEmptyDesc}
                    actionLabel={t.app.historyEmptyAction}
                    onAction={resetFilters}
                />
            ) : (
                <div className="space-y-4">
                    {filteredHistory.map((item) => (
                        <HistoryItemCard
                            key={item.id}
                            item={item}
                            profileName={profileMap.get(item.personaId) ?? "Unknown profile"}
                            onCopy={handleCopy}
                            onReuse={handleReuse}
                            onToggleApplied={handleToggleApplied}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

