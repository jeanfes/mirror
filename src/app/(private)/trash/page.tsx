"use client"

import { useMemo, useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { ArchiveRestore, Sparkles, Trash2, Undo2 } from "lucide-react"
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
            <section className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_360px]">
                <Card elevated className="overflow-hidden border-white/70 p-6 md:p-7">
                    <div className="relative">
                        <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(117,206,243,0.22),transparent_68%)] blur-2xl" />
                        <div className="absolute left-12 top-10 h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.18),transparent_68%)] blur-2xl" />

                        <div className="relative max-w-3xl">
                            <span className="inline-flex items-center gap-2 rounded-full border border-[#E9DDFE] bg-[#F7F1FF] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6D28D9]">
                                <Trash2 className="h-3.5 w-3.5" />
                                Recovery desk
                            </span>
                            <h1 className="mt-4 max-w-2xl text-[34px] font-semibold leading-[1.05] tracking-[-0.04em] text-[#141824] md:text-[42px]">
                                Deleted work should feel recoverable, not lost in a dead-end bin.
                            </h1>
                            <p className="mt-4 max-w-2xl text-[15px] leading-7 text-slate-600">
                                Trash is where profiles, drafts and comments wait for a final decision. It should make restoration easy and permanent deletion explicit.
                            </p>
                        </div>
                    </div>
                </Card>

                <Card className="rounded-4xl border-[#171B2D] bg-[#171B2D] p-6 text-white shadow-[0_28px_80px_rgba(15,23,42,0.22)]">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/85">
                        <Sparkles className="h-3.5 w-3.5" />
                        Trash overview
                    </span>
                    <h2 className="mt-4 text-[24px] font-semibold tracking-[-0.03em] text-white">What is waiting for a decision</h2>
                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <div className="rounded-3xl border border-white/20 bg-white/12 p-4">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/80">Total</p>
                            <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white">{summary.total}</p>
                        </div>
                        <div className="rounded-3xl border border-white/20 bg-white/12 p-4">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/80">Profiles</p>
                            <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white">{summary.profiles}</p>
                        </div>
                        <div className="rounded-3xl border border-white/20 bg-white/12 p-4">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/80">Comments</p>
                            <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white">{summary.comments}</p>
                        </div>
                        <div className="rounded-3xl border border-white/20 bg-white/12 p-4">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/80">Drafts</p>
                            <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white">{summary.drafts}</p>
                        </div>
                    </div>
                </Card>
            </section>

            {items.length === 0 ? (
                <Card className="rounded-4xl p-10 text-center">
                    <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(139,92,246,0.14),rgba(117,206,243,0.14))] text-[#141824]">
                        <ArchiveRestore className="h-6 w-6" />
                    </div>
                    <h2 className="mt-5 text-[24px] font-semibold tracking-[-0.03em] text-[#141824]">Trash is clear</h2>
                    <p className="mx-auto mt-2 max-w-xl text-[14px] leading-6 text-slate-600">Nothing is waiting for recovery right now. Deleted items that appear here can be restored or removed permanently after review.</p>
                </Card>
            ) : (
                <>
                    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h2 className="text-[24px] font-semibold tracking-[-0.03em] text-[#141824]">Recently deleted</h2>
                            <p className="text-[14px] leading-6 text-slate-600">Review what was removed before deciding whether to restore it or clear it permanently.</p>
                        </div>
                        <Button type="button" variant="secondary" onClick={restoreAll}>
                            <Undo2 className="h-4 w-4" />
                            Restore all
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {items.map((item) => (
                            <Card key={item.id} className="rounded-4xl p-6">
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="text-[22px] font-semibold tracking-[-0.03em] text-[#141824]">{item.title}</h3>
                                            <span className="rounded-full border border-[#E6EAF2] bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600 capitalize">{item.kind}</span>
                                        </div>
                                        <p className="mt-2 max-w-2xl text-[14px] leading-6 text-slate-600">{item.summary}</p>
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
