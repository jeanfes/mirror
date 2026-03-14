"use client"

import { ArrowRight, Check, WandSparkles, Star } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { cn } from "@/lib/utils"
import type { PlanDefinition, PlanName } from "@/features/billing/services/billing.local.service"

interface PlanCardProps {
    plan: PlanDefinition
    currentPlan: PlanName
    isUpdating: boolean
    onSelect: (plan: PlanName) => void
}

export function PlanCard({ plan, currentPlan, isUpdating, onSelect }: PlanCardProps) {
    const isCurrent = currentPlan === plan.name
    const isRecommended = plan.recommended
    const actionLabel = isCurrent ? "Current plan" : currentPlan === "Free" ? `Upgrade to ${plan.name}` : `Switch to ${plan.name}`
    const mutedTextClass = isRecommended ? "text-white/82" : "text-slate-700"
    const subtleTextClass = isRecommended ? "text-white/80" : "text-slate-600"
    const featureClass = isRecommended ? "text-white/88" : "text-slate-700"
    const bulletClass = isRecommended ? "text-[#75cef3]" : "text-success"

    return (
        <Card className={cn("plan-card-surface relative flex min-h-115 flex-col overflow-hidden p-6", isRecommended && "plan-card-surface-recommended")}>
            <div className="relative z-10 flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <div className={cn("plan-card-badge", isRecommended && "plan-card-badge-recommended")}>
                            {isRecommended ? <WandSparkles className="h-3.5 w-3.5" /> : <Star className="h-3.5 w-3.5" />}
                            {isRecommended ? "Recommended" : "Designed for"}
                        </div>
                        <p className={`mt-4 text-[12px] font-semibold uppercase tracking-[0.12em] ${subtleTextClass}`}>{plan.name}</p>
                    </div>
                    {isCurrent ? (
                        <div className={cn("plan-card-badge", isRecommended && "plan-card-badge-recommended")}>
                            Active now
                        </div>
                    ) : null}
                </div>

                <div className="mt-6 flex items-end gap-2">
                    <p className="text-5xl font-black tracking-[-0.05em]">{plan.price}</p>
                    <p className={`pb-1 text-[13px] font-medium ${mutedTextClass}`}>/ month</p>
                </div>

                <div className={cn("plan-card-capacity mt-5", isRecommended && "plan-card-capacity-recommended")}>
                    <p className={`text-[12px] font-semibold uppercase tracking-[0.08em] ${subtleTextClass}`}>Capacity</p>
                    <div className="mt-2 flex items-end justify-between gap-3">
                        <p className="text-2xl font-bold">{plan.credits}</p>
                        <p className={`text-[13px] ${mutedTextClass}`}>credits each month</p>
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
                        className={cn("w-full", isRecommended && "bg-white text-[#141824] hover:bg-white/90")}
                        variant={isCurrent ? "secondary" : "primary"}
                        disabled={isCurrent || isUpdating}
                        onClick={() => onSelect(plan.name)}
                    >
                        {isCurrent ? "Current plan" : isUpdating ? "Updating..." : actionLabel}
                        {!isCurrent && !isUpdating ? <ArrowRight className="h-4 w-4" /> : null}
                    </Button>
                </div>
            </div>
        </Card>
    )
}
