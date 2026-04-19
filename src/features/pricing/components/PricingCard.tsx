"use client"

import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import type { PlanDefinition } from "@/features/billing/services/billing.service";
import { usePlanLocalization } from "@/features/billing/hooks/usePlanLocalization";
import { useHasMounted } from "@/hooks/useHasMounted";

interface PricingCardProps {
    plan: PlanDefinition;
    href: string;
    index: number;
    perMonthText: string;
    popularText?: string;
    buttonText: string;
}

export function PricingCard({ plan, href, perMonthText, popularText, buttonText }: PricingCardProps) {
    const isPro = plan.recommended;
    const hasMounted = useHasMounted();
    const { summary, features } = usePlanLocalization(plan);

    const mutedTextClass = isPro ? "text-primary-text/70" : "text-secondary-text"
    const subtleTextClass = isPro ? "text-primary-text/60" : "text-muted-text"
    const featureClass = "text-primary-text"
    const bulletClass = isPro ? "text-[#8b5cf6]" : "text-[#75cef3]"

    return (
        <div
            className={`${isPro
                ? "relative z-20 flex min-h-115 flex-col overflow-hidden rounded-[28px] border-[1.5px] border-[#75cef3]/40 bg-linear-to-b from-[#75cef3]/10 via-[#8b5cf6]/5 to-transparent p-8 shadow-[0_0_80px_rgba(117,206,243,0.15)] backdrop-blur-xl transition-all duration-300 md:-translate-y-2 md:scale-105"
                : "relative z-10 flex min-h-115 flex-col overflow-hidden rounded-[28px] border border-border-soft bg-surface-card p-8 backdrop-blur-lg transition-all duration-300 hover:-translate-y-1 hover:bg-surface-elevated hover:shadow-premium-md"
                }`}
        >
            {isPro && (
                <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[28px] bg-linear-to-b from-[#75cef3]/5 to-[#8b5cf6]/5" />
            )}

            <div className="relative z-10 flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${isPro ? "bg-linear-to-r from-[#75cef3] to-[#8b5cf6] text-white shadow-md" : "bg-surface-base text-primary-text ring-1 ring-border-soft"
                            }`}>
                            {isPro && popularText ? popularText : plan.name}
                        </div>
                        <p className={`mt-5 text-[13px] font-bold uppercase tracking-widest ${subtleTextClass}`}>{plan.name}</p>
                    </div>
                </div>

                <div className="mt-6 flex items-end gap-2">
                    <p className="text-5xl font-black tracking-[-0.05em] text-primary-text">{plan.price}</p>
                    <p className={`pb-1.5 text-[14px] font-semibold ${mutedTextClass}`}>{perMonthText}</p>
                </div>

                <div className={`mt-5 rounded-2xl p-4 transition-all duration-300 ${isPro ? "bg-surface-elevated/40 shadow-inner ring-1 ring-border-soft/50" : "bg-surface-base ring-1 ring-border-soft"
                    }`}>
                    <p className={`text-[13px] leading-relaxed font-medium ${mutedTextClass}`}>
                        {hasMounted ? summary : "..."}
                    </p>
                </div>

                <ul className="mt-6 space-y-3 mb-10 flex-1">
                    {hasMounted && features.map((feature) => (
                        <li key={feature} className={`flex items-start gap-2.5 text-[13px] leading-5 ${featureClass}`}>
                            <Check className={`mt-0.5 h-4 w-4 shrink-0 ${bulletClass}`} />
                            {feature}
                        </li>
                    ))}
                </ul>

                <div className="mt-auto pt-8">
                    <Link
                        href={href}
                        className={`w-full h-12 rounded-xl text-[14px] font-bold shadow-sm transition-all duration-300 flex items-center justify-center ${isPro
                                ? "bg-primary-text text-text-inverse hover:scale-[1.02] hover:shadow-md"
                                : "bg-surface-elevated text-primary-text ring-1 ring-border-soft hover:bg-surface-hover"
                            }`}
                    >
                        {buttonText}
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
