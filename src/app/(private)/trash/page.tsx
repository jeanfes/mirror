"use client"

import { useMemo, useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { ArchiveRestore, Trash2, Undo2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"

interface TrashItem {
    id: string
    title: string
    kind: "profile" | "comment" | "draft"
    deletedAt: number
    summary: string
}

const initialTrash: TrashItem[] = [
    {
        id: "trash_profile_1",
        title: "Event Operator",
        kind: "profile",
        deletedAt: Date.now() - 1000 * 60 * 45,
        summary: "A more energetic voice profile that leaned too promotional for the current brand tone."
    },
    {
        id: "trash_comment_1",
        title: "Comment draft for Elena Torres",
        kind: "comment",
        deletedAt: Date.now() - 1000 * 60 * 60 * 7,
        summary: "A saved comment variation that was replaced by a sharper, more concise version."
    }
]

export default function TrashPage() {
    const [items, setItems] = useState<TrashItem[]>(initialTrash)

    const summary = useMemo(() => {
        return {
            total: items.length,
            profiles: items.filter((item) => item.kind === "profile").length,
            comments: items.filter((item) => item.kind === "comment").length,
            drafts: items.filter((item) => item.kind === "draft").length
        }
    }, [items])

    const restoreItem = (id: string) => {
        const item = items.find((entry) => entry.id === id)
        if (!item) return

        setItems((current) => current.filter((entry) => entry.id !== id))
        toast.success(`${item.title} restored`)
    }

    const deleteForever = (id: string) => {
        const item = items.find((entry) => entry.id === id)
        if (!item) return

        setItems((current) => current.filter((entry) => entry.id !== id))
        toast.success(`${item.title} removed permanently`)
    }

    const restoreAll = () => {
        if (items.length === 0) return
        setItems([])
        toast.success("All trash items restored")
    }

    return (
        <div className="space-y-6">
            <section className="workspace-hero-shell">
                <div aria-hidden="true" className="absolute -right-14 top-0 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.24),transparent_72%)]" />
                <div aria-hidden="true" className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(117,206,243,0.28),transparent_74%)]" />

                <div className="relative grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
                    <div className="max-w-2xl">
                        <h1 className="max-w-xl text-4xl font-black tracking-[-0.05em] text-[#141824] md:text-5xl">
                            Deleted work should feel recoverable, not lost in a dead-end bin.
                        </h1>
                        <p className="mt-4 max-w-xl text-[15px] leading-7 text-slate-600">
                            Trash is where profiles, drafts and comments wait for a final decision. It should make restoration easy and permanent deletion explicit.
                        </p>
                    </div>

                    <Card className="dashboard-dark-panel">
                        <h2 className="text-[24px] font-semibold tracking-[-0.03em] text-white">What is waiting for a decision</h2>
                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <div className="dashboard-dark-stat">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/80">Total</p>
                                <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white">{summary.total}</p>
                            </div>
                            <div className="dashboard-dark-stat">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/80">Profiles</p>
                                <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white">{summary.profiles}</p>
                            </div>
                            <div className="dashboard-dark-stat">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/80">Comments</p>
                                <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white">{summary.comments}</p>
                            </div>
                            <div className="dashboard-dark-stat">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/80">Drafts</p>
                                <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white">{summary.drafts}</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </section>

            {items.length === 0 ? (
                <Card className="dashboard-empty-state">
                    <div className="mx-auto icon-box-lg icon-bg-purple">
                        <ArchiveRestore className="h-6 w-6" />
                    </div>
                    <h2 className="mt-5 section-heading">Trash is clear</h2>
                    <p className="mx-auto mt-2 max-w-xl body-muted">Nothing is waiting for recovery right now. Deleted items that appear here can be restored or removed permanently after review.</p>
                </Card>
            ) : (
                <>
                    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h2 className="section-heading">Recently deleted</h2>
                            <p className="body-muted">Review what was removed before deciding whether to restore it or clear it permanently.</p>
                        </div>
                        <Button type="button" variant="secondary" onClick={restoreAll}>
                            <Undo2 className="h-4 w-4" />
                            Restore all
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {items.map((item) => (
                            <Card key={item.id} className="dashboard-card-xl">
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="text-[22px] font-semibold tracking-[-0.03em] text-[#141824]">{item.title}</h3>
                                            <span className="rounded-full border border-[#E6EAF2] bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600 capitalize">{item.kind}</span>
                                        </div>
                                        <p className="mt-2 max-w-2xl body-muted">{item.summary}</p>
                                        <p className="mt-3 text-[12px] font-medium text-slate-500">Deleted {formatDistanceToNow(item.deletedAt, { addSuffix: true })}</p>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        <Button type="button" variant="secondary" onClick={() => restoreItem(item.id)}>
                                            <ArchiveRestore className="h-4 w-4" />
                                            Restore
                                        </Button>
                                        <Button type="button" onClick={() => deleteForever(item.id)}>
                                            <Trash2 className="h-4 w-4" />
                                            Delete forever
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}
