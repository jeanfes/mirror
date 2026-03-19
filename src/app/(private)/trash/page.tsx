"use client"

import { useMemo } from "react"
import { formatDistanceToNow } from "date-fns"
import { ArchiveRestore, Trash2, Undo2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { LoadingOverlay, useLoadingDelay } from "@/components/ui/Loading"
import { StatePanel } from "@/components/ui/StatePanel"
import { useTrash } from "@/features/trash/hooks/useTrash"
import type { TrashItem } from "@/features/trash/services/trash.service"
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
            toast.success(t.app.common.itemRestored)
        } catch {
            toast.error(t.app.common.itemRestoreError)
        }
    }

    const deleteForever = async (id: string) => {
        try {
            await deleteItem(id)
            toast.success(t.app.common.itemDeleted)
        } catch {
            toast.error(t.app.common.itemDeleteError)
        }
    }

    const restoreAll = async () => {
        if (items.length === 0) return
        try {
            for (const item of items) {
                await restore(item.id)
            }
            toast.success(t.app.common.allRestored)
        } catch {
            toast.error(t.app.common.allRestoreError)
        }
    }

    if (showLoading) {
        return <LoadingOverlay show={true} />
    }

    if (isError) {
        return (
            <StatePanel
                tone="error"
                title={t.app.common.trashErrorTitle}
                description={t.app.common.trashErrorDesc}
            />
        )
    }

    return (
        <div className="space-y-6">
            <section className="workspace-hero-shell">
                <div aria-hidden="true" className="absolute -right-14 top-0 h-44 w-44 rounded-full workspace-hero-orb-purple" />
                <div aria-hidden="true" className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full workspace-hero-orb-cyan" />

                <div className={`relative grid gap-6 ${summary.total === 0 ? "lg:grid-cols-1" : "lg:grid-cols-[1.15fr_0.85fr]"} lg:items-start`}>
                    <div className="max-w-2xl">
                        <h1 className="max-w-xl text-4xl font-black tracking-[-0.05em] text-primary-text md:text-5xl">
                            {t.app.trash.heroTitle}
                        </h1>
                        <p className="mt-4 max-w-xl text-[15px] leading-7 text-secondary-text">
                            {t.app.trash.heroDesc}
                        </p>
                    </div>

                    {summary.total > 0 ? (
                        <Card className="dashboard-dark-panel">
                            <h2 className="text-[24px] font-semibold tracking-[-0.03em] text-white">{t.app.trash.waitingDecision}</h2>
                            <div className="mt-6 grid grid-cols-2 gap-3">
                                <div className="dashboard-dark-stat">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/80">{t.app.trash.total}</p>
                                    <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white">{summary.total}</p>
                                </div>
                                <div className="dashboard-dark-stat">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/80">{t.app.trash.profiles}</p>
                                    <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white">{summary.profiles}</p>
                                </div>
                                <div className="dashboard-dark-stat">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/80">{t.app.trash.comments}</p>
                                    <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white">{summary.comments}</p>
                                </div>
                                <div className="dashboard-dark-stat">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/80">{t.app.trash.drafts}</p>
                                    <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white">{summary.drafts}</p>
                                </div>
                            </div>
                        </Card>
                    ) : null}
                </div>
            </section>

            {items.length === 0 ? (
                <StatePanel
                    icon={<ArchiveRestore className="h-6 w-6 text-primary-text" />}
                    title={t.app.common.trashEmptyTitle}
                    description={t.app.common.trashEmptyDesc}
                />
            ) : (
                <>
                    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h2 className="section-heading">{t.app.trash.recentlyDeleted}</h2>
                            <p className="body-muted">{t.app.trash.recentlyDeletedDesc}</p>
                        </div>
                        <Button type="button" variant="secondary" onClick={restoreAll} loading={isMutating}>
                            <Undo2 className="h-4 w-4" />
                            {t.app.trash.restoreAll}
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
                                        <p className="mt-3 text-[12px] font-medium text-secondary-text">
                                            {t.app.trash.deletedX.replace("{0}", formatDistanceToNow(item.deletedAt, { addSuffix: true }))}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        <Button type="button" variant="secondary" onClick={() => restoreItem(item.id)} loading={isMutating}>
                                            <ArchiveRestore className="h-4 w-4" />
                                            {t.app.trash.restore}
                                        </Button>
                                        <Button type="button" onClick={() => deleteForever(item.id)} loading={isMutating}>
                                            <Trash2 className="h-4 w-4" />
                                            {t.app.trash.deleteForever}
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

