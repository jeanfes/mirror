"use client"

import * as React from "react"
import { AlertTriangle } from "lucide-react"
import { motion } from "motion/react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/Dialog"
import { Button } from "@/components/ui/Button"

interface ConfirmDialogProps {
    open: boolean
    title: string
    description?: string
    confirmLabel?: string
    isPending?: boolean
    onConfirm: () => void
    onCancel: () => void
}

export function ConfirmDialog({
    open,
    title,
    description,
    confirmLabel = "Delete",
    isPending = false,
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    return (
        <Dialog open={open} onOpenChange={(next) => (!next ? onCancel() : undefined)}>
            <DialogContent className="w-[min(94vw,380px)] rounded-3xl p-6">
                <div className="flex flex-col items-center text-center">
                    <div
                        className="flex h-12 w-12 items-center justify-center rounded-full border"
                        style={{ background: "var(--danger-soft-bg)", borderColor: "var(--danger-soft-border)" }}
                    >
                        <AlertTriangle className="h-5 w-5 text-danger" />
                    </div>

                    <DialogTitle className="mt-4 text-[15px] font-bold tracking-[-0.02em] text-[#141824]">
                        {title}
                    </DialogTitle>

                    {description && (
                        <p className="mt-1.5 text-[13px] leading-[1.6] text-secondary-text">
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
                        <motion.button
                            type="button"
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={isPending}
                            onClick={onConfirm}
                            className="flex-1 inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-danger bg-danger px-3.5 text-[13px] font-semibold text-white transition-all duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            {isPending ? "Deleting…" : confirmLabel}
                        </motion.button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
