"use client"

import { format } from "date-fns"
import { Crown, Gauge, Layers3, Sparkles, Stars, Zap } from "lucide-react"
import { toast } from "sonner"
import { Card } from "@/components/ui/Card"
import { PlanCard } from "@/features/billing/components/PlanCard"
import { useAccount } from "@/features/billing/hooks/useAccount"
import { planDefinitions } from "@/features/billing/services/billing.local.service"

export default function PlansPage() {
    const { data: account, setPlan, isUpdatingPlan, isLoading } = useAccount()

    const handleSelectPlan = async (planName: "Free" | "Pro" | "Elite") => {
        try {
            await setPlan(planName)
            toast.success(`Plan updated to ${planName}`)
        } catch {
            toast.error("Could not update plan")
        }
    }

    if (isLoading || !account) {
        return (
            <Card className="p-5">
                <p className="text-[14px] text-slate-500">Loading plans...</p>
            </Card>
        )
    }

    const currentPlanDefinition = planDefinitions.find((plan) => plan.name === account.plan)
    const monthlyUsagePercent = currentPlanDefinition
        ? Math.max(0, Math.min(100, Math.round((account.creditsRemaining / currentPlanDefinition.credits) * 100)))
        : 0

    return (
        <div className="space-y-6">
            <section className="relative overflow-hidden rounded-4xl border border-[#E8ECF4] bg-[linear-gradient(135deg,rgba(255,255,255,0.88),rgba(214,210,240,0.36)_42%,rgba(117,206,243,0.22)_100%)] p-6 shadow-premium-md md:p-8">
                <div aria-hidden="true" className="absolute -right-15 -top-20 h-52 w-52 rounded-full bg-[radial-gradient(circle,rgba(117,206,243,0.35),transparent_72%)]" />
                <div aria-hidden="true" className="absolute -bottom-16 -left-8 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.2),transparent_70%)]" />

                <div className="relative grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-700 backdrop-blur-sm">
                            <Sparkles className="h-3.5 w-3.5 text-[#8B5CF6]" />
                            Capacity planning for Mirror
                        </div>
                        <h1 className="mt-4 max-w-xl text-4xl font-black tracking-[-0.05em] text-[#141824] md:text-5xl">
                            Pick the workspace that matches your posting rhythm.
                        </h1>
                        <p className="mt-4 max-w-xl text-[15px] leading-7 text-slate-600">
                            Plans should feel like a growth path, not a billing form. Choose the capacity, profile depth and commenting volume that fits how often you publish and engage.
                        </p>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <div className="inline-flex items-center gap-2 rounded-2xl border border-white/80 bg-white/80 px-4 py-3 text-[13px] font-medium text-slate-700 shadow-premium-sm">
                                <Crown className="h-4 w-4 text-[#141824]" />
                                Premium companion feel
                            </div>
                            <div className="inline-flex items-center gap-2 rounded-2xl border border-white/80 bg-white/80 px-4 py-3 text-[13px] font-medium text-slate-700 shadow-premium-sm">
                                <Layers3 className="h-4 w-4 text-[#141824]" />
                                Profiles + history aligned
                            </div>
                            <div className="inline-flex items-center gap-2 rounded-2xl border border-white/80 bg-white/80 px-4 py-3 text-[13px] font-medium text-slate-700 shadow-premium-sm">
                                <Zap className="h-4 w-4 text-[#141824]" />
                                Clear upgrade path
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[28px] border border-[#E8ECF4] bg-[linear-gradient(180deg,rgba(23,27,45,0.98),rgba(23,27,45,0.92))] p-5 text-white shadow-[0_18px_50px_rgba(15,19,32,0.16)]">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-white/60">Current subscription</p>
                                <p className="mt-2 text-3xl font-black tracking-[-0.04em] text-white">{account.plan}</p>
                            </div>
                            <div className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white/85 ring-1 ring-white/10">
                                Renews {format(new Date(account.renewalDate), "MMM d")}
                            </div>
                        </div>

                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            <div>
                                <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-white/50">Credits left</p>
                                <p className="mt-2 text-3xl font-black tracking-[-0.04em]">{account.creditsRemaining}</p>
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
                            <div className="h-2 rounded-full bg-white/10">
                                <div
                                    className="h-2 rounded-full bg-[linear-gradient(90deg,#75cef3,#8b5cf6)]"
                                    style={{ width: `${monthlyUsagePercent}%` }}
                                />
                            </div>
                            <p className="mt-3 text-[13px] leading-6 text-white/68">
                                {monthlyUsagePercent > 70
                                    ? "You still have healthy room this cycle, but a higher tier gives you more profile breadth and publishing headroom."
                                    : "Your current plan is getting tighter. A bigger tier gives you more breathing room for frequent posting and testing multiple voices."}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
                <Card className="rounded-3xl p-5">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-500">Best for</p>
                    <p className="mt-2 text-lg font-bold text-[#141824]">Different growth stages</p>
                    <p className="mt-2 text-[14px] leading-6 text-slate-600">From testing one voice to running several posting angles at the same time.</p>
                </Card>
                <Card className="rounded-3xl p-5">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-500">Upgrade logic</p>
                    <p className="mt-2 text-lg font-bold text-[#141824]">Capacity before friction</p>
                    <p className="mt-2 text-[14px] leading-6 text-slate-600">Move up when you want more monthly attempts, more profiles and less hesitation in daily use.</p>
                </Card>
                <Card className="rounded-3xl p-5">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-500">Visual principle</p>
                    <p className="mt-2 text-lg font-bold text-[#141824]">Pricing as product surface</p>
                    <p className="mt-2 text-[14px] leading-6 text-slate-600">This should feel like part of the workspace, not a detached billing screen.</p>
                </Card>
            </section>

            <section className="space-y-3">
                <div className="flex items-end justify-between gap-3">
                    <div>
                        <h2 className="text-2xl font-bold tracking-[-0.03em] text-[#141824]">Choose your plan</h2>
                        <p className="mt-1 text-[14px] text-slate-600">All tiers keep the same product language. What changes is how far you can push it.</p>
                    </div>
                    <div className="hidden rounded-full border border-[#E8ECF4] bg-white/70 px-3 py-1.5 text-[12px] font-semibold text-slate-600 md:inline-flex md:items-center md:gap-1.5">
                        <Stars className="h-3.5 w-3.5 text-[#8B5CF6]" />
                        Pro is tuned as the default sweet spot
                    </div>
                </div>

                <div className="grid gap-4 xl:grid-cols-3">
                    {planDefinitions.map((plan) => (
                        <PlanCard
                            key={plan.name}
                            plan={plan}
                            currentPlan={account.plan}
                            isUpdating={isUpdatingPlan}
                            onSelect={handleSelectPlan}
                        />
                    ))}
                </div>
            </section>

            <section className="rounded-[28px] border border-[#E8ECF4] bg-white/70 p-5 shadow-premium-sm md:p-6">
                <div className="grid gap-4 md:grid-cols-4">
                    <div>
                        <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-500">Signal</p>
                        <p className="mt-2 text-[15px] font-semibold text-[#141824]">Profile depth</p>
                        <p className="mt-2 text-[13px] leading-6 text-slate-600">Run one focused voice or several strategic personas depending on your plan.</p>
                    </div>
                    <div>
                        <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-500">Throughput</p>
                        <p className="mt-2 text-[15px] font-semibold text-[#141824]">Monthly generation headroom</p>
                        <p className="mt-2 text-[13px] leading-6 text-slate-600">Higher tiers reduce friction when you comment daily or experiment more often.</p>
                    </div>
                    <div>
                        <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-500">Workflow</p>
                        <p className="mt-2 text-[15px] font-semibold text-[#141824]">History and reuse</p>
                        <p className="mt-2 text-[13px] leading-6 text-slate-600">Stronger plans make sense when you rely on iteration, reuse and multiple comment directions.</p>
                    </div>
                    <div>
                        <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-500">Decision</p>
                        <p className="mt-2 text-[15px] font-semibold text-[#141824]">Upgrade when speed matters</p>
                        <p className="mt-2 text-[13px] leading-6 text-slate-600">If the extension becomes part of your weekly publishing habit, optimize for continuity rather than scarcity.</p>
                    </div>
                </div>
            </section>
        </div>
    )
}
