"use client";

import { m } from "motion/react";
import Link from "next/link";
import { ArrowRight, WandSparkles, MessageSquareText } from "lucide-react";

import { Dictionary } from "@/types/i18n";
import { Routes } from "@/lib/routes";

interface HeroSectionProps {
    t: Dictionary;
    routes: Routes;
}

export function HeroSection({ t, routes }: HeroSectionProps) {
    const float = {
        animate: { y: [0, -12, 0] },
        transition: { duration: 5, repeat: Infinity, ease: "easeInOut" as const }
    };

    return (
        <section className="relative w-full max-w-6xl px-6 pt-24 pb-20 text-center md:pt-40 md:pb-32 z-10">
            <m.div {...float} className="absolute top-24 left-10 hidden lg:block md:block">
                <div className="neo-shell flex h-18 w-18 items-center justify-center rounded-2xl shadow-premium-md">
                    <MessageSquareText className="h-9 w-9 text-primary-dark/70" />
                </div>
            </m.div>
            <m.div {...float} transition={{ ...float.transition, delay: 0.5 }} className="absolute top-44 right-10 hidden lg:block md:block -translate-y-4">
                <div className="neo-shell flex h-16 w-16 items-center justify-center rounded-2xl shadow-premium-md">
                    <WandSparkles className="h-8 w-8 text-primary-dark/70" />
                </div>
            </m.div>

            <div className="mx-auto max-w-3xl space-y-7">
                <m.h1
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="text-5xl font-black tracking-tighter text-primary-dark sm:text-6xl md:text-[5rem] leading-[1.1]"
                >
                    {t.hero.title1} <br className="hidden md:block" /> {t.hero.title2} <span className="text-mirror font-extrabold pb-2">{t.hero.titleSpan}</span>
                </m.h1>
                <m.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: 0.03, ease: "easeOut" }}
                    className="mx-auto max-w-2xl text-[1.125rem] text-secondary-text md:text-[1.25rem] leading-relaxed font-medium"
                >
                    {t.hero.subtitle}
                </m.p>

                <m.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: 0.06, ease: "easeOut" }}
                    className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <m.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link
                            href={routes.auth.register}
                            className="neo-btn-primary group flex h-14 items-center gap-2 px-9 text-[1.05rem] font-bold shadow-premium-md"
                        >
                            {t.hero.ctaPrimary}
                            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </m.div>
                    <m.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link
                            href={routes.auth.login}
                            className="neo-btn-muted flex h-14 items-center px-9 text-[1.05rem] font-bold shadow-premium-sm"
                        >
                            {t.hero.ctaSecondary}
                        </Link>
                    </m.div>
                </m.div>
            </div>
        </section>
    );
}
