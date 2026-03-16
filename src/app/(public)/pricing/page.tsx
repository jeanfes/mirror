"use client";

import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useLanguageStore } from "@/store/useLanguageStore";
import { motion } from "motion/react";
import { ROUTES } from "@/lib/routes";

export default function PricingPage() {
    const { t } = useLanguageStore();

    return (
        <main className="relative flex w-full flex-col items-center overflow-x-hidden pt-10 pb-20">
            <section className="w-full max-w-5xl px-6 pt-20 pb-16 text-center z-10">
                <motion.h1
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="text-5xl font-black tracking-tighter text-primary-dark sm:text-6xl md:text-[4.5rem] leading-[1.1] mb-6"
                >
                    {t.pricing.title1} <span className="text-mirror font-extrabold pb-2">{t.pricing.titleSpan}</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: 0.05, ease: "easeOut" }}
                    className="mx-auto max-w-2xl text-[1.125rem] text-secondary-text md:text-[1.25rem] leading-relaxed font-medium"
                >
                    {t.pricing.subtitle}
                </motion.p>
            </section>

            <section className="w-full max-w-5xl px-6 py-12">
                <div className="grid gap-8 md:grid-cols-2 lg:gap-12 items-center max-w-4xl mx-auto">

                    {/* Free Plan */}
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: 0.1, ease: "easeOut" }}
                        className="neo-card h-full rounded-[18px] border border-border-light bg-surface-card backdrop-blur-sm p-10 flex flex-col shadow-premium-sm"
                    >
                        <div className="mb-6">
                            <h2 className="text-2xl font-black text-primary-dark">{t.pricing.freePlan}</h2>
                            <p className="text-secondary-text font-medium mt-2">{t.pricing.freeDesc}</p>
                        </div>
                        <div className="mb-8 flex items-baseline gap-2">
                            <span className="text-5xl font-black text-primary-dark">$0</span>
                            <span className="text-secondary-text font-medium">{t.pricing.perMonth}</span>
                        </div>
                        <ul className="space-y-4 mb-10 flex-1">
                            {t.pricing.freeFeatures.map((feature, i) => (
                                <li key={i} className="flex items-center gap-3 text-[1.05rem] text-primary-dark font-medium">
                                    <CheckCircle2 className="h-5 w-5 text-primary-light" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Link href={ROUTES.auth.register} className="neo-btn-muted inline-block text-center py-4 text-[1.05rem] font-bold w-full transition-all">
                                {t.pricing.freeBtn}
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Pro Plan */}
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: 0.15, ease: "easeOut" }}
                        className="neo-shell relative flex flex-col border border-border-soft bg-surface-overlay p-10 shadow-premium-md transform md:-translate-y-4"
                    >
                        <div className="absolute top-0 right-10 -translate-y-1/2 rounded-full bg-brand-dark px-4 py-1.5 text-xs font-black uppercase tracking-wider text-white shadow-premium-sm">
                            {t.pricing.popular}
                        </div>
                        <div className="mb-6">
                            <h2 className="text-2xl font-black text-primary-dark">{t.pricing.proPlan}</h2>
                            <p className="text-primary-dark/70 font-medium mt-2">{t.pricing.proDesc}</p>
                        </div>
                        <div className="mb-8 flex items-baseline gap-2">
                            <span className="text-5xl font-black text-primary-dark">$15</span>
                            <span className="text-primary-dark/70 font-medium">{t.pricing.perMonth}</span>
                        </div>
                        <ul className="space-y-4 mb-10 flex-1">
                            {t.pricing.proFeatures.map((feature, i) => (
                                <li key={i} className="flex items-center gap-3 text-[1.05rem] text-primary-dark font-medium">
                                    <CheckCircle2 className="h-5 w-5 text-primary-light" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Link href={ROUTES.auth.register} className="neo-btn-primary inline-block text-center py-4 text-[1.05rem] font-bold w-full">
                                {t.pricing.proBtn}
                            </Link>
                        </motion.div>
                    </motion.div>

                </div>
            </section>
        </main>
    )
}
