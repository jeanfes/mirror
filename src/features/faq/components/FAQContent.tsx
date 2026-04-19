"use client";

import { useMemo } from "react";
import { HelpCircle } from "lucide-react";
import Link from "next/link";
import { FAQAccordion } from "@/features/faq/components/FAQAccordion";
import { useLanguageStore } from "@/store/useLanguageStore";
import type { Dictionary } from "@/lib/i18n/types";
import type { Routes } from "@/lib/routes";

interface FAQContentProps {
    initialT: Dictionary;
    routes: Routes;
}

export function FAQContent({ initialT, routes }: FAQContentProps) {
    const liveT = useLanguageStore((state) => state.t);
    const isHydrated = useLanguageStore((state) => state.isHydrated);
    
    const t = useMemo(() => {
        if (!isHydrated) return initialT;
        return liveT ?? initialT;
    }, [liveT, initialT, isHydrated]);

    return (
        <main className="relative flex w-full flex-col items-center overflow-x-hidden pt-10 pb-20">
            <section className="w-full max-w-4xl px-6 pt-20 pb-16 text-center z-10">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-surface-elevated shadow-premium-sm ring-1 ring-border-soft text-primary-dark mb-8">
                    <HelpCircle className="h-10 w-10 text-primary-dark" strokeWidth={2} />
                </div>
                <h1 className="text-5xl font-black tracking-tighter text-primary-dark sm:text-6xl md:text-[4.5rem] leading-[1.1] mb-6">
                    {t.faqPage.title1} <span className="text-mirror font-extrabold pb-2">{t.faqPage.titleSpan}</span>
                </h1>
                <p className="mx-auto max-w-2xl text-[1.125rem] text-secondary-text md:text-[1.25rem] font-medium leading-relaxed mb-12">
                    {t.faqPage.subtitle}
                </p>

                <FAQAccordion questions={t.faqPage.questions} />

                <div className="mt-20 flex flex-col items-center">
                    <p className="text-primary-dark font-bold text-lg mb-4">{t.faqPage.moreQuestions}</p>
                    <Link href={routes.public.contact} className="neo-btn-primary px-8 h-12 inline-flex items-center text-[1.05rem] font-bold shadow-premium-sm">
                        {t.faqPage.contactSupport}
                    </Link>
                </div>
            </section>
        </main>
    );
}
