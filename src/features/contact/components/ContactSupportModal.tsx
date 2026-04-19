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
                className="w-[min(94vw,600px)] p-6 sm:p-10 max-h-[85vh] overflow-y-auto custom-scrollbar rounded-[32px] border border-border-light shadow-premium-xl [--panel-bg:var(--surface-solid)] [--panel-border-color:var(--border-light)]"
            >
                <DialogTitle className="sr-only">{t.contactPage.title1} {t.contactPage.titleSpan}</DialogTitle>
                <DialogDescription className="sr-only">{t.contactPage.subtitle}</DialogDescription>

                <div className="flex flex-col items-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-elevated shadow-premium-sm ring-1 ring-border-soft text-primary-dark mb-6 group-focus-within:scale-110 transition-transform duration-500">
                        <Mail className="h-7 w-7 text-primary-dark opacity-90" strokeWidth={2} />
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
                        <div className="feature-soft-card flex flex-col items-center p-5 text-center transition-all hover:bg-surface-elevated group">
                            <Mail className="h-5 w-5 text-accent-blue mb-3 group-hover:scale-110 transition-transform" />
                            <h3 className="text-xs font-bold text-primary-dark/80 tracking-wide mb-1 uppercase">{t.contactPage.supportTitle}</h3>
                            <p className="text-secondary-text text-[12px] font-medium selection:bg-accent-blue/10">{t.contactPage.supportEmail}</p>
                        </div>
                        <div className="feature-soft-card flex flex-col items-center p-5 text-center transition-all hover:bg-surface-elevated group">
                            <MessageSquare className="h-5 w-5 text-accent-blue mb-3 group-hover:scale-110 transition-transform" />
                            <h3 className="text-xs font-bold text-primary-dark/80 tracking-wide mb-1 uppercase">{t.contactPage.socialTitle}</h3>
                            <p className="text-secondary-text text-[12px] font-medium selection:bg-accent-blue/10">{t.contactPage.socialHandle}</p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
