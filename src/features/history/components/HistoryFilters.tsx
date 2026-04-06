"use client"

import React, { memo } from "react"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { useLanguageStore } from "@/store/useLanguageStore"
import { Button } from "@/components/ui/Button"
import { Select } from "@/components/ui/Select"
import { Input } from "@/components/ui/Input"

interface HistoryFiltersProps {
    profileValue: string
    appliedValue: "all" | "applied" | "pending" | "dismissed"
    searchValue: string
    resultsCount: number
    totalCount: number
    profileOptions: Array<{ label: string; value: string }>
    onProfileChange: (value: string) => void
    onAppliedChange: (value: "all" | "applied" | "pending" | "dismissed") => void
    onSearchChange: (value: string) => void
    onReset: () => void
}

export const HistoryFilters = memo(function HistoryFilters({
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
    const t = useLanguageStore((state) => state.t)
    const statusLabelMap: Record<HistoryFiltersProps["appliedValue"], string> = {
        all: t.app.historyFilters.statusAll,
        applied: t.app.historyFilters.statusApplied,
        pending: t.app.historyFilters.statusPending,
        dismissed: t.app.historyFilters.statusDismissed
    }

    return (
        <div className="feature-glass-panel">
            <div className="flex flex-col gap-4 border-b border-border-soft pb-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <span className="feature-pill px-3 uppercase tracking-[0.12em]">
                        <SlidersHorizontal className="h-3.5 w-3.5" />
                        {t.app.historyFilters.workbenchFilters}
                    </span>
                    <h2 className="mt-3 text-[20px] font-semibold tracking-[-0.03em] text-primary-text">{t.app.historyFilters.reviewOutputsTitle}</h2>
                    <p className="mt-1 max-w-2xl body-muted">{t.app.historyFilters.reviewOutputsDesc}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-[12px] font-semibold text-secondary-text">
                    <span className="feature-pill px-3 py-1.5">
                        {t.app.historyFilters.showingXofY.replace("{0}", resultsCount.toString()).replace("{1}", totalCount.toString())}
                    </span>
                    {hasActiveFilters && (
                        <Button type="button" variant="secondary" onClick={onReset}>
                            {t.app.historyFilters.reset}
                        </Button>
                    )}
                </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-[minmax(0,1.25fr)_220px_220px] md:items-end">
                <Input
                    label={t.app.historyFilters.searchLabel}
                    icon={<Search className="h-4 w-4" />}
                    value={searchValue}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder={t.app.historyFilters.searchPlaceholder}
                    className="h-12 bg-surface-elevated text-primary-text"
                />

                <Select
                    value={profileValue}
                    onChange={onProfileChange}
                    options={profileOptions}
                    label={t.app.historyFilters.profileLabel}
                    className="rounded-2xl"
                    triggerClassName="h-12 rounded-2xl"
                />

                <Select
                    value={appliedValue}
                    onChange={(value) => onAppliedChange(value as "all" | "applied" | "pending" | "dismissed")}
                    label={t.app.historyFilters.statusLabel}
                    options={[
                        { label: t.app.historyFilters.statusAll, value: "all" },
                        { label: t.app.historyFilters.statusApplied, value: "applied" },
                        { label: t.app.historyFilters.statusPending, value: "pending" },
                        { label: t.app.historyFilters.statusDismissed, value: "dismissed" }
                    ]}
                    className="rounded-2xl"
                    triggerClassName="h-12 rounded-2xl"
                />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border-soft pt-4">
                <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-secondary-text">{t.app.historyFilters.activeFilters}</span>

                {hasSearch ? (
                    <button
                        type="button"
                        onClick={() => onSearchChange("")}
                        className="feature-pill-sm"
                    >
                        {t.app.historyFilters.searchLabel}: {searchValue.trim()}
                        <X className="h-3.5 w-3.5" />
                    </button>
                ) : null}

                {hasProfileFilter ? (
                    <button
                        type="button"
                        onClick={() => onProfileChange("all")}
                        className="feature-pill-sm"
                    >
                        {t.app.historyFilters.profileLabel}: {selectedProfileLabel}
                        <X className="h-3.5 w-3.5" />
                    </button>
                ) : null}

                {hasStatusFilter ? (
                    <button
                        type="button"
                        onClick={() => onAppliedChange("all")}
                        className="feature-pill-sm"
                    >
                        {t.app.historyFilters.statusLabel}: {statusLabelMap[appliedValue]}
                        <X className="h-3.5 w-3.5" />
                    </button>
                ) : null}

                {!hasActiveFilters ? (
                    <span className="rounded-full border border-dashed border-border-soft bg-surface-elevated px-3 py-1 text-[12px] font-medium text-secondary-text">
                        {t.app.historyFilters.noFiltersActive}
                    </span>
                ) : null}
            </div>
        </div>
    )
})
