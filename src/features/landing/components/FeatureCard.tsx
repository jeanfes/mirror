import { ReactNode } from "react";

interface FeatureCardProps {
    icon: ReactNode;
    title: string;
    description: string;
    delay: number;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
    return (
        <div className="neo-card rounded-[28px] border border-border-light bg-surface-card backdrop-blur-sm p-10 shadow-premium-sm flex flex-col items-start gap-4">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-elevated shadow-premium-sm ring-1 ring-border-soft">
                {icon}
            </div>
            <h2 className="text-2xl font-black text-primary-dark">{title}</h2>
            <p className="text-secondary-text text-[1.05rem] leading-relaxed font-medium">
                {description}
            </p>
        </div>
    );
}
