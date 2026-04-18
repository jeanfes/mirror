"use client"

import { ReactNode, useState } from "react"
import { Mail, MessageSquare } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/Dialog"
import { useLanguageStore } from "@/store/useLanguageStore"
import { ContactForm } from "@/features/contact/components/ContactForm"

export function ContactSupportModal({ children }: { children: ReactNode }) {
    const [open, setOpen] = useState(false)
    const { t } = useLanguageStore()

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent 
                layer="priority"
                className="w-[min(94vw,600px)] p-6 sm:p-10 max-h-[85vh] overflow-y-auto custom-scrollbar rounded-[28px] border border-border-light shadow-[0_28px_80px_-28px_rgba(0,0,0,0.8)] [--panel-bg:var(--surface-solid)] dark:[--panel-bg:#050505] [--panel-border-color:var(--border-light)]"
            >
                <DialogTitle className="sr-only">{t.contactPage.title1} {t.contactPage.titleSpan}</DialogTitle>
                <DialogDescription className="sr-only">{t.contactPage.subtitle}</DialogDescription>

                <div className="flex flex-col items-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-elevated shadow-premium-sm ring-1 ring-border-soft text-primary-dark mb-6">
                        <Mail className="h-7 w-7 text-primary-dark" strokeWidth={2} />
                    </div>
                    <h1 className="text-3xl font-black tracking-tighter text-primary-dark sm:text-4xl leading-[1.1] mb-4 text-center">
                        {t.contactPage.title1} <span className="text-mirror font-extrabold pb-1">{t.contactPage.titleSpan}</span>
                    </h1>
                    <p className="mx-auto max-w-xl text-[1rem] text-secondary-text font-medium leading-relaxed mb-6 text-center">
                        {t.contactPage.subtitle}
                    </p>

                    <div className="w-full">
                        <ContactForm t={t} hideBackground />
                    </div>

                    <div className="mt-8 grid gap-4 sm:grid-cols-2 w-full max-w-2xl mx-auto">
                        <div className="neo-card flex flex-col items-center rounded-xl border border-border-soft bg-surface-card p-5 text-center backdrop-blur-sm shadow-premium-sm">
                            <Mail className="h-5 w-5 text-accent-blue mb-3" />
                            <h3 className="text-sm font-bold text-primary-dark mb-1">{t.contactPage.supportTitle}</h3>
                            <p className="text-secondary-text text-[12px] font-medium">{t.contactPage.supportEmail}</p>
                        </div>
                        <div className="neo-card flex flex-col items-center rounded-xl border border-border-soft bg-surface-card p-5 text-center backdrop-blur-sm shadow-premium-sm">
                            <MessageSquare className="h-5 w-5 text-accent-blue mb-3" />
                            <h3 className="text-sm font-bold text-primary-dark mb-1">{t.contactPage.socialTitle}</h3>
                            <p className="text-secondary-text text-[12px] font-medium">{t.contactPage.socialHandle}</p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
