import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

interface PricingCardProps {
    plan: {
        readonly name: string;
        readonly desc: string;
        readonly price: string;
        readonly features: readonly string[];
        readonly buttonText: string;
        readonly popular?: boolean;
    };
    readonly href: string;
    readonly index: number;
    readonly perMonthText: string;
    readonly popularText?: string;
}

export function PricingCard({ plan, href, perMonthText, popularText }: PricingCardProps) {
    const isPro = plan.popular;

    return (
        <div
            className={`${isPro 
                ? "neo-shell relative flex flex-col border border-[#2e313d] bg-[#141824] p-10 shadow-[0_0_80px_rgba(139,92,246,0.1)] md:scale-110 z-20 rounded-[32px]" 
                : "neo-card relative flex flex-col rounded-[32px] md:rounded-r-none md:border-r-0 border border-[#2e313d] bg-[#1a1d27]/80 backdrop-blur-xl p-10 md:pr-14 shadow-premium-sm"
            }`}
        >
            {isPro && (
                <div className="absolute inset-0 bg-gradient-to-b from-[#75cef3]/5 to-[#8b5cf6]/5 pointer-events-none rounded-[32px] overflow-hidden" />
            )}
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
                    className={`${isPro ? "bg-white !text-[#141824] shadow-premium-sm" : "neo-btn-muted"} inline-block text-center py-3.5 text-[0.95rem] font-bold w-full rounded-xl transition-all duration-200 hover:opacity-90`}
                >
                    {plan.buttonText}
                </Link>
            </div>
        </div>
    );
}
