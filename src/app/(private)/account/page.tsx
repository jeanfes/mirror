"use client"

import { format, formatDistanceToNow } from "date-fns"
import { BarChart3, CreditCard, Layers3 } from "lucide-react"
import dynamic from "next/dynamic"
import { useMemo, useState } from "react"
import { Card } from "@/components/ui/Card"
import { LoadingOverlay, useLoadingDelay } from "@/components/ui/Loading"
import { StatePanel } from "@/components/ui/StatePanel"
import { ProgressBar } from "@/components/ui/ProgressBar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { useAccount } from "@/features/billing/hooks/useAccount"
import { useBilling } from "@/features/billing/hooks/useBilling"
import { planDefinitions } from "@/features/billing/services/billing.service"
import { useHistory } from "@/features/history/hooks/useHistory"
import { useProfiles } from "@/features/profiles/hooks/useProfiles"
import { useLanguageStore } from "@/store/useLanguageStore"

const BillingHistory = dynamic(
  () => import("@/features/billing/components/BillingHistory").then((m) => m.BillingHistory),
  { loading: () => <div className="h-32 animate-pulse rounded-xl bg-surface-subtle" /> }
)
const PaymentMethods = dynamic(
  () => import("@/features/billing/components/PaymentMethods").then((m) => m.PaymentMethods),
  { loading: () => <div className="h-32 animate-pulse rounded-xl bg-surface-subtle" /> }
)

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("overview")

  const { data: account, isLoading: isAccountLoading, isError } = useAccount()

  // ── True lazy loading — only fetch when the tab is actually open ─────────────
  const { invoices, paymentMethods } = useBilling({ enabled: activeTab === "billing" })
  const { data: history } = useHistory(undefined, { enabled: activeTab === "usage" })
  const { data: profiles } = useProfiles({ enabled: activeTab !== "billing" })
  // ─────────────────────────────────────────────────────────────────────────────

  const { t } = useLanguageStore()
  const showLoading = useLoadingDelay(isAccountLoading || !account)

  const stats = useMemo(() => {
    if (!account) return null

    const historyItems = history ?? []
    const profileItems = profiles ?? []
    const activeProfiles = profileItems.filter((p) => p.enabled).length
    const appliedCount = historyItems.filter((i) => i.status === "applied").length
    const reusableCount = historyItems.filter((i) => i.source === "history_reuse").length
    const currentMonth = new Date().getMonth()
    const generatedThisMonth = historyItems.filter(
      (i) => new Date(i.createdAt).getMonth() === currentMonth
    ).length
    const currentPlan = planDefinitions.find((p) => p.name === account.plan)
    const totalCredits = currentPlan?.credits ?? account.creditsRemaining
    const usedCredits = Math.max(totalCredits - account.creditsRemaining, 0)
    const creditUsage = totalCredits > 0 ? Math.min((usedCredits / totalCredits) * 100, 100) : 0
    const latestHistoryItem = historyItems[0]

    return {
      historyItems,
      activeProfiles,
      appliedCount,
      reusableCount,
      generatedThisMonth,
      currentPlan,
      totalCredits,
      usedCredits,
      creditUsage,
      latestHistoryItem,
    }
  }, [account, history, profiles])

  if (showLoading) return <LoadingOverlay show={true} />

  if (isAccountLoading || !account || !stats) {
    if (isError) {
      return (
        <StatePanel
          tone="error"
          title={t.app.common.accountErrorTitle}
          description={t.app.common.accountErrorDesc}
        />
      )
    }
    return null
  }

  const {
    historyItems,
    activeProfiles,
    appliedCount,
    reusableCount,
    generatedThisMonth,
    currentPlan,
    usedCredits,
    creditUsage,
    latestHistoryItem,
  } = stats

  return (
    <div className="space-y-6">
      <section className="workspace-hero-shell">
        <div aria-hidden="true" className="absolute -right-14 top-0 h-44 w-44 rounded-full workspace-hero-orb-purple" />
        <div aria-hidden="true" className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full workspace-hero-orb-cyan" />

        <div className="relative grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div className="max-w-2xl">
            <h1 className="max-w-xl text-4xl font-black tracking-[-0.05em] text-primary-text md:text-5xl">
              {t.app.account.heroTitle}
            </h1>
            <p className="mt-4 max-w-xl text-[15px] leading-7 text-secondary-text">
              {t.app.account.heroDesc}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <div className="workspace-hero-chip">{t.app.account.chip1}</div>
              <div className="workspace-hero-chip">{t.app.account.chip2}</div>
              <div className="workspace-hero-chip">{t.app.account.chip3}</div>
            </div>
          </div>

          <Card className="dashboard-dark-panel">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-white">{account.plan}</h2>
                <p className="mt-2 text-[14px] leading-6 text-white/72">
                  {currentPlan?.summary ?? t.app.account.activePlanDesc}
                </p>
              </div>
              <p className="text-[28px] font-semibold tracking-[-0.04em] text-white">
                {currentPlan?.price ?? "$0"}
              </p>
            </div>

            <div className="dashboard-dark-stat-muted mt-6">
              <div className="flex items-center justify-between gap-3 text-[12px] font-semibold uppercase tracking-widest text-white/58">
                <span>{t.app.account.creditsUsed}</span>
                <span>{Math.round(creditUsage)}%</span>
              </div>
              <ProgressBar
                className="mt-3"
                trackClassName="bg-surface-base/10"
                fillClassName="bg-[linear-gradient(90deg,#8B5CF6,#75CEF3)]"
                value={creditUsage}
              />
              <div className="mt-3 flex items-center justify-between gap-3 text-[13px] text-white/72">
                <span>{usedCredits} {t.app.account.used}</span>
                <span>{account.creditsRemaining} {t.app.account.remaining}</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="dashboard-dark-stat-muted">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/55">{t.app.account.renewal}</p>
                <p className="mt-2 text-[15px] font-semibold text-white">
                  {account.renewalDate ? format(new Date(account.renewalDate), "MMM d, yyyy") : t.app.account.na}
                </p>
              </div>
              <div className="dashboard-dark-stat-muted">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/55">{t.app.account.latestOutput}</p>
                <p className="mt-2 text-[15px] font-semibold text-white">
                  {latestHistoryItem
                    ? formatDistanceToNow(latestHistoryItem.createdAt, { addSuffix: true })
                    : t.app.account.noActivity}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">{t.app.account.tabOverview}</TabsTrigger>
          <TabsTrigger value="usage">{t.app.account.tabUsage}</TabsTrigger>
          <TabsTrigger value="billing">{t.app.billing.title}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="dashboard-card-lg">
              <div className="icon-box icon-bg-purple"><CreditCard className="h-5 w-5" /></div>
              <p className="dashboard-overline mt-4">{t.app.account.currentPlan}</p>
              <p className="mt-2 text-2xl font-bold tracking-[-0.03em] text-primary-text">{account.plan}</p>
              <p className="mt-2 body-muted">
                {t.app.account.renewsOn}{" "}
                {account.renewalDate ? format(new Date(account.renewalDate), "MMM d, yyyy") : t.app.account.na}
              </p>
            </Card>
            <Card className="dashboard-card-lg">
              <div className="icon-box icon-bg-green"><BarChart3 className="h-5 w-5" /></div>
              <p className="dashboard-overline mt-4">{t.app.account.creditsRemainingLabel}</p>
              <p className="mt-2 text-2xl font-bold tracking-[-0.03em] text-primary-text">{account.creditsRemaining}</p>
              <p className="mt-2 body-muted">{t.app.account.creditsAvailableDesc}</p>
            </Card>
            <Card className="dashboard-card-lg">
              <div className="icon-box icon-bg-amber"><Layers3 className="h-5 w-5" /></div>
              <p className="dashboard-overline mt-4">{t.app.account.activeProfilesLabel}</p>
              <p className="mt-2 text-2xl font-bold tracking-[-0.03em] text-primary-text">{activeProfiles}</p>
              <p className="mt-2 body-muted">{t.app.account.activeProfilesDesc}</p>
            </Card>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_360px]">
            <Card className="dashboard-card-xl">
              <p className="dashboard-overline">{t.app.account.planNotes}</p>
              <h3 className="mt-3 section-heading">{currentPlan?.summary ?? t.app.account.planActiveFallback}</h3>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {(currentPlan?.features ?? []).map((feature) => (
                  <div key={feature} className="rounded-3xl border border-border-soft bg-surface-card p-4 text-[14px] font-medium text-secondary-text">
                    {feature}
                  </div>
                ))}
              </div>
            </Card>
            <Card className="dashboard-card-xl">
              <p className="dashboard-overline">{t.app.account.usageBalance}</p>
              <p className="mt-3 section-heading">
                {t.app.account.capacityAvailable.replace("{0}", Math.round(100 - creditUsage).toString())}
              </p>
              <p className="mt-2 body-muted">{t.app.account.capacityDesc}</p>
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
              <p className="dashboard-overline">{t.app.account.generatedThisMonth}</p>
              <p className="mt-2 text-2xl font-bold tracking-[-0.03em] text-primary-text">{generatedThisMonth}</p>
              <p className="mt-2 body-muted">{t.app.account.generatedDesc}</p>
            </Card>
            <Card className="dashboard-card-lg">
              <p className="dashboard-overline">{t.app.account.appliedComments}</p>
              <p className="mt-2 text-2xl font-bold tracking-[-0.03em] text-primary-text">{appliedCount}</p>
              <p className="mt-2 body-muted">{t.app.account.appliedDesc}</p>
            </Card>
            <Card className="dashboard-card-lg">
              <p className="dashboard-overline">{t.app.account.reusedComments}</p>
              <p className="mt-2 text-2xl font-bold tracking-[-0.03em] text-primary-text">{reusableCount}</p>
              <p className="mt-2 body-muted">{t.app.account.reusedDesc}</p>
            </Card>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <Card className="dashboard-card-xl">
              <p className="dashboard-overline">{t.app.account.adoptionSignal}</p>
              <p className="mt-3 section-heading">
                {historyItems.length === 0
                  ? t.app.account.noUsageYet
                  : t.app.account.adoptionMetrix.replace(
                      "{0}",
                      Math.round((appliedCount / historyItems.length) * 100).toString()
                    )}
              </p>
              <p className="mt-2 body-muted">{t.app.account.adoptionDesc}</p>
            </Card>
            <Card className="dashboard-card-xl">
              <p className="dashboard-overline">{t.app.account.recentActivity}</p>
              <p className="mt-3 section-heading">
                {latestHistoryItem ? latestHistoryItem.postAuthor : t.app.account.noArchivedComments}
              </p>
              <p className="mt-2 body-muted">
                {latestHistoryItem
                  ? t.app.account.latestCommentAdded.replace(
                      "{0}",
                      formatDistanceToNow(latestHistoryItem.createdAt, { addSuffix: true })
                    )
                  : t.app.account.generateToSeeMomentum}
              </p>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="billing">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.7fr]">
            <div className="space-y-3 px-1">
              <h3 className="text-lg font-black tracking-tight text-primary-text">{t.app.billing.history}</h3>
              <BillingHistory invoices={invoices} />
            </div>
            <div className="space-y-3 px-1">
              <h3 className="text-lg font-black tracking-tight text-primary-text">{t.app.billing.paymentMethods}</h3>
              <PaymentMethods methods={paymentMethods} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
