"use client"

import { format } from "date-fns"
import { Crown, Gauge, Layers3, Zap } from "lucide-react"
import { toast } from "sonner"
import { LoadingOverlay, useLoadingDelay } from "@/components/ui/Loading"
import { StatePanel } from "@/components/ui/StatePanel"
import { ProgressBar } from "@/components/ui/ProgressBar"
import { PlanCard } from "@/features/billing/components/PlanCard"
import { useAccount } from "@/features/billing/hooks/useAccount"
import { planDefinitions } from "@/features/billing/services/billing.service"
import { useLanguageStore } from "@/store/useLanguageStore"

export default function PlansPage() {
    const { data: account, setPlan, isMutating, isLoading, isError } = useAccount()
    const { t } = useLanguageStore()
    const showLoading = useLoadingDelay(isLoading || !account)

    const handleSelectPlan = async (planName: "Free" | "Pro" | "Elite") => {
        try {
            await setPlan(planName)
            toast.success(`Plan updated to ${planName}`)
        } catch {
            toast.error("Could not update plan")
        }
    }

    if (showLoading) {
        return <LoadingOverlay show={true} />
    }

    if (isError || !account) {
        return (
            <StatePanel
                tone="error"
                title={t.app.plansErrorTitle}
                description={t.app.plansErrorDesc}
            />
        )
    }

    const resolvedAccount = account!

    const currentPlanDefinition = planDefinitions.find((plan) => plan.name === resolvedAccount.plan)
    const monthlyUsagePercent = currentPlanDefinition
        ? Math.max(0, Math.min(100, Math.round((resolvedAccount.creditsRemaining / currentPlanDefinition.credits) * 100)))
        : 0

    return (
        <div className="space-y-6">
            <section className="workspace-hero-shell">
                <div aria-hidden="true" className="absolute inset-0 z-0 overflow-hidden">
                    <div className="absolute -right-15 -top-20 h-52 w-52 rounded-full bg-[radial-gradient(circle,rgba(117,206,243,0.2),transparent_72%)]" />
                    <div className="absolute -bottom-16 -left-8 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.12),transparent_70%)]" />
                </div>

                <div className="relative z-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
                    <div className="max-w-2xl">
                        <h1 className="max-w-xl text-4xl font-black tracking-[-0.05em] text-primary-text md:text-5xl">
                            Pick the workspace that matches your posting rhythm.
                        </h1>
                        <p className="mt-4 max-w-xl text-[15px] leading-7 text-secondary-text">
                            Plans should feel like a growth path, not a billing form. Choose the capacity, profile depth and commenting volume that fits how often you publish and engage.
                        </p>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <div className="workspace-hero-chip">
                                <Crown className="h-4 w-4 text-primary-text" />
                                Premium companion feel
                            </div>
                            <div className="workspace-hero-chip">
                                <Layers3 className="h-4 w-4 text-primary-text" />
                                Profiles + history aligned
                            </div>
                            <div className="workspace-hero-chip">
                                <Zap className="h-4 w-4 text-primary-text" />
                                Clear upgrade path
                            </div>
                        </div>
                    </div>

                    <div className="dashboard-dark-panel">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-white/60">Current subscription</p>
                                <p className="mt-2 text-3xl font-black tracking-[-0.04em] text-white">{resolvedAccount.plan}</p>
                            </div>
                            <div className="rounded-full bg-surface-base/10 px-2.5 py-1 text-[11px] font-semibold text-white/85 ring-1 ring-white/10">
                                Renews {format(new Date(resolvedAccount.renewalDate), "MMM d")}
                            </div>
                        </div>

                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            <div>
                                <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-white/50">Credits left</p>
                                <p className="mt-2 text-3xl font-black tracking-[-0.04em]">{resolvedAccount.creditsRemaining}</p>
                            </div>
                            <div>
                                <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-white/50">Remaining capacity</p>
                                <div className="mt-2 flex items-center gap-2">
                                    <Gauge className="h-4 w-4 text-[#75cef3]" />
                                    <p className="text-lg font-bold">{monthlyUsagePercent}%</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-5">
                            <ProgressBar
                                trackClassName="bg-surface-base/10"
                                fillClassName="bg-[linear-gradient(90deg,#75cef3,#8b5cf6)]"
                                value={monthlyUsagePercent}
                            />
                            <p className="mt-3 text-[13px] leading-6 text-white/68">
                                {monthlyUsagePercent > 70
                                    ? "You still have healthy room this cycle, but a higher tier gives you more profile breadth and publishing headroom."
                                    : "Your current plan is getting tighter. A bigger tier gives you more breathing room for frequent posting and testing multiple voices."}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="space-y-3">
                <div className="flex items-end justify-between gap-3">
                    <div>
                        <h2 className="text-2xl font-bold tracking-[-0.03em] text-primary-text">Choose your plan</h2>
                        <p className="mt-1 text-[14px] text-secondary-text">All tiers keep the same product language. What changes is how far you can push it.</p>
                    </div>
                </div>

                <div className="grid gap-4 xl:grid-cols-3">
                    {planDefinitions.map((plan) => (
                        <PlanCard
                            key={plan.name}
                            plan={plan}
                            currentPlan={resolvedAccount.plan}
                            isUpdating={isMutating}
                            onSelect={handleSelectPlan}
                        />
                    ))}
                </div>
            </section>

            <section className="rounded-[28px] border border-border-soft bg-surface-base p-5 shadow-premium-sm md:p-6">
                <div className="grid gap-4 md:grid-cols-4">
                    <div>
                        <p className="dashboard-overline">Signal</p>
                        <p className="mt-2 text-[15px] font-semibold text-primary-text">Profile depth</p>
                        <p className="mt-2 text-[13px] leading-6 text-secondary-text">Run one focused voice or several strategic personas depending on your plan.</p>
                    </div>
                    <div>
                        <p className="dashboard-overline">Throughput</p>
                        <p className="mt-2 text-[15px] font-semibold text-primary-text">Monthly generation headroom</p>
                        <p className="mt-2 text-[13px] leading-6 text-secondary-text">Higher tiers reduce friction when you comment daily or experiment more often.</p>
                    </div>
                    <div>
                        <p className="dashboard-overline">Workflow</p>
                        <p className="mt-2 text-[15px] font-semibold text-primary-text">History and reuse</p>
                        <p className="mt-2 text-[13px] leading-6 text-secondary-text">Stronger plans make sense when you rely on iteration, reuse and multiple comment directions.</p>
                    </div>
                    <div>
                        <p className="dashboard-overline">Decision</p>
                        <p className="mt-2 text-[15px] font-semibold text-primary-text">Upgrade when speed matters</p>
                        <p className="mt-2 text-[13px] leading-6 text-secondary-text">If the extension becomes part of your weekly publishing habit, optimize for continuity rather than scarcity.</p>
                    </div>
                </div>
            </section>
        </div>
    )
}

