"use client"

import { format } from "date-fns"
import { Crown, Gauge, Layers3, Zap } from "lucide-react"
import { toast } from "sonner"
import { LoadingOverlay } from "@/components/ui/Loading"
import { StatePanel } from "@/components/ui/StatePanel"
import { ProgressBar } from "@/components/ui/ProgressBar"
import { PlanCard } from "@/features/billing/components/PlanCard"
import { useAccount } from "@/features/billing/hooks/useAccount"
import { usePlanDefinitions } from "@/features/billing/hooks/usePlanDefinitions"
import { planDefinitions } from "@/features/billing/services/billing.service"
import { useLanguageStore } from "@/store/useLanguageStore"

export default function PlansPage() {
    const { data: account, startCheckout, isMutating, isLoading, isError } = useAccount()
    const { data: fetchedPlanDefinitions } = usePlanDefinitions()
    const resolvedPlanDefinitions = fetchedPlanDefinitions ?? planDefinitions
    const { t } = useLanguageStore()
    const handleSelectPlan = async (planName: "Free" | "Pro") => {
        try {
            const checkoutUrl = await startCheckout(planName)
            window.location.assign(checkoutUrl)
        } catch {
            toast.error(t.app.common.checkoutError)
        }
    }

    if (isLoading || !account) {
        return <LoadingOverlay show={true} />
    }

    if (isError) {
        return (
            <StatePanel
                tone="error"
                title={t.app.common.plansErrorTitle}
                description={t.app.common.plansErrorDesc}
            />
        )
    }

    const resolvedAccount = account!
    const userQuota = resolvedAccount.quota

    const monthlyUsagePercent = userQuota
        ? Math.max(0, Math.min(100, Math.round((resolvedAccount.creditsRemaining / userQuota.monthly_generations) * 100)))
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
                            {t.app.plans.heroTitle}
                        </h1>
                        <p className="mt-4 max-w-xl text-[15px] leading-7 text-secondary-text">
                            {t.app.plans.heroDesc}
                        </p>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <div className="workspace-hero-chip">
                                <Crown className="h-4 w-4 text-primary-text" />
                                {t.app.plans.chip1}
                            </div>
                            <div className="workspace-hero-chip">
                                <Layers3 className="h-4 w-4 text-primary-text" />
                                {t.app.plans.chip2}
                            </div>
                            <div className="workspace-hero-chip">
                                <Zap className="h-4 w-4 text-primary-text" />
                                {t.app.plans.chip3}
                            </div>
                        </div>
                    </div>

                    <div className="dashboard-dark-panel">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-white/60">{t.app.plans.currentSub}</p>
                                <p className="mt-2 text-3xl font-black tracking-[-0.04em] text-white">{resolvedAccount.plan}</p>
                            </div>
                            <div className="rounded-full bg-surface-base/10 px-2.5 py-1 text-[11px] font-semibold text-white/85 ring-1 ring-white/10">
                                {resolvedAccount.renewalDate ? t.app.plans.renewsOn.replace('{0}', format(new Date(resolvedAccount.renewalDate), "MMM d")) : t.app.plans.lifetimeAccess}
                            </div>
                        </div>

                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            <div>
                                <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-white/50">{t.app.plans.creditsLeft}</p>
                                <p className="mt-2 text-3xl font-black tracking-[-0.04em]">{resolvedAccount.creditsRemaining}</p>
                            </div>
                            <div>
                                <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-white/50">{t.app.plans.remainingCapacity}</p>
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
                                    ? t.app.plans.healthyPlanDesc
                                    : t.app.plans.tightPlanWarning}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="space-y-3">
                <div className="flex items-end justify-between gap-3">
                    <div>
                        <h2 className="text-2xl font-bold tracking-[-0.03em] text-primary-text">{t.app.plans.choosePlanTitle}</h2>
                        <p className="mt-1 text-[14px] text-secondary-text">{t.app.plans.choosePlanDesc}</p>
                    </div>
                </div>

                <div className="relative mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-[1fr_1.15fr] md:items-center md:gap-0">
                    <div className="absolute inset-0 top-1/2 -z-10 -translate-y-1/2 w-full h-[300px] bg-[radial-gradient(ellipse,rgba(117,206,243,0.1)_0%,transparent_70%)] rounded-full blur-[60px] pointer-events-none" />
                    {resolvedPlanDefinitions.map((plan) => (
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


        </div>
    )
}

