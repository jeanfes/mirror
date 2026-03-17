"use client"

import { Search, SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Select } from "@/components/ui/Select"
import { Input } from "@/components/ui/Input"

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
        <div className="feature-glass-panel">
            <div className="flex flex-col gap-4 border-b border-border-soft pb-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <span className="feature-pill px-3 uppercase tracking-[0.12em]">
                        <SlidersHorizontal className="h-3.5 w-3.5" />
                        Workbench filters
                    </span>
                    <h2 className="mt-3 text-[20px] font-semibold tracking-[-0.03em] text-primary-text">Review outputs with context, not noise.</h2>
                    <p className="mt-1 max-w-2xl body-muted">Search by author, inspect the exact source post and keep only the comments worth reusing in your workflow.</p>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-[12px] font-semibold text-secondary-text">
                    <span className="feature-pill px-3 py-1.5">
                        Showing {resultsCount} of {totalCount}
                    </span>
                    <Button type="button" variant="secondary" onClick={onReset} disabled={!hasActiveFilters}>
                        Reset
                    </Button>
                </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-[minmax(0,1.25fr)_220px_220px] md:items-end">
                <Input
                    label="Search"
                    icon={<Search className="h-4 w-4" />}
                    value={searchValue}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder="Search author, snippet or generated comment"
                    className="h-12 bg-surface-elevated text-primary-text"
                />

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
                <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-secondary-text">Active filters</span>

                {hasSearch ? (
                    <button
                        type="button"
                        onClick={() => onSearchChange("")}
                        className="feature-pill-sm"
                    >
                        Search: {searchValue.trim()}
                        <X className="h-3.5 w-3.5" />
                    </button>
                ) : null}

                {hasProfileFilter ? (
                    <button
                        type="button"
                        onClick={() => onProfileChange("all")}
                        className="feature-pill-sm"
                    >
                        Profile: {selectedProfileLabel}
                        <X className="h-3.5 w-3.5" />
                    </button>
                ) : null}

                {hasStatusFilter ? (
                    <button
                        type="button"
                        onClick={() => onAppliedChange("all")}
                        className="feature-pill-sm"
                    >
                        Status: {appliedValue}
                        <X className="h-3.5 w-3.5" />
                    </button>
                ) : null}

                {!hasActiveFilters ? (
                    <span className="rounded-full border border-dashed border-border-soft bg-surface-elevated px-3 py-1 text-[12px] font-medium text-secondary-text">
                        No filters active
                    </span>
                ) : null}
            </div>
        </div>
    )
}
