"use client"

import { formatDistanceToNow } from "date-fns"
import { CheckCircle2, Copy, MessageSquareQuote, RotateCcw, Sparkles } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Tooltip } from "@/components/ui/tooltip"
import type { HistoryItem } from "@/types/dashboard"

interface HistoryItemCardProps {
    item: HistoryItem
    profileName: string
    onCopy: (comment: string) => void
    onReuse: (id: string) => void
    onToggleApplied: (id: string) => void
}

const goalLabels: Record<NonNullable<HistoryItem["goal"]>, string> = {
    add_value: "Add value",
    challenge: "Challenge",
    networking: "Networking",
    question: "Question"
}

const sourceLabels: Record<NonNullable<HistoryItem["source"]>, string> = {
    alternative: "Alternative",
    generated: "Generated",
    history_reuse: "Reused",
    manual_edit: "Manual edit"
}

function getWordCount(text: string) {
    return text
        .trim()
        .split(/\s+/)
        .filter(Boolean).length
}

export function HistoryItemCard({ item, profileName, onCopy, onReuse, onToggleApplied }: HistoryItemCardProps) {
    const commentWordCount = getWordCount(item.generatedComment)
    const snippetWordCount = getWordCount(item.postSnippet)
    const intensityLabel = commentWordCount <= 18 ? "Concise" : commentWordCount <= 32 ? "Balanced" : "Detailed"

    return (
        <Card className="overflow-hidden border-white/80 p-0 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
            <div className="border-b border-[#EEF2F7] bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.12),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,252,0.94))] px-5 py-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <span className="inline-flex items-center gap-2 rounded-full border border-[#E9DDFE] bg-[#F7F1FF] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6D28D9]">
                            <Sparkles className="h-3.5 w-3.5" />
                            Comment snapshot
                        </span>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            <h2 className="text-[22px] font-semibold tracking-[-0.03em] text-[#141824]">{item.postAuthor}</h2>
                            <span className="rounded-full border border-[#E6EAF2] bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                                {profileName}
                            </span>
                            <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${item.applied ? "border border-emerald-200 bg-emerald-50 text-emerald-700" : "border border-amber-200 bg-amber-50 text-amber-700"}`}>
                                {item.applied ? "Applied" : "Pending"}
                            </span>
                            {item.source ? (
                                <span className="rounded-full border border-[#E6EAF2] bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                                    {sourceLabels[item.source]}
                                </span>
                            ) : null}
                            {item.goal ? (
                                <span className="rounded-full border border-[#E6EAF2] bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                                    {goalLabels[item.goal]}
                                </span>
                            ) : null}
                        </div>
                        {item.postHeadline ? <p className="mt-2 text-[14px] text-slate-600">{item.postHeadline}</p> : null}
                    </div>

                    <div className="rounded-2xl border border-[#DEE5F1] bg-white/90 px-3 py-2 text-right shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">Generated</p>
                        <p className="mt-1 text-[13px] font-medium text-slate-700">{formatDistanceToNow(item.timestamp, { addSuffix: true })}</p>
                        <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">{intensityLabel}</p>
                    </div>
                </div>
            </div>

            <div className="p-5">
                <div className="mb-4 flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-slate-600">
                    <span className="rounded-full border border-[#E6EAF2] bg-white px-2.5 py-1">Source {snippetWordCount} words</span>
                    <span className="rounded-full border border-[#E6EAF2] bg-white px-2.5 py-1">Comment {commentWordCount} words</span>
                    <span className="rounded-full border border-[#E6EAF2] bg-white px-2.5 py-1">{intensityLabel} response</span>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-3xl border border-[#E8ECF4] bg-white/90 p-4">
                        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-600">Source post</p>
                        <p className="mt-3 text-[15px] leading-7 text-slate-700">{item.postSnippet}</p>
                    </div>
                    <div className="rounded-3xl border border-[#1E2336] bg-[#171B2D] p-4 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                        <div className="flex items-center gap-2 text-white/70">
                            <MessageSquareQuote className="h-4 w-4" />
                            <p className="text-[11px] font-semibold uppercase tracking-widest">Generated comment</p>
                        </div>
                        <p className="mt-3 text-[15px] leading-7 text-white/90">{item.generatedComment}</p>
                    </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-[#E8ECF4] bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(248,250,252,0.92))] p-4">
                    <p className="max-w-2xl text-[13px] leading-6 text-slate-600">Use reuse when the angle is still strong, or mark it applied to keep the archive honest and easier to scan later.</p>

                    <div className="flex flex-wrap gap-2">
                        <Tooltip text="Copy this generated comment to clipboard">
                            <Button type="button" variant="secondary" onClick={() => onCopy(item.generatedComment)}>
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
                                {item.applied ? "Mark pending" : "Mark applied"}
                            </Button>
                        </Tooltip>
                    </div>
                </div>
            </div>
        </Card>
    )
}
