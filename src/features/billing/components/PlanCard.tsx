"use client"

import { ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { cn } from "@/lib/utils"
import type { PlanDefinition, PlanName } from "@/features/billing/services/billing.service"
import { useLanguageStore } from "@/store/useLanguageStore"
import { usePlanLocalization } from "@/features/billing/hooks/usePlanLocalization"
import { useHasMounted } from "@/hooks/useHasMounted"

interface PlanCardProps {
    plan: PlanDefinition
    currentPlan: PlanName
    isUpdating: boolean
    onSelect: (plan: PlanName) => void
}

export function PlanCard({ plan, currentPlan, isUpdating, onSelect }: PlanCardProps) {
    const { t } = useLanguageStore()
    const hasMounted = useHasMounted()
    const isCurrent = currentPlan === plan.name
    const isRecommended = plan.recommended

    const actionLabel = isCurrent
        ? t.app.plans.currentPlan
        : currentPlan === "Free"
            ? t.app.plans.upgradeTo.replace("{0}", plan.name)
            : currentPlan === "Pro" && plan.name === "Free"
                ? t.app.plans.planBase
                : t.app.plans.switchTo.replace("{0}", plan.name)

    const mutedTextClass = isRecommended ? "text-primary-text/70" : "text-secondary-text"
    const subtleTextClass = isRecommended ? "text-primary-text/60" : "text-muted-text"
    const featureClass = "text-primary-text"
    const bulletClass = isRecommended ? "text-[#8b5cf6]" : "text-[#75cef3]"

    const { summary: localizedSummary, features: localizedFeatures } = usePlanLocalization(plan)

    return (
        <Card className={cn(
            "relative flex min-h-115 flex-col overflow-hidden rounded-[28px] p-8 transition-all duration-300",
            isRecommended
                ? "z-20 border-[1.5px] border-[#75cef3]/40 bg-linear-to-b from-[#75cef3]/10 via-[#8b5cf6]/5 to-transparent shadow-[0_0_80px_rgba(117,206,243,0.15)] backdrop-blur-xl md:-translate-y-2 md:scale-105"
                : "z-10 border border-border-soft bg-surface-card hover:bg-surface-elevated hover:shadow-premium-md hover:-translate-y-1 backdrop-blur-lg"
        )}>
            {isRecommended && (
                <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-[#75cef3]/5 to-[#8b5cf6]/5" />
            )}
            <div className="relative z-10 flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className={`mt-5 text-[13px] font-bold uppercase tracking-widest ${subtleTextClass}`}>{plan.name}</p>
                    </div>
                    {isCurrent ? (
                        <div className="inline-flex items-center rounded-full bg-surface-base px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-text ring-1 ring-border-soft">
                            {t.app.plans.activeNow}
                        </div>
                    ) : null}
                </div>

                <div className="mt-6 flex items-end gap-2">
                    <p className="text-5xl font-black tracking-[-0.05em] text-primary-text">{plan.price}</p>
                    <p className={`pb-1.5 text-[14px] font-semibold ${mutedTextClass}`}>{t.app.plans.perMonth}</p>
                </div>

                <div className={cn(
                    "mt-5 rounded-2xl p-4 transition-all duration-300",
                    isRecommended ? "bg-surface-elevated/40 shadow-inner ring-1 ring-border-soft/50" : "bg-surface-base ring-1 ring-border-soft"
                )}>
                    <p className={`text-[11px] font-bold uppercase tracking-[0.12em] ${subtleTextClass}`}>{t.app.plans.capacity}</p>
                    <div className="mt-2 flex items-end justify-between gap-3">
                        <p className="text-xl font-bold text-primary-text">{plan.credits}</p>
                        <p className={`text-[13px] font-medium ${mutedTextClass}`}>{t.app.plans.creditsPerMonth}</p>
                    </div>
                </div>

                <p className={`mt-5 text-[14px] leading-6 ${mutedTextClass}`}>
                    {hasMounted ? localizedSummary : "..."}
                </p>

                <ul className="mt-6 space-y-3">
                    {hasMounted && localizedFeatures.map((feature) => (
                        <li key={feature} className={`flex items-start gap-2.5 text-[13px] leading-5 ${featureClass}`}>
                            <Check className={`mt-0.5 h-4 w-4 shrink-0 ${bulletClass}`} />
                            {feature}
                        </li>
                    ))}
                </ul>

                <div className="mt-auto pt-8">
                    <Button
                        className={cn(
                            "w-full h-12 rounded-xl text-[14px] font-bold shadow-sm transition-all duration-300",
                            isRecommended
                                ? "bg-primary-text text-text-inverse hover:scale-[1.02] hover:shadow-md"
                                : "bg-surface-elevated text-primary-text ring-1 ring-border-soft hover:bg-surface-hover"
                        )}
                        variant={isCurrent ? "secondary" : "primary"}
                        disabled={isCurrent}
                        loading={isUpdating}
                        onClick={() => onSelect(plan.name)}
                    >
                        {isCurrent ? t.app.plans.currentPlan : actionLabel}
                        {!isCurrent && <ArrowRight className="h-4 w-4" />}
                    </Button>
                </div>
            </div>
        </Card>
    )
}
