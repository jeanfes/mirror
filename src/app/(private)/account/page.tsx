"use client"

import { format, formatDistanceToNow } from "date-fns"
import { BarChart3, CreditCard, Layers3 } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { LoadingOverlay, useLoadingDelay } from "@/components/ui/Loading"
import { StatePanel } from "@/components/ui/StatePanel"
import { ProgressBar } from "@/components/ui/ProgressBar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { useAccount } from "@/features/billing/hooks/useAccount"
import { useBilling } from "@/features/billing/hooks/useBilling"
import { planDefinitions } from "@/features/billing/services/billing.service"
import { BillingHistory } from "@/features/billing/components/BillingHistory"
import { PaymentMethods } from "@/features/billing/components/PaymentMethods"
import { useHistory } from "@/features/history/hooks/useHistory"
import { useProfiles } from "@/features/profiles/hooks/useProfiles"
import { useLanguageStore } from "@/store/useLanguageStore"

export default function AccountPage() {
    const { data: account, isLoading: isAccountLoading, isError } = useAccount()
    const { invoices, paymentMethods } = useBilling()
    const { data: history } = useHistory()
    const { data: profiles } = useProfiles()
    const { t } = useLanguageStore()
    const showLoading = useLoadingDelay(isAccountLoading || !account)

    if (showLoading) {
        return <LoadingOverlay show={true} />
    }

    if (isError || !account) {
        return (
            <StatePanel
                tone="error"
                title={t.app.accountErrorTitle}
                description={t.app.accountErrorDesc}
            />
        )
    }

    const resolvedAccount = account!

    const historyItems = history ?? []
    const profileItems = profiles ?? []
    const activeProfiles = profileItems.filter((profile) => profile.enabled).length
    const appliedCount = historyItems.filter((item) => item.status === "applied").length
    const reusableCount = historyItems.filter((item) => item.source === "history_reuse").length
    const currentMonth = new Date().getMonth()
    const generatedThisMonth = historyItems.filter((item) => new Date(item.createdAt).getMonth() === currentMonth).length
    const currentPlan = planDefinitions.find((plan) => plan.name === resolvedAccount.plan)
    const totalCredits = currentPlan?.credits ?? resolvedAccount.creditsRemaining
    const usedCredits = Math.max(totalCredits - resolvedAccount.creditsRemaining, 0)
    const creditUsage = totalCredits > 0 ? Math.min((usedCredits / totalCredits) * 100, 100) : 0
    const latestHistoryItem = historyItems[0]

    return (
        <div className="space-y-6">
            <section className="workspace-hero-shell">
                <div aria-hidden="true" className="absolute -right-14 top-0 h-44 w-44 rounded-full workspace-hero-orb-purple" />
                <div aria-hidden="true" className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full workspace-hero-orb-cyan" />

                <div className="relative grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
                    <div className="max-w-2xl">
                        <h1 className="max-w-xl text-4xl font-black tracking-[-0.05em] text-primary-text md:text-5xl">
                            A cleaner view of plan, capacity and how the extension is actually being used.
                        </h1>
                        <p className="mt-4 max-w-xl text-[15px] leading-7 text-secondary-text">
                            Account should feel like an operating summary: how much room you have left, what plan you are on and whether the workflow is converting into real outputs.
                        </p>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <div className="workspace-hero-chip">Billing footprint</div>
                            <div className="workspace-hero-chip">Usage health</div>
                            <div className="workspace-hero-chip">Profile coverage</div>
                        </div>
                    </div>

                    <Card className="dashboard-dark-panel">
                        <div className="flex items-end justify-between gap-4">
                            <div>
                                <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-white">{resolvedAccount.plan}</h2>
                                <p className="mt-2 text-[14px] leading-6 text-white/72">{currentPlan?.summary ?? "Your active plan for the current workspace."}</p>
                            </div>
                            <p className="text-[28px] font-semibold tracking-[-0.04em] text-white">{currentPlan?.price ?? "$0"}</p>
                        </div>

                        <div className="dashboard-dark-stat-muted mt-6">
                            <div className="flex items-center justify-between gap-3 text-[12px] font-semibold uppercase tracking-widest text-white/58">
                                <span>Credits used</span>
                                <span>{Math.round(creditUsage)}%</span>
                            </div>
                            <ProgressBar
                                className="mt-3"
                                trackClassName="bg-surface-base/10"
                                fillClassName="bg-[linear-gradient(90deg,#8B5CF6,#75CEF3)]"
                                value={creditUsage}
                            />
                            <div className="mt-3 flex items-center justify-between gap-3 text-[13px] text-white/72">
                                <span>{usedCredits} used</span>
                                <span>{resolvedAccount.creditsRemaining} remaining</span>
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <div className="dashboard-dark-stat-muted">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/55">Renewal</p>
                                <p className="mt-2 text-[15px] font-semibold text-white">{resolvedAccount.renewalDate ? format(new Date(resolvedAccount.renewalDate), "MMM d, yyyy") : "N/A"}</p>
                            </div>
                            <div className="dashboard-dark-stat-muted">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/55">Latest output</p>
                                <p className="mt-2 text-[15px] font-semibold text-white">{latestHistoryItem ? formatDistanceToNow(latestHistoryItem.createdAt, { addSuffix: true }) : "No activity"}</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </section>

            <Tabs defaultValue="overview">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="usage">Usage</TabsTrigger>
                    <TabsTrigger value="billing">{t.billing.title}</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card className="dashboard-card-lg">
                            <div className="icon-box icon-bg-purple">
                                <CreditCard className="h-5 w-5" />
                            </div>
                            <p className="dashboard-overline mt-4">Current plan</p>
                            <p className="mt-2 text-2xl font-bold tracking-[-0.03em] text-primary-text">{resolvedAccount.plan}</p>
                            <p className="mt-2 body-muted">Renews on {resolvedAccount.renewalDate ? format(new Date(resolvedAccount.renewalDate), "MMM d, yyyy") : "N/A"}</p>
                        </Card>

                        <Card className="dashboard-card-lg">
                            <div className="icon-box icon-bg-green">
                                <BarChart3 className="h-5 w-5" />
                            </div>
                            <p className="dashboard-overline mt-4">Credits remaining</p>
                            <p className="mt-2 text-2xl font-bold tracking-[-0.03em] text-primary-text">{resolvedAccount.creditsRemaining}</p>
                            <p className="mt-2 body-muted">Available for new generations in the current billing cycle.</p>
                        </Card>

                        <Card className="dashboard-card-lg">
                            <div className="icon-box icon-bg-amber">
                                <Layers3 className="h-5 w-5" />
                            </div>
                            <p className="dashboard-overline mt-4">Active profiles</p>
                            <p className="mt-2 text-2xl font-bold tracking-[-0.03em] text-primary-text">{activeProfiles}</p>
                            <p className="mt-2 body-muted">Profiles currently available to the extension.</p>
                        </Card>
                    </div>

                    <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_360px]">
                        <Card className="dashboard-card-xl">
                            <p className="dashboard-overline">Plan notes</p>
                            <h3 className="mt-3 section-heading">{currentPlan?.summary ?? "Your current plan is active."}</h3>
                            <div className="mt-5 grid gap-3 sm:grid-cols-3">
                                {(currentPlan?.features ?? []).map((feature) => (
                                    <div key={feature} className="rounded-3xl border border-border-soft bg-surface-card p-4 text-[14px] font-medium text-secondary-text">
                                        {feature}
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <Card className="dashboard-card-xl">
                            <p className="dashboard-overline">Usage balance</p>
                            <p className="mt-3 section-heading">{Math.round(100 - creditUsage)}% capacity still available</p>
                            <p className="mt-2 body-muted">A quick signal for whether the current plan still fits the posting rhythm you are building.</p>

                            <ProgressBar
                                className="mt-5"
                                trackClassName="bg-surface-subtle"
                                fillClassName="bg-[linear-gradient(90deg,#8B5CF6,#75CEF3)]"
                                minFillPercent={6}
                                value={100 - creditUsage}
                            />
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="usage">
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card className="dashboard-card-lg">
                            <p className="dashboard-overline">Generated this month</p>
                            <p className="mt-2 text-2xl font-bold tracking-[-0.03em] text-primary-text">{generatedThisMonth}</p>
                            <p className="mt-2 body-muted">All generated comments stored in your local MVP workspace.</p>
                        </Card>

                        <Card className="dashboard-card-lg">
                            <p className="dashboard-overline">Applied comments</p>
                            <p className="mt-2 text-2xl font-bold tracking-[-0.03em] text-primary-text">{appliedCount}</p>
                            <p className="mt-2 body-muted">Comments already marked as posted or used.</p>
                        </Card>

                        <Card className="dashboard-card-lg">
                            <p className="dashboard-overline">Reused comments</p>
                            <p className="mt-2 text-2xl font-bold tracking-[-0.03em] text-primary-text">{reusableCount}</p>
                            <p className="mt-2 body-muted">History items duplicated from previous high-performing outputs.</p>
                        </Card>
                    </div>

                    <div className="mt-4 grid gap-4 lg:grid-cols-2">
                        <Card className="dashboard-card-xl">
                            <p className="dashboard-overline">Adoption signal</p>
                            <p className="mt-3 section-heading">{historyItems.length === 0 ? "No usage yet" : `${Math.round((appliedCount / historyItems.length) * 100)}% of archived comments were applied`}</p>
                            <p className="mt-2 body-muted">This helps frame whether the generation flow is creating outputs that are useful enough to actually post.</p>
                        </Card>

                        <Card className="dashboard-card-xl">
                            <p className="dashboard-overline">Recent activity</p>
                            <p className="mt-3 section-heading">{latestHistoryItem ? latestHistoryItem.postAuthor : "No archived comments yet"}</p>
                            <p className="mt-2 body-muted">{latestHistoryItem ? `Latest generated comment was added ${formatDistanceToNow(latestHistoryItem.createdAt, { addSuffix: true })}.` : "Generate a few comments and this section will start showing momentum."}</p>
                        </Card>
                    </div>
                </TabsContent>
                <TabsContent value="billing">
                    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.7fr]">
                        <div className="space-y-6">
                            <div className="space-y-3 px-1">
                                <h3 className="text-lg font-black tracking-tight text-primary-text">{t.billing.history}</h3>
                                <BillingHistory invoices={invoices} />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-3 px-1">
                                <h3 className="text-lg font-black tracking-tight text-primary-text">{t.billing.paymentMethods}</h3>
                                <PaymentMethods methods={paymentMethods} />
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}

