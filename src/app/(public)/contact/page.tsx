import { Mail, MessageSquare } from "lucide-react";
import { getDictionary } from "@/lib/i18n-server";
import { ContactForm } from "@/features/contact/components/ContactForm";

export default async function ContactPage() {
    const { t } = await getDictionary();

    return (
        <main className="relative flex w-full flex-col items-center overflow-x-hidden pt-10 pb-20">
            <section className="w-full max-w-4xl px-6 pt-20 pb-16 text-center z-10">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-surface-elevated shadow-premium-sm ring-1 ring-border-soft text-primary-dark mb-8">
                    <Mail className="h-10 w-10 text-primary-dark" strokeWidth={2} />
                </div>
                <h1 className="text-5xl font-black tracking-tighter text-primary-dark sm:text-6xl md:text-[4.5rem] leading-[1.1] mb-6">
                    {t.contactPage.title1} <span className="text-mirror font-extrabold pb-2">{t.contactPage.titleSpan}</span>
                </h1>
                <p className="mx-auto max-w-2xl text-[1.125rem] text-secondary-text md:text-[1.25rem] font-medium leading-relaxed mb-12">
                    {t.contactPage.subtitle}
                </p>

                <ContactForm t={t} />

                <div className="mt-16 grid gap-8 sm:grid-cols-2 max-w-2xl mx-auto">
                    <div className="neo-card flex flex-col items-center rounded-2xl border border-border-soft bg-surface-card p-6 text-center backdrop-blur-sm shadow-premium-sm transition-shadow hover:shadow-premium-md">
                        <Mail className="h-8 w-8 text-accent-blue mb-4" />
                        <h3 className="font-bold text-primary-dark mb-1">{t.contactPage.supportTitle}</h3>
                        <p className="text-secondary-text text-sm font-medium">support@mirror.com</p>
                    </div>
                    <div className="neo-card flex flex-col items-center rounded-2xl border border-border-soft bg-surface-card p-6 text-center backdrop-blur-sm shadow-premium-sm transition-shadow hover:shadow-premium-md">
                        <MessageSquare className="h-8 w-8 text-accent-blue mb-4" />
                        <h3 className="font-bold text-primary-dark mb-1">{t.contactPage.socialTitle}</h3>
                        <p className="text-secondary-text text-sm font-medium">@mirror_extension</p>
                    </div>
                </div>
            </section>
        </main>
    )
}


