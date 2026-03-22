"use client";

import { m } from "motion/react";
import Link from "next/link";
import { Rocket } from "lucide-react";

import { Dictionary } from "@/types/i18n";
import { Routes } from "@/lib/routes";

interface CTASectionProps {
    t: Dictionary;
    routes: Routes;
}

export function CTASection({ t, routes }: CTASectionProps) {
    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-100px" },
        transition: { duration: 0.5, ease: "easeOut" as const }
    };

    return (
        <section className="w-full max-w-5xl px-6 pb-40 relative z-10">
            <m.div {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.1 }} className="neo-shell relative overflow-hidden rounded-[2.5rem] p-12 text-center shadow-premium-md sm:p-20 border-border-soft group hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-500">
                <div className="absolute inset-0 bg-linear-to-br from-(--hero-surface-start) via-(--hero-surface-mid) to-(--hero-surface-end) transition-opacity group-hover:opacity-80" />
                <div className="relative z-10 space-y-8">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.25rem] bg-surface-elevated text-primary-dark shadow-sm ring-1 ring-border-soft transition-transform hover:scale-110 duration-300">
                        <Rocket className="h-10 w-10 text-primary-dark" strokeWidth={2} />
                    </div>
                    <h2 className="text-4xl font-black tracking-tight text-primary-dark sm:text-5xl text-balance">
                        {t.cta.title}
                    </h2>
                    <p className="mx-auto max-w-2xl text-secondary-text text-[1.1rem] text-balance font-medium">
                        {t.cta.subtitle}
                    </p>
                    <div className="pt-4 flex justify-center">
                        <m.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link href={routes.auth.register} className="neo-btn-primary inline-flex h-14 items-center px-10 text-[1.05rem] font-bold shadow-premium-md transition-transform hover:scale-105 active:scale-95">
                                {t.cta.button}
                            </Link>
                        </m.div>
                    </div>
                </div>
            </m.div>
        </section>
    );
}
