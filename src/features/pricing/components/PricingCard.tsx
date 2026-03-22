import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

interface PricingCardProps {
    plan: {
        name: string;
        desc: string;
        price: string;
        features: string[];
        buttonText: string;
        popular?: boolean;
    };
    href: string;
    index: number;
    perMonthText: string;
    popularText?: string;
}

export function PricingCard({ plan, href, perMonthText, popularText }: PricingCardProps) {
    const isPro = plan.popular;

    return (
        <div
            className={`${isPro 
                ? "neo-shell relative flex flex-col border border-border-soft bg-surface-overlay p-8 shadow-premium-md md:scale-105 z-20 rounded-[22px]" 
                : "neo-card flex flex-col rounded-[22px] border border-border-light bg-surface-card backdrop-blur-sm p-8 shadow-premium-sm"
            }`}
        >
            {isPro && popularText && (
                <div className="absolute top-0 right-8 -translate-y-1/2 rounded-full bg-brand-dark px-3.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-white shadow-premium-sm">
                    {popularText}
                </div>
            )}
            <div className="mb-6">
                <h2 className="text-xl font-black text-primary-dark uppercase tracking-tight">{plan.name}</h2>
                <p className={`${isPro ? "text-primary-dark/70" : "text-secondary-text"} text-sm font-medium mt-1.5`}>{plan.desc}</p>
            </div>
            <div className="mb-8 flex items-baseline gap-1.5">
                <span className="text-4xl font-black text-primary-dark">{plan.price}</span>
                <span className={`${isPro ? "text-primary-dark/70" : "text-secondary-text"} text-sm font-bold uppercase tracking-wider`}>{perMonthText}</span>
            </div>
            <ul className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-[0.95rem] text-primary-dark font-medium leading-tight">
                        <CheckCircle2 className={`h-4.5 w-4.5 shrink-0 mt-0.5 ${isPro ? "text-accent-blue" : "text-primary-light"}`} />
                        {feature}
                    </li>
                ))}
            </ul>
            <div>
                <Link 
                    href={href} 
                    className={`${isPro ? "neo-btn-primary shadow-premium-sm" : "neo-btn-muted"} inline-block text-center py-3.5 text-[0.95rem] font-bold w-full rounded-xl`}
                >
                    {plan.buttonText}
                </Link>
            </div>
        </div>
    );
}
