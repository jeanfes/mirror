"use client";

import { useMemo } from "react";
import { Zap, Users, PenTool, Brain } from "lucide-react";
import { FeatureCard } from "@/features/landing/components/FeatureCard";
import { useLanguageStore } from "@/store/useLanguageStore";
import type { Dictionary } from "@/lib/i18n/types";

interface FeaturesContentProps {
    initialT: Dictionary;
}

export function FeaturesContent({ initialT }: FeaturesContentProps) {
    const liveT = useLanguageStore((state) => state.t);
    const isHydrated = useLanguageStore((state) => state.isHydrated);
    
    const t = useMemo(() => {
        if (!isHydrated) return initialT;
        return liveT ?? initialT;
    }, [liveT, initialT, isHydrated]);

    return (
        <main className="relative flex flex-col items-center overflow-x-hidden pt-10 pb-20">
            <section className="w-full max-w-5xl px-6 pt-20 pb-16 text-center z-10">
                <h1 className="text-5xl font-black tracking-tighter text-primary-dark sm:text-6xl md:text-[4.5rem] leading-[1.1] mb-6">
                    <span className="text-mirror pb-2 font-extrabold">{t.featuresPage.title1}</span> {t.featuresPage.titleSpan}
                </h1>
                <p className="mx-auto max-w-2xl text-[1.125rem] text-secondary-text md:text-[1.25rem] font-medium leading-relaxed">
                    {t.featuresPage.subtitle}
                </p>
            </section>

            <section className="w-full max-w-5xl px-6 py-12">
                <div className="grid gap-12 sm:grid-cols-2">
                    <FeatureCard
                        icon={<Zap className="h-8 w-8 text-primary-dark" />}
                        title={t.featuresPage.f1Title}
                        description={t.featuresPage.f1Desc}
                        delay={0.2}
                    />
                    <FeatureCard
                        icon={<Brain className="h-8 w-8 text-primary-dark" />}
                        title={t.featuresPage.f2Title}
                        description={t.featuresPage.f2Desc}
                        delay={0.3}
                    />
                    <FeatureCard
                        icon={<Users className="h-8 w-8 text-primary-dark" />}
                        title={t.featuresPage.f3Title}
                        description={t.featuresPage.f3Desc}
                        delay={0.4}
                    />
                    <FeatureCard
                        icon={<PenTool className="h-8 w-8 text-primary-dark" />}
                        title={t.featuresPage.f4Title}
                        description={t.featuresPage.f4Desc}
                        delay={0.5}
                    />
                </div>
            </section>
        </main>
    );
}
