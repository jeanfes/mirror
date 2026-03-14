"use client"

import { ArrowRight, Check, Sparkles, Stars } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import type { PlanDefinition, PlanName } from "@/features/billing/services/billing.local.service"

interface PlanCardProps {
    plan: PlanDefinition
    currentPlan: PlanName
    isUpdating: boolean
    onSelect: (plan: PlanName) => void
}

export function PlanCard({ plan, currentPlan, isUpdating, onSelect }: PlanCardProps) {
    const isCurrent = currentPlan === plan.name
    const actionLabel = isCurrent ? "Current plan" : currentPlan === "Free" ? `Upgrade to ${plan.name}` : `Switch to ${plan.name}`
    const surfaceClass = plan.recommended
        ? "border-brand-dark bg-[linear-gradient(180deg,rgba(23,27,45,0.98),rgba(23,27,45,0.9))] text-white shadow-[0_18px_50px_rgba(15,19,32,0.18)]"
        : "border-border-soft bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(255,255,255,0.82))] text-primary-text"
    const mutedTextClass = plan.recommended ? "text-white/82" : "text-slate-700"
    const subtleTextClass = plan.recommended ? "text-white/80" : "text-slate-600"
    const featureClass = plan.recommended ? "text-white/88" : "text-slate-700"
    const bulletClass = plan.recommended ? "text-[#75cef3]" : "text-success"
    const badgeClass = plan.recommended
        ? "bg-white/12 text-white ring-1 ring-white/15"
        : "bg-white text-slate-700 ring-1 ring-border-soft"

    return (
        <Card className={`relative flex min-h-115 flex-col overflow-hidden rounded-[26px] border p-6 ${surfaceClass}`}>
            <div
                aria-hidden="true"
                className={plan.recommended
                    ? "absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(117,206,243,0.28),transparent_68%)]"
                    : "absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.14),transparent_72%)]"}
            />

            <div className="relative flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <div className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${badgeClass}`}>
                            {plan.recommended ? <Sparkles className="h-3.5 w-3.5" /> : <Stars className="h-3.5 w-3.5" />}
                            {plan.recommended ? "Recommended" : "Designed for"}
                        </div>
                        <p className={`mt-4 text-[12px] font-semibold uppercase tracking-[0.12em] ${subtleTextClass}`}>{plan.name}</p>
                    </div>
                    {isCurrent ? (
                        <div className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${badgeClass}`}>
                            Active now
                        </div>
                    ) : null}
                </div>

                <div className="mt-6 flex items-end gap-2">
                    <p className="text-5xl font-black tracking-[-0.05em]">{plan.price}</p>
                    <p className={`pb-1 text-[13px] font-medium ${mutedTextClass}`}>/ month</p>
                </div>

                <div className="mt-5 rounded-[20px] border border-white/20 bg-white/12 px-4 py-3 backdrop-blur-sm">
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
                        className={`w-full ${plan.recommended ? "bg-white text-[#141824] hover:bg-white/90" : ""}`}
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
