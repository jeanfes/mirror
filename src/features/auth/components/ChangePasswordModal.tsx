"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "@/components/ui/Dialog"
import { ChangePasswordForm } from "./ChangePasswordForm"
import { useLanguageStore } from "@/store/useLanguageStore"

interface ChangePasswordModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function ChangePasswordModal({ open, onOpenChange }: ChangePasswordModalProps) {
    const { t } = useLanguageStore()

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent 
                className="w-[min(94vw,440px)] rounded-[28px] border border-border-light p-8 shadow-[0_28px_80px_-28px_rgba(15,23,42,0.65)] [--panel-bg:var(--surface-overlay-strong)] [--panel-border-color:var(--border-light)]" 
                layer="priority"
            >
                <div className="space-y-1 mb-6">
                    <DialogTitle className="text-xl font-bold tracking-tight text-primary-text">
                        {t.auth.changePasswordTitle}
                    </DialogTitle>
                    <DialogDescription className="text-[14px] text-secondary-text">
                        {t.auth.changePasswordSubtitle}
                    </DialogDescription>
                </div>

                <ChangePasswordForm onCancel={() => onOpenChange(false)} />
            </DialogContent>
        </Dialog>
    )
}
