"use client";

import { HelpCircle, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import { useLanguageStore } from "@/store/useLanguageStore";
import { ROUTES } from "@/lib/routes";

export default function FAQPage() {
    const { t } = useLanguageStore();
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const fadeInUp = {
        initial: { opacity: 0, y: 8 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-50px" },
        transition: { duration: 0.25, ease: "easeOut" as const }
    };

    return (
        <main className="relative flex w-full flex-col items-center overflow-x-hidden pt-10 pb-20">
            <section className="w-full max-w-4xl px-6 pt-20 pb-16 text-center z-10">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-premium-sm ring-1 ring-border-soft text-primary-dark mb-8">
                    <HelpCircle className="h-10 w-10 text-primary-dark" strokeWidth={2} />
                </div>
                <motion.h1 {...fadeInUp} className="text-5xl font-black tracking-tighter text-primary-dark sm:text-6xl md:text-[4.5rem] leading-[1.1] mb-6">
                    {t.faqPage.title1} <span className="text-mirror font-extrabold pb-2">{t.faqPage.titleSpan}</span>
                </motion.h1>
                <motion.p {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.05 }} className="mx-auto max-w-2xl text-[1.125rem] text-secondary-text md:text-[1.25rem] font-medium leading-relaxed mb-12">
                    {t.faqPage.subtitle}
                </motion.p>

                <div className="space-y-4 text-left max-w-3xl mx-auto">
                    {t.faqPage.questions.map((faq, i) => {
                        const isOpen = openIndex === i;
                        return (
                            <div
                                key={i}
                                className={`neo-card rounded-[18px] border border-border-light bg-white/75 backdrop-blur-sm shadow-premium-sm transition-all duration-300 ${isOpen ? 'shadow-premium-md scale-[1.02]' : 'hover:shadow-premium-sm'}`}
                            >
                                <button
                                    onClick={() => setOpenIndex(isOpen ? null : i)}
                                    className="flex w-full items-center justify-between p-6 md:p-8 text-left"
                                >
                                    <h3 className="text-lg md:text-xl font-black text-primary-dark pr-8">{faq.q}</h3>
                                    <div className={`shrink-0 h-10 w-10 flex items-center justify-center rounded-full transition-colors duration-300 ${isOpen ? 'bg-primary-dark text-white' : 'bg-bg-main text-primary-dark'}`}>
                                        <Plus className={`h-6 w-6 transition-transform duration-300 ${isOpen ? 'rotate-45' : 'rotate-0'}`} />
                                    </div>
                                </button>
                                <div
                                    className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                                >
                                    <div className="overflow-hidden">
                                        <p className="px-6 pb-8 md:px-8 text-secondary-text text-[1.05rem] font-medium leading-relaxed">
                                            {faq.a}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <motion.div {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.1 }} className="mt-20 flex flex-col items-center">
                    <p className="text-primary-dark font-bold text-lg mb-4">{t.faqPage.moreQuestions}</p>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link href={ROUTES.public.contact} className="neo-btn-primary px-8 h-12 inline-flex items-center text-[1.05rem] font-bold shadow-premium-sm">
                            {t.faqPage.contactSupport}
                        </Link>
                    </motion.div>
                </motion.div>
            </section>
        </main>
    )
}
