"use client";

import { useMemo } from "react";
import { HeroSection } from "@/features/landing/components/HeroSection";
import { HowItWorksSection } from "@/features/landing/components/HowItWorksSection";
import { CTASection } from "@/features/landing/components/CTASection";
import { FeaturesSection } from "@/features/landing/components/FeaturesSection";
import { useLanguageStore } from "@/store/useLanguageStore";
import type { Dictionary } from "@/lib/i18n/types";
import type { Routes } from "@/lib/routes";

interface LandingContentProps {
    initialT: Dictionary;
    routes: Routes;
}

export function LandingContent({ initialT, routes }: LandingContentProps) {
    const liveT = useLanguageStore((state) => state.t);
    const isHydrated = useLanguageStore((state) => state.isHydrated);
    const t = useMemo(() => {
        if (!isHydrated) return initialT;
        return liveT ?? initialT;
    }, [liveT, initialT, isHydrated]);

    return (
        <main className="relative flex flex-col items-center overflow-x-hidden pt-10">
            <HeroSection t={t} routes={routes} />
            <HowItWorksSection t={t} />
            <FeaturesSection t={t} />
            <CTASection t={t} routes={routes} />
        </main>
    );
}