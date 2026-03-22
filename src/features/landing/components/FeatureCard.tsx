"use client";

import { m } from "motion/react";
import { ReactNode } from "react";

interface FeatureCardProps {
    icon: ReactNode;
    title: string;
    description: string;
    delay: number;
}

export function FeatureCard({ icon, title, description, delay }: FeatureCardProps) {
    const fadeInUp = {
        initial: { opacity: 0, y: 8 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-50px" },
        transition: { duration: 0.25, delay, ease: "easeOut" as const }
    };

    return (
        <m.div {...fadeInUp} className="neo-card rounded-[28px] border border-border-light bg-surface-card backdrop-blur-sm p-10 shadow-premium-sm flex flex-col items-start gap-4">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-elevated shadow-premium-sm ring-1 ring-border-soft">
                {icon}
            </div>
            <h2 className="text-2xl font-black text-primary-dark">{title}</h2>
            <p className="text-secondary-text text-[1.05rem] leading-relaxed font-medium">
                {description}
            </p>
        </m.div>
    );
}
