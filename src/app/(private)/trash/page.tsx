"use client"

import { useMemo } from "react"
import { formatDistanceToNow } from "date-fns"
import { ArchiveRestore, Trash2, Undo2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { LoadingOverlay, useLoadingDelay } from "@/components/ui/Loading"
import { StatePanel } from "@/components/ui/StatePanel"
import { useTrash } from "@/features/history/hooks/useTrash"
import type { TrashItem } from "@/features/history/services/trash.local.service"
import { useLanguageStore } from "@/store/useLanguageStore"

export default function TrashPage() {
    const { data, isLoading, isError, restore, deleteForever: deleteItem, isMutating } = useTrash()
    const { t } = useLanguageStore()
    const showLoading = useLoadingDelay(isLoading)
    const items = useMemo<TrashItem[]>(() => data ?? [], [data])

    const summary = useMemo(() => {
        const list = items ?? []
        return {
            total: list.length,
            profiles: list.filter((item) => item.kind === "profile").length,
            comments: list.filter((item) => item.kind === "comment").length,
            drafts: list.filter((item) => item.kind === "draft").length
        }
    }, [items])

    const restoreItem = async (id: string) => {
        try {
            await restore(id)
            toast.success("Item restored")
        } catch {
            toast.error("Could not restore item")
        }
    }

    const deleteForever = async (id: string) => {
        try {
            await deleteItem(id)
            toast.success("Item permanently deleted")
        } catch {
            toast.error("Could not delete item")
        }
    }

    const restoreAll = async () => {
        if (items.length === 0) return
        try {
            for (const item of items) {
                await restore(item.id)
            }
            toast.success("All trash items restored")
        } catch {
            toast.error("Could not restore all items")
        }
    }

    if (showLoading) {
        return <LoadingOverlay show={true} />
    }

    if (isError) {
        return (
            <StatePanel
                tone="error"
                title={t.app.trashErrorTitle}
                description={t.app.trashErrorDesc}
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
                        <h1 className="max-w-xl text-4xl font-black tracking-[-0.05em] text-primary-text md:text-5xl">
                            Deleted work should feel recoverable, not lost in a dead-end bin.
                        </h1>
                        <p className="mt-4 max-w-xl text-[15px] leading-7 text-secondary-text">
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
                <StatePanel
                    icon={<ArchiveRestore className="h-6 w-6 text-primary-text" />}
                    title={t.app.trashEmptyTitle}
                    description={t.app.trashEmptyDesc}
                />
            ) : (
                <>
                    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h2 className="section-heading">Recently deleted</h2>
                            <p className="body-muted">Review what was removed before deciding whether to restore it or clear it permanently.</p>
                        </div>
                        <Button type="button" variant="secondary" onClick={restoreAll} loading={isMutating}>
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
                                            <h3 className="text-[22px] font-semibold tracking-[-0.03em] text-primary-text">{item.title}</h3>
                                            <span className="rounded-full border border-border-soft bg-surface-base px-2.5 py-1 text-[11px] font-semibold text-secondary-text capitalize">{item.kind}</span>
                                        </div>
                                        <p className="mt-2 max-w-2xl body-muted">{item.summary}</p>
                                        <p className="mt-3 text-[12px] font-medium text-secondary-text">Deleted {formatDistanceToNow(item.deletedAt, { addSuffix: true })}</p>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        <Button type="button" variant="secondary" onClick={() => restoreItem(item.id)} loading={isMutating}>
                                            <ArchiveRestore className="h-4 w-4" />
                                            Restore
                                        </Button>
                                        <Button type="button" onClick={() => deleteForever(item.id)} loading={isMutating}>
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

