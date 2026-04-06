"use client"

import { formatDistanceToNow } from "date-fns"
import { CheckCircle2, Copy, MessageSquareQuote, RotateCcw, Trash2 } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Tooltip } from "@/components/ui/Tooltip"
import type { GenerationHistory } from "@/types/database.types"

interface HistoryItemCardProps {
    item: GenerationHistory
    profileName: string
    onCopy: (comment: string) => void
    onReuse: (id: string) => void
    onToggleApplied: (id: string) => void
    onMoveToTrash: (id: string) => void
}

const goalLabels: Record<NonNullable<GenerationHistory["goal"]>, string> = {
    add_value: "Add value",
    challenge: "Challenge",
    networking: "Networking",
    question: "Question"
}

const sourceLabels: Record<NonNullable<GenerationHistory["source"]>, string> = {
    alternative: "Alternative",
    generated: "Generated",
    history_reuse: "Reused",
    manual_edit: "Manual edit"
}

export function HistoryItemCard({ item, profileName, onCopy, onReuse, onToggleApplied, onMoveToTrash }: HistoryItemCardProps) {
    const statusMeta = item.status === "applied"
        ? { label: "Applied", className: "badge-success" }
        : item.status === "dismissed"
            ? { label: "Dismissed", className: "badge-accent" }
            : { label: "Pending", className: "badge-warning" }
    const isApplied = item.status === "applied"
    const toggleLabel = isApplied || item.status === "dismissed" ? "Mark pending" : "Mark applied"

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
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-secondary-text">Generated</p>
                        <p className="mt-1 text-[13px] font-medium text-secondary-text">{formatDistanceToNow(item.createdAt, { addSuffix: true })}</p>
                    </div>
                </div>
            </div>

            <div className="p-5">
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="feature-soft-card-strong">
                        <p className="text-[11px] font-semibold uppercase tracking-widest text-secondary-text">Source post</p>
                        <p className="mt-3 text-[15px] leading-7 text-secondary-text">{item.postSnippet}</p>
                    </div>
                    <div className="rounded-3xl border border-brand-dark bg-brand-dark p-4 text-white">
                        <div className="flex items-center gap-2 text-white/80">
                            <MessageSquareQuote className="h-4 w-4" />
                            <p className="text-[11px] font-semibold uppercase tracking-widest">Generated comment</p>
                        </div>
                        <p className="mt-3 text-[15px] leading-7 text-white/95">{item.generatedText}</p>
                    </div>
                </div>

                <div className="feature-soft-card mt-4 flex flex-wrap items-center justify-end gap-3">
                    <div className="flex flex-wrap gap-2">
                        <Tooltip text="Copy this generated comment to clipboard">
                            <Button type="button" variant="secondary" onClick={() => onCopy(item.generatedText)}>
                                <Copy className="h-4 w-4" />
                                Copy
                            </Button>
                        </Tooltip>
                        <Tooltip text="Create a new history item from this angle">
                            <Button type="button" variant="secondary" onClick={() => onReuse(item.id)}>
                                <RotateCcw className="h-4 w-4" />
                                Reuse
                            </Button>
                        </Tooltip>
                        <Tooltip text="Toggle whether this comment was already used">
                            <Button type="button" onClick={() => onToggleApplied(item.id)}>
                                <CheckCircle2 className="h-4 w-4" />
                                {toggleLabel}
                            </Button>
                        </Tooltip>
                        <Tooltip text="Move this history item to trash">
                            <Button type="button" variant="dangerSoft" onClick={() => onMoveToTrash(item.id)}>
                                <Trash2 className="h-4 w-4" />
                                Move to trash
                            </Button>
                        </Tooltip>
                    </div>
                </div>
            </div>
        </Card>
    )
}
