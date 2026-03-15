"use client"

import { AlertTriangle } from "lucide-react"
import { motion } from "motion/react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/Dialog"
import { Button } from "@/components/ui/Button"

interface ConfirmDialogProps {
    open: boolean
    title: string
    description?: string
    confirmLabel?: string
    confirmPendingLabel?: string
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
                className="w-[min(94vw,420px)] rounded-[28px] border border-white/65 bg-white/94 p-6 shadow-[0_28px_80px_-28px_rgba(15,23,42,0.65)] [--panel-bg:rgba(255,255,255,0.94)] [--panel-border-color:rgba(255,255,255,0.65)]"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.96, y: 6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="flex flex-col items-center text-center"
                >
                    <motion.div
                        initial={{ scale: 0.92 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.25, ease: "easeOut", delay: 0.05 }}
                        className="mt-4 flex h-12 w-12 items-center justify-center rounded-full border shadow-premium-sm"
                        style={{ background: "var(--danger-soft-bg)", borderColor: "var(--danger-soft-border)" }}
                    >
                        <AlertTriangle className="h-5 w-5 text-danger" />
                    </motion.div>

                    <DialogTitle className="mt-4 text-[15px] font-bold tracking-[-0.02em] text-primary-text">
                        {title}
                    </DialogTitle>

                    {description && (
                        <p className="mt-1.5 text-[13px] leading-[1.6] text-slate-600">
                            {description}
                        </p>
                    )}

                    <div className="mt-6 flex w-full gap-2">
                        <Button
                            type="button"
                            variant="secondary"
                            className="flex-1"
                            onClick={onCancel}
                            disabled={isPending}
                        >
                            Cancel
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
                </motion.div>
            </DialogContent>
        </Dialog>
    )
}
