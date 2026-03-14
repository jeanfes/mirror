"use client"

import { useMemo } from "react"
import { Archive, CheckCircle2, Clock3, Sparkles, Wand2 } from "lucide-react"
import { toast } from "sonner"
import { Card } from "@/components/ui/Card"
import { HistoryFilters } from "@/features/history/components/HistoryFilters"
import { HistoryItemCard } from "@/features/history/components/HistoryItemCard"
import { useHistory } from "@/features/history/hooks/useHistory"
import { useProfiles } from "@/features/profiles/hooks/useProfiles"
import { useHistoryUIStore } from "@/store/useHistoryUIStore"

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

    if (isLoading) {
        return (
            <Card className="rounded-[28px] p-6">
                <p className="text-[14px] text-slate-500">Loading history...</p>
            </Card>
        )
    }

    if (isError) {
        return (
            <Card className="rounded-[28px] p-6">
                <p className="text-[14px] text-red-600">Could not load history.</p>
            </Card>
        )
    }

    return (
        <div className="space-y-6">
            <section className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_360px]">
                <Card elevated className="overflow-hidden border-white/70 p-6 md:p-7">
                    <div className="relative">
                        <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(117,206,243,0.24),transparent_68%)] blur-2xl" />
                        <div className="absolute left-10 top-10 h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.18),transparent_68%)] blur-2xl" />

                        <div className="relative max-w-3xl">
                            <span className="inline-flex items-center gap-2 rounded-full border border-[#E9DDFE] bg-[#F7F1FF] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6D28D9]">
                                <Archive className="h-3.5 w-3.5" />
                                Comment archive
                            </span>
                            <h1 className="mt-4 max-w-2xl text-[34px] font-semibold leading-[1.05] tracking-[-0.04em] text-[#141824] md:text-[42px]">
                                Keep the best outputs close and the weak ones out of your way.
                            </h1>
                            <p className="mt-4 max-w-2xl text-[15px] leading-7 text-slate-600">
                                History should work like a review desk: quick to scan, honest about what was applied, and useful when you need a proven angle again.
                            </p>

                            <div className="mt-6 flex flex-wrap gap-2 text-[12px] font-semibold text-slate-600">
                                <span className="rounded-full border border-[#E6EAF2] bg-white px-3 py-1.5">Reusable comment archive</span>
                                <span className="rounded-full border border-[#E6EAF2] bg-white px-3 py-1.5">Applied status tracking</span>
                                <span className="rounded-full border border-[#E6EAF2] bg-white px-3 py-1.5">Profile-aware review flow</span>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="rounded-4xl border-[#171B2D] bg-[#171B2D] p-6 text-white shadow-[0_28px_80px_rgba(15,23,42,0.22)]">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/85">
                        <Sparkles className="h-3.5 w-3.5" />
                        Review pulse
                    </span>
                    <h2 className="mt-4 text-[24px] font-semibold tracking-[-0.03em] text-white">Your archive at a glance</h2>
                    <p className="mt-2 text-[14px] leading-6 text-white/82">A quick read on how much of the comment library is already production-ready versus still waiting for a decision.</p>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <div className="rounded-3xl border border-white/20 bg-white/12 p-4">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/80">Archived</p>
                            <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white">{summary.total}</p>
                        </div>
                        <div className="rounded-3xl border border-white/20 bg-white/12 p-4">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/80">Applied</p>
                            <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white">{summary.applied}</p>
                        </div>
                        <div className="rounded-3xl border border-white/20 bg-white/12 p-4">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/80">Pending</p>
                            <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white">{summary.pending}</p>
                        </div>
                        <div className="rounded-3xl border border-white/20 bg-white/12 p-4">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/80">Reused</p>
                            <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white">{summary.reused}</p>
                        </div>
                    </div>
                </Card>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
                <Card className="rounded-[28px] p-5">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(139,92,246,0.14),rgba(117,206,243,0.14))] text-[#141824]">
                        <Wand2 className="h-5 w-5" />
                    </div>
                    <h2 className="mt-4 text-[18px] font-semibold tracking-[-0.03em] text-[#141824]">Review angle</h2>
                    <p className="mt-2 text-[14px] leading-6 text-slate-600">Compare the original post against the generated comment without losing the tone or goal that produced it.</p>
                </Card>

                <Card className="rounded-[28px] p-5">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(16,185,129,0.14),rgba(125,211,252,0.14))] text-[#141824]">
                        <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <h2 className="mt-4 text-[18px] font-semibold tracking-[-0.03em] text-[#141824]">Execution truth</h2>
                    <p className="mt-2 text-[14px] leading-6 text-slate-600">Keep the archive honest by marking what was actually used and what still needs a decision.</p>
                </Card>

                <Card className="rounded-[28px] p-5">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(251,191,36,0.18),rgba(248,250,252,0.2))] text-[#141824]">
                        <Clock3 className="h-5 w-5" />
                    </div>
                    <h2 className="mt-4 text-[18px] font-semibold tracking-[-0.03em] text-[#141824]">Fast retrieval</h2>
                    <p className="mt-2 text-[14px] leading-6 text-slate-600">Find a strong previous angle in seconds when you need to comment quickly without starting from zero.</p>
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
                        <h2 className="text-[24px] font-semibold tracking-[-0.03em] text-[#141824]">Recent outputs</h2>
                        <p className="text-[14px] leading-6 text-slate-600">Each card keeps the source, the generated reply and the decision controls in one place.</p>
                    </div>
                    <p className="text-[13px] font-medium text-slate-500">{filteredHistory.length} result{filteredHistory.length === 1 ? "" : "s"}</p>
                </div>
            </section>

            {filteredHistory.length === 0 ? (
                <Card className="rounded-4xl p-10 text-center">
                    <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(139,92,246,0.14),rgba(117,206,243,0.14))] text-[#141824]">
                        <Archive className="h-6 w-6" />
                    </div>
                    <h3 className="mt-5 text-[22px] font-semibold tracking-[-0.03em] text-[#141824]">No comments match this view.</h3>
                    <p className="mx-auto mt-2 max-w-xl text-[14px] leading-6 text-slate-600">Try widening the search, switching the profile filter or resetting the current status selection to see more of the archive.</p>
                </Card>
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

