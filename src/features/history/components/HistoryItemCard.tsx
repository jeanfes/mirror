"use client"

import { memo, useEffect, useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Copy, MessageSquareQuote, Trash2 } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Select } from "@/components/ui/Select"
import { Textarea } from "@/components/ui/Textarea"
import { Tooltip } from "@/components/ui/Tooltip"
import { useLanguageStore } from "@/store/useLanguageStore"
import type { GenerationHistory } from "@/types/database.types"

interface HistoryItemCardProps {
    item: GenerationHistory
    profileName: string
    onCopy: (comment: string) => void
    onMoveToTrash: (id: string) => void
    onUpdateFeedback: (input: {
        id: string
        rating?: number | null
        feedbackNote?: string | null
    }) => void
}

export const HistoryItemCard = memo(function HistoryItemCard({
    item,
    profileName,
    onCopy,
    onMoveToTrash,
    onUpdateFeedback
}: HistoryItemCardProps) {
    const { t } = useLanguageStore()
    const [ratingValue, setRatingValue] = useState<string>(item.rating ? String(item.rating) : "")
    const [feedbackValue, setFeedbackValue] = useState<string>(item.feedbackNote ?? "")

    const goalLabels: Record<NonNullable<GenerationHistory["goal"]>, string> = {
        add_value: t.app.settings.goalValue,
        challenge: t.app.settings.goalChallenge,
        networking: t.app.settings.goalConnect,
        question: t.app.settings.goalQuestion
    }

    const sourceLabels: Record<NonNullable<GenerationHistory["source"]>, string> = {
        alternative: t.app.historyItem.sourceAlternative,
        generated: t.app.historyItem.sourceGenerated,
        manual_edit: t.app.historyItem.sourceManualEdit
    }

    const statusMeta = { label: t.app.history.applied, className: "badge-success" }
    const ratingOptions = [
        { label: t.app.historyItem.feedbackNoRating, value: "" },
        { label: "1", value: "1" },
        { label: "2", value: "2" },
        { label: "3", value: "3" },
        { label: "4", value: "4" },
        { label: "5", value: "5" }
    ]

    const hasPendingFeedbackChanges =
        (item.rating ? String(item.rating) : "") !== ratingValue ||
        (item.feedbackNote ?? "") !== feedbackValue

    useEffect(() => {
        setRatingValue(item.rating ? String(item.rating) : "")
        setFeedbackValue(item.feedbackNote ?? "")
    }, [item.feedbackNote, item.rating])

    const handleSaveFeedback = () => {
        onUpdateFeedback({
            id: item.id,
            rating: ratingValue ? Number(ratingValue) : null,
            feedbackNote: feedbackValue.trim() ? feedbackValue.trim() : null
        })
    }

    return (
        <Card className="overflow-hidden border-border-soft p-0 shadow-premium-md">
            <div className="border-b border-border-soft bg-surface-elevated px-5 py-5 backdrop-blur-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            <h2 className="text-[22px] font-semibold tracking-[-0.03em] text-primary-text">{item.postAuthor}</h2>
                            <span className="feature-pill">
                                {profileName}
                            </span>
                            <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusMeta.className}`}>
                                {statusMeta.label}
                            </span>
                            {item.source ? (
                                <span className="feature-pill">
                                    {sourceLabels[item.source]}
                                </span>
                            ) : null}
                            {item.goal ? (
                                <span className="feature-pill">
                                    {goalLabels[item.goal]}
                                </span>
                            ) : null}
                        </div>
                        {item.postHeadline ? <p className="mt-2 text-[14px] text-secondary-text">{item.postHeadline}</p> : null}
                    </div>

                    <div className="feature-soft-card-strong px-3 py-2 text-right shadow-premium-sm">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-secondary-text">{t.app.historyItem.generatedAtLabel}</p>
                        <p className="mt-1 text-[13px] font-medium text-secondary-text">{formatDistanceToNow(item.createdAt, { addSuffix: true })}</p>
                    </div>
                </div>
            </div>

            <div className="p-5">
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="feature-soft-card-strong">
                        <p className="text-[11px] font-semibold uppercase tracking-widest text-secondary-text">{t.app.historyItem.sourcePostLabel}</p>
                        <p className="mt-3 text-[15px] leading-7 text-secondary-text">{item.postSnippet}</p>
                    </div>
                    <div className="rounded-3xl border border-brand-dark bg-brand-dark p-4 text-white">
                        <div className="flex items-center gap-2 text-white/80">
                            <MessageSquareQuote className="h-4 w-4" />
                            <p className="text-[11px] font-semibold uppercase tracking-widest">{t.app.historyItem.generatedCommentLabel}</p>
                        </div>
                        <p className="mt-3 text-[15px] leading-7 text-white/95">{item.generatedText}</p>
                    </div>
                </div>

                <div className="mt-4 rounded-3xl border border-border-soft bg-surface-card p-4">
                    <div className="grid gap-3">
                        <Select
                            label={t.app.historyItem.feedbackRatingLabel}
                            value={ratingValue}
                            onChange={setRatingValue}
                            options={ratingOptions}
                            placeholder={t.app.historyItem.feedbackNoRating}
                        />
                    </div>

                    <div className="mt-3">
                        <Textarea
                            label={t.app.historyItem.feedbackNoteLabel}
                            className="min-h-21.5"
                            placeholder={t.app.historyItem.feedbackNotePlaceholder}
                            value={feedbackValue}
                            onChange={(event) => setFeedbackValue(event.target.value)}
                        />
                    </div>

                    <div className="mt-3 flex justify-end">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleSaveFeedback}
                            disabled={!hasPendingFeedbackChanges}
                        >
                            {t.app.historyItem.feedbackSaveAction}
                        </Button>
                    </div>
                </div>

                <div className="feature-soft-card mt-4 flex flex-wrap items-center justify-end gap-3">
                    <div className="flex flex-wrap gap-2">
                        <Tooltip text={t.app.historyItem.copyTooltip}>
                            <Button type="button" variant="secondary" onClick={() => onCopy(item.generatedText)}>
                                <Copy className="h-4 w-4" />
                                {t.app.historyItem.copyAction}
                            </Button>
                        </Tooltip>
                        <Tooltip text={t.app.historyItem.trashTooltip}>
                            <Button type="button" variant="dangerSoft" onClick={() => onMoveToTrash(item.id)}>
                                <Trash2 className="h-4 w-4" />
                                {t.app.historyItem.moveToTrash}
                            </Button>
                        </Tooltip>
                    </div>
                </div>
            </div>
        </Card>
    )
})
