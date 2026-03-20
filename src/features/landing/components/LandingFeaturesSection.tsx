"use client";

import { motion } from "motion/react";
import { Bot, Layers, Fingerprint } from "lucide-react";

import { Dictionary } from "@/types/i18n";

interface LandingFeaturesSectionProps {
    t: Dictionary;
}

export function LandingFeaturesSection({ t }: LandingFeaturesSectionProps) {
    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-100px" },
        transition: { duration: 0.5, ease: "easeOut" as const }
    };

    const staggerContainer = {
        initial: {},
        whileInView: {
            transition: {
                staggerChildren: 0.1
            }
        },
        viewport: { once: true }
    };

    return (
        <section id="features" className="w-full py-24 pb-32 relative z-10">
            <div className="mx-auto max-w-6xl px-6">
                <motion.div {...fadeInUp} className="mb-16 text-center space-y-4">
                    <h2 className="text-3xl font-black tracking-tight text-primary-dark sm:text-5xl">{t.features.title}</h2>
                    <p className="mx-auto max-w-2xl text-secondary-text text-[1.1rem] font-medium">{t.features.subtitle}</p>
                </motion.div>

                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="whileInView"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 gap-8 md:grid-cols-3"
                >
                    <motion.div variants={fadeInUp} className="neo-card relative overflow-visible rounded-[18px] border border-border-light bg-surface-card backdrop-blur-sm p-10 shadow-premium-sm group transition-all duration-300 hover:-translate-y-2 hover:shadow-premium-md">
                        <div className="absolute -inset-0.5 bg-linear-to-br from-border-soft to-transparent rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                        <div className="mb-8 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-elevated text-primary-dark shadow-sm ring-1 ring-border-soft transition-transform duration-300 group-hover:scale-110">
                            <Bot className="h-7 w-7" strokeWidth={2} />
                        </div>
                        <h3 className="mb-3 text-[1.35rem] font-black tracking-tight text-primary-dark">{t.features.f1Title}</h3>
                        <p className="text-secondary-text text-[1rem] leading-relaxed font-medium">
                            {t.features.f1Desc}
                        </p>
                    </motion.div>

                    <motion.div variants={fadeInUp} className="neo-card relative overflow-visible rounded-[18px] border border-border-light bg-surface-card backdrop-blur-sm p-10 shadow-premium-sm group transition-all duration-300 hover:-translate-y-2 hover:shadow-premium-md">
                        <div className="absolute -inset-0.5 bg-linear-to-br from-border-soft to-transparent rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                        <div className="mb-8 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-elevated text-primary-dark shadow-sm ring-1 ring-border-soft transition-transform duration-300 group-hover:scale-110">
                            <Layers className="h-7 w-7" strokeWidth={2} />
                        </div>
                        <h3 className="mb-3 text-[1.35rem] font-black tracking-tight text-primary-dark">{t.features.f2Title}</h3>
                        <p className="text-secondary-text text-[1rem] leading-relaxed font-medium">
                            {t.features.f2Desc}
                        </p>
                    </motion.div>

                    <motion.div variants={fadeInUp} className="neo-card relative overflow-visible rounded-[18px] border border-border-light bg-surface-card backdrop-blur-sm p-10 shadow-premium-sm group transition-all duration-300 hover:-translate-y-2 hover:shadow-premium-md">
                        <div className="absolute -inset-0.5 bg-linear-to-br from-border-soft to-transparent rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                        <div className="mb-8 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-elevated text-primary-dark shadow-sm ring-1 ring-border-soft transition-transform duration-300 group-hover:scale-110">
                            <Fingerprint className="h-7 w-7" strokeWidth={2} />
                        </div>
                        <h3 className="mb-3 text-[1.35rem] font-black tracking-tight text-primary-dark">{t.features.f3Title}</h3>
                        <p className="text-secondary-text text-[1rem] leading-relaxed font-medium">
                            {t.features.f3Desc}
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
