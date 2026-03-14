"use client"

import { Search, SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Select } from "@/components/ui/Select"

interface HistoryFiltersProps {
    profileValue: string
    appliedValue: "all" | "applied" | "pending"
    searchValue: string
    resultsCount: number
    totalCount: number
    profileOptions: Array<{ label: string; value: string }>
    onProfileChange: (value: string) => void
    onAppliedChange: (value: "all" | "applied" | "pending") => void
    onSearchChange: (value: string) => void
    onReset: () => void
}

export function HistoryFilters({
    profileValue,
    appliedValue,
    searchValue,
    resultsCount,
    totalCount,
    profileOptions,
    onProfileChange,
    onAppliedChange,
    onSearchChange,
    onReset
}: HistoryFiltersProps) {
    const selectedProfileLabel = profileOptions.find((option) => option.value === profileValue)?.label ?? "Custom"
    const hasSearch = searchValue.trim().length > 0
    const hasProfileFilter = profileValue !== "all"
    const hasStatusFilter = appliedValue !== "all"
    const hasActiveFilters = hasSearch || hasProfileFilter || hasStatusFilter

    return (
        <div className="rounded-[28px] border border-border-soft bg-white/85 p-5 shadow-premium-md backdrop-blur-xl">
            <div className="flex flex-col gap-4 border-b border-border-soft pb-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <span className="inline-flex items-center gap-2 rounded-full border border-border-soft bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                        <SlidersHorizontal className="h-3.5 w-3.5" />
                        Workbench filters
                    </span>
                    <h2 className="mt-3 text-[20px] font-semibold tracking-[-0.03em] text-slate-900">Review outputs with context, not noise.</h2>
                    <p className="mt-1 max-w-2xl text-[14px] leading-6 text-slate-600">Search by author, inspect the exact source post and keep only the comments worth reusing in your workflow.</p>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-[12px] font-semibold text-slate-600">
                    <span className="rounded-full border border-border-soft bg-white px-3 py-1.5">
                        Showing {resultsCount} of {totalCount}
                    </span>
                    <Button type="button" variant="secondary" onClick={onReset} disabled={!hasActiveFilters}>
                        Reset
                    </Button>
                </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-[minmax(0,1.25fr)_220px_220px] md:items-end">
                <div className="space-y-2">
                    <label className="text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-500">Search</label>
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            value={searchValue}
                            onChange={(event) => onSearchChange(event.target.value)}
                            placeholder="Search author, snippet or generated comment"
                            className="h-12 w-full rounded-2xl border border-border-soft bg-white/95 pl-10 pr-3 text-[14px] text-primary-text outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-accent-purple/30"
                        />
                    </div>
                </div>

                <Select
                    value={profileValue}
                    onChange={onProfileChange}
                    options={profileOptions}
                    label="Profile"
                    className="rounded-2xl"
                    triggerClassName="h-12 rounded-2xl"
                />

                <Select
                    value={appliedValue}
                    onChange={(value) => onAppliedChange(value as "all" | "applied" | "pending")}
                    label="Status"
                    options={[
                        { label: "All statuses", value: "all" },
                        { label: "Applied", value: "applied" },
                        { label: "Pending", value: "pending" }
                    ]}
                    className="rounded-2xl"
                    triggerClassName="h-12 rounded-2xl"
                />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border-soft pt-4">
                <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-600">Active filters</span>

                {hasSearch ? (
                    <button
                        type="button"
                        onClick={() => onSearchChange("")}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#E6EAF2] bg-white px-3 py-1 text-[12px] font-semibold text-slate-700 transition hover:border-[#D6DCE8]"
                    >
                        Search: {searchValue.trim()}
                        <X className="h-3.5 w-3.5" />
                    </button>
                ) : null}

                {hasProfileFilter ? (
                    <button
                        type="button"
                        onClick={() => onProfileChange("all")}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#E6EAF2] bg-white px-3 py-1 text-[12px] font-semibold text-slate-700 transition hover:border-[#D6DCE8]"
                    >
                        Profile: {selectedProfileLabel}
                        <X className="h-3.5 w-3.5" />
                    </button>
                ) : null}

                {hasStatusFilter ? (
                    <button
                        type="button"
                        onClick={() => onAppliedChange("all")}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#E6EAF2] bg-white px-3 py-1 text-[12px] font-semibold text-slate-700 transition hover:border-[#D6DCE8]"
                    >
                        Status: {appliedValue}
                        <X className="h-3.5 w-3.5" />
                    </button>
                ) : null}

                {!hasActiveFilters ? (
                    <span className="rounded-full border border-dashed border-[#DCE3EF] bg-white/85 px-3 py-1 text-[12px] font-medium text-slate-600">
                        No filters active
                    </span>
                ) : null}
            </div>
        </div>
    )
}
