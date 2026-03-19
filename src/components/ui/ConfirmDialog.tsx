"use client"

import { AlertTriangle } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/Dialog"
import { Button } from "@/components/ui/Button"

interface ConfirmDialogProps {
    open: boolean
    title: string
    description?: string
    confirmLabel?: string
    confirmPendingLabel?: string
    cancelLabel?: string
    isPending?: boolean
    onConfirm: () => void
    onCancel: () => void
}

export function ConfirmDialog({
    open,
    title,
    description,
    confirmLabel = "Delete",
    confirmPendingLabel = "Working...",
    cancelLabel = "Cancel",
    isPending = false,
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    return (
        <Dialog open={open} onOpenChange={(next) => (!next ? onCancel() : undefined)}>
            <DialogContent
                layer="priority"
                hideCloseButton
                aria-busy={isPending}
                onEscapeKeyDown={(event) => {
                    if (isPending) {
                        event.preventDefault()
                    }
                }}
                onInteractOutside={(event) => {
                    if (isPending) {
                        event.preventDefault()
                    }
                }}
                className="w-[min(94vw,420px)] rounded-[28px] border border-border-light p-6 shadow-[0_28px_80px_-28px_rgba(15,23,42,0.65)] [--panel-bg:var(--surface-overlay-strong)] [--panel-border-color:var(--border-light)]"
            >
                <div className="flex flex-col items-center text-center">
                    <div
                        className="mt-4 flex h-12 w-12 items-center justify-center rounded-full border shadow-premium-sm"
                        style={{ background: "var(--danger-soft-bg)", borderColor: "var(--danger-soft-border)" }}
                    >
                        <AlertTriangle className="h-5 w-5 text-danger" />
                    </div>

                    <DialogTitle className="mt-4 text-[15px] font-bold tracking-[-0.02em] text-primary-text">
                        {title}
                    </DialogTitle>

                    {description && (
                        <DialogDescription className="mt-1.5 text-[13px] leading-[1.6] text-secondary-text">
                            {description}
                        </DialogDescription>
                    )}

                    <div className="mt-6 flex w-full gap-2">
                        <Button
                            type="button"
                            variant="secondary"
                            className="flex-1"
                            onClick={onCancel}
                            disabled={isPending}
                        >
                            {cancelLabel}
                        </Button>
                        <Button
                            type="button"
                            loading={isPending}
                            loadingLabel={confirmPendingLabel}
                            onClick={onConfirm}
                            className="flex-1 border-danger bg-danger text-white hover:opacity-90"
                        >
                            {confirmLabel}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
