import Link from "next/link";
import { ArrowRight, WandSparkles, MessageSquareText } from "lucide-react";

import { Routes } from "@/lib/routes";
import { Dictionary } from "@/lib/i18n";

interface HeroSectionProps {
    t: Dictionary;
    routes: Routes;
}

export function HeroSection({ t, routes }: HeroSectionProps) {
    return (
        <section className="relative w-full max-w-6xl px-6 pt-24 pb-20 text-center md:pt-40 md:pb-32 z-10">
            <div className="absolute top-24 left-10 hidden lg:block md:block">
                <div className="neo-shell flex h-18 w-18 items-center justify-center rounded-2xl shadow-premium-md">
                    <MessageSquareText className="h-9 w-9 text-primary-dark/70" />
                </div>
            </div>
            <div className="absolute top-44 right-10 hidden lg:block md:block -translate-y-4">
                <div className="neo-shell flex h-16 w-16 items-center justify-center rounded-2xl shadow-premium-md">
                    <WandSparkles className="h-8 w-8 text-primary-dark/70" />
                </div>
            </div>

            <div className="mx-auto max-w-3xl space-y-7">
                <h1
                    className="text-5xl font-black tracking-tighter text-primary-dark sm:text-6xl md:text-[5rem] leading-[1.1]"
                >
                    {t.hero.title1} <br className="hidden md:block" /> {t.hero.title2} <span className="text-mirror font-extrabold pb-2">{t.hero.titleSpan}</span>
                </h1>
                <p
                    className="mx-auto max-w-2xl text-[1.125rem] text-secondary-text md:text-[1.25rem] leading-relaxed font-medium"
                >
                    {t.hero.subtitle}
                </p>

                <div
                    className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <div>
                        <Link
                            href={routes.auth.register}
                            className="neo-btn-primary group flex h-14 items-center gap-2 px-9 text-[1.05rem] font-bold shadow-premium-md"
                        >
                            {t.hero.ctaPrimary}
                            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                    <div>
                        <Link
                            href={routes.auth.login}
                            className="neo-btn-muted flex h-14 items-center px-9 text-[1.05rem] font-bold shadow-premium-sm"
                        >
                            {t.hero.ctaSecondary}
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
