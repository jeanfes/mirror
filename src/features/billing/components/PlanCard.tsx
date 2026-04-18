"use client"

import { ArrowRight, Check, WandSparkles, Star } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { cn } from "@/lib/utils"
import type { PlanDefinition, PlanName } from "@/features/billing/services/billing.service"
import { useLanguageStore } from "@/store/useLanguageStore"

interface PlanCardProps {
    plan: PlanDefinition
    currentPlan: PlanName
    isUpdating: boolean
    onSelect: (plan: PlanName) => void
}

export function PlanCard({ plan, currentPlan, isUpdating, onSelect }: PlanCardProps) {
    const { t } = useLanguageStore()
    const isCurrent = currentPlan === plan.name
    const isRecommended = plan.recommended

    const actionLabel = isCurrent 
        ? t.app.plans.currentPlan 
        : currentPlan === "Free" 
            ? t.app.plans.upgradeTo.replace("{0}", plan.name) 
            : t.app.plans.switchTo.replace("{0}", plan.name)

    const mutedTextClass = isRecommended ? "text-white/82" : "text-slate-700"
    const subtleTextClass = isRecommended ? "text-white/80" : "text-slate-600"
    const featureClass = isRecommended ? "text-white/88" : "text-slate-700"
    const bulletClass = isRecommended ? "text-[#75cef3]" : "text-success"

    return (
        <Card className={cn(
            "plan-card-surface relative flex min-h-115 flex-col overflow-hidden p-8 transition-all duration-300", 
            isRecommended 
                ? "plan-card-surface-recommended md:scale-110 z-20 shadow-[0_0_80px_rgba(117,206,243,0.15)] ring-1 ring-[#75cef3]/30" 
                : "z-10 md:rounded-r-none md:border-r-0 md:opacity-90 hover:opacity-100"
        )}>
            {isRecommended && (
                <div className="absolute inset-0 bg-gradient-to-b from-[#75cef3]/5 to-[#8b5cf6]/5 pointer-events-none" />
            )}
            <div className="relative z-10 flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <div className={cn("plan-card-badge", isRecommended && "plan-card-badge-recommended")}>
                            {isRecommended ? <WandSparkles className="h-3.5 w-3.5" /> : <Star className="h-3.5 w-3.5" />}
                            {isRecommended ? t.app.plans.recommended : t.app.plans.designedFor}
                        </div>
                        <p className={`mt-4 text-[12px] font-semibold uppercase tracking-[0.12em] ${subtleTextClass}`}>{plan.name}</p>
                    </div>
                    {isCurrent ? (
                        <div className={cn("plan-card-badge", isRecommended && "plan-card-badge-recommended")}>
                            {t.app.plans.activeNow}
                        </div>
                    ) : null}
                </div>

                <div className="mt-6 flex items-end gap-2">
                    <p className="text-5xl font-black tracking-[-0.05em]">{plan.price}</p>
                    <p className={`pb-1 text-[13px] font-medium ${mutedTextClass}`}>{t.app.plans.perMonth}</p>
                </div>

                <div className={cn("plan-card-capacity mt-5", isRecommended && "plan-card-capacity-recommended")}>
                    <p className={`text-[12px] font-semibold uppercase tracking-[0.08em] ${subtleTextClass}`}>{t.app.plans.capacity}</p>
                    <div className="mt-2 flex items-end justify-between gap-3">
                        <p className="text-2xl font-bold">{plan.credits}</p>
                        <p className={`text-[13px] ${mutedTextClass}`}>{t.app.plans.creditsPerMonth}</p>
                    </div>
                </div>

                <p className={`mt-5 text-[14px] leading-6 ${mutedTextClass}`}>{plan.summary}</p>

                <ul className="mt-6 space-y-3">
                    {plan.features.map((feature) => (
                        <li key={feature} className={`flex items-start gap-2.5 text-[13px] leading-5 ${featureClass}`}>
                            <Check className={`mt-0.5 h-4 w-4 shrink-0 ${bulletClass}`} />
                            {feature}
                        </li>
                    ))}
                </ul>

                <div className="mt-auto pt-6">
                    <Button
                        className={cn("w-full", isRecommended && "bg-white !text-[#141824] hover:bg-white/90")}
                        variant={isCurrent ? "secondary" : "primary"}
                        disabled={isCurrent || isUpdating}
                        onClick={() => onSelect(plan.name)}
                    >
                        {isCurrent ? t.app.plans.currentPlan : isUpdating ? t.app.plans.updating : actionLabel}
                        {!isCurrent && !isUpdating ? <ArrowRight className="h-4 w-4" /> : null}
                    </Button>
                </div>
            </div>
        </Card>
    )
}
