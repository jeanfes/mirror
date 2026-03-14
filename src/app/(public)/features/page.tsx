"use client";

import { Zap, UserCircle, PenTool, Brain } from "lucide-react";
import { motion } from "motion/react";

import { useLanguageStore } from "@/store/useLanguageStore";

export default function FeaturesPage() {
    const { t } = useLanguageStore();

    const fadeInUp = {
        initial: { opacity: 0, y: 8 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-50px" },
        transition: { duration: 0.25, ease: "easeOut" as const }
    };

    return (
        <main className="relative flex min-h-screen flex-col items-center overflow-x-hidden pt-10 pb-20">
            <section className="w-full max-w-5xl px-6 pt-20 pb-16 text-center z-10">
                <motion.h1 {...fadeInUp} className="text-5xl font-black tracking-tighter text-primary-dark sm:text-6xl md:text-[4.5rem] leading-[1.1] mb-6">
                    <span className="text-mirror pb-2 font-extrabold">{t.featuresPage.title1}</span> {t.featuresPage.titleSpan}
                </motion.h1>
                <motion.p {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.1 }} className="mx-auto max-w-2xl text-[1.125rem] text-secondary-text md:text-[1.25rem] font-medium leading-relaxed">
                    {t.featuresPage.subtitle}
                </motion.p>
            </section>

            <section className="w-full max-w-5xl px-6 py-12">
                <div className="grid gap-12 sm:grid-cols-2">

                    {/* Feature Card Detailed */}
                    <motion.div {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.2 }} className="neo-card rounded-[28px] border border-border-light bg-white/75 backdrop-blur-sm p-10 shadow-premium-sm flex flex-col items-start gap-4">
                        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-premium-sm ring-1 ring-border-soft">
                            <Zap className="h-8 w-8 text-primary-dark" />
                        </div>
                        <h2 className="text-2xl font-black text-primary-dark">{t.featuresPage.f1Title}</h2>
                        <p className="text-secondary-text text-[1.05rem] leading-relaxed font-medium">
                            {t.featuresPage.f1Desc}
                        </p>
                    </motion.div>

                    <motion.div {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.3 }} className="neo-card rounded-[28px] border border-border-light bg-white/75 backdrop-blur-sm p-10 shadow-premium-sm flex flex-col items-start gap-4">
                        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-premium-sm ring-1 ring-border-soft">
                            <Brain className="h-8 w-8 text-primary-dark" />
                        </div>
                        <h2 className="text-2xl font-black text-primary-dark">{t.featuresPage.f2Title}</h2>
                        <p className="text-secondary-text text-[1.05rem] leading-relaxed font-medium">
                            {t.featuresPage.f2Desc}
                        </p>
                    </motion.div>

                    <motion.div {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.4 }} className="neo-card rounded-[28px] border border-border-light bg-white/75 backdrop-blur-sm p-10 shadow-premium-sm flex flex-col items-start gap-4">
                        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-premium-sm ring-1 ring-border-soft">
                            <UserCircle className="h-8 w-8 text-primary-dark" />
                        </div>
                        <h2 className="text-2xl font-black text-primary-dark">{t.featuresPage.f3Title}</h2>
                        <p className="text-secondary-text text-[1.05rem] leading-relaxed font-medium">
                            {t.featuresPage.f3Desc}
                        </p>
                    </motion.div>

                    <motion.div {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.5 }} className="neo-card rounded-[28px] border border-border-light bg-white/75 backdrop-blur-sm p-10 shadow-premium-sm flex flex-col items-start gap-4">
                        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-premium-sm ring-1 ring-border-soft">
                            <PenTool className="h-8 w-8 text-primary-dark" />
                        </div>
                        <h2 className="text-2xl font-black text-primary-dark">{t.featuresPage.f4Title}</h2>
                        <p className="text-secondary-text text-[1.05rem] leading-relaxed font-medium">
                            {t.featuresPage.f4Desc}
                        </p>
                    </motion.div>

                </div>
            </section>
        </main>
    )
}
