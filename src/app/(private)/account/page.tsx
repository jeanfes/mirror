"use client"

import { format, formatDistanceToNow } from "date-fns"
import { BarChart3, CreditCard, Layers3, Sparkles } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { useAccount } from "@/features/billing/hooks/useAccount"
import { planDefinitions } from "@/features/billing/services/billing.local.service"
import { useHistory } from "@/features/history/hooks/useHistory"
import { useProfiles } from "@/features/profiles/hooks/useProfiles"

export default function AccountPage() {
    const { data: account, isLoading: isAccountLoading } = useAccount()
    const { data: history } = useHistory()
    const { data: profiles } = useProfiles()

    if (isAccountLoading || !account) {
        return (
            <Card className="rounded-[28px] p-5">
                <p className="text-[14px] text-slate-500">Loading account...</p>
            </Card>
        )
    }

    const historyItems = history ?? []
    const profileItems = profiles ?? []
    const activeProfiles = profileItems.filter((profile) => profile.enabled).length
    const appliedCount = historyItems.filter((item) => item.applied).length
    const reusableCount = historyItems.filter((item) => item.source === "history_reuse").length
    const currentMonth = new Date().getMonth()
    const generatedThisMonth = historyItems.filter((item) => new Date(item.timestamp).getMonth() === currentMonth).length
    const currentPlan = planDefinitions.find((plan) => plan.name === account.plan)
    const totalCredits = currentPlan?.credits ?? account.creditsRemaining
    const usedCredits = Math.max(totalCredits - account.creditsRemaining, 0)
    const creditUsage = totalCredits > 0 ? Math.min((usedCredits / totalCredits) * 100, 100) : 0
    const latestHistoryItem = historyItems[0]

    return (
        <div className="space-y-6">
            <section className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_380px]">
                <Card elevated className="overflow-hidden border-white/70 p-6 md:p-7">
                    <div className="relative">
                        <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(117,206,243,0.22),transparent_68%)] blur-2xl" />
                        <div className="absolute left-16 top-12 h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.18),transparent_68%)] blur-2xl" />

                        <div className="relative max-w-3xl">
                            <span className="inline-flex items-center gap-2 rounded-full border border-[#E9DDFE] bg-[#F7F1FF] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6D28D9]">
                                <Sparkles className="h-3.5 w-3.5" />
                                Workspace status
                            </span>
                            <h1 className="mt-4 max-w-2xl text-[34px] font-semibold leading-[1.05] tracking-[-0.04em] text-[#141824] md:text-[42px]">
                                A cleaner view of plan, capacity and how the extension is actually being used.
                            </h1>
                            <p className="mt-4 max-w-2xl text-[15px] leading-7 text-slate-600">
                                Account should feel like an operating summary: how much room you have left, what plan you are on and whether the workflow is converting into real outputs.
                            </p>

                            <div className="mt-6 flex flex-wrap gap-2 text-[12px] font-semibold text-slate-600">
                                <span className="rounded-full border border-[#E6EAF2] bg-white px-3 py-1.5">Billing footprint</span>
                                <span className="rounded-full border border-[#E6EAF2] bg-white px-3 py-1.5">Usage health</span>
                                <span className="rounded-full border border-[#E6EAF2] bg-white px-3 py-1.5">Profile coverage</span>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="rounded-4xl border-[#171B2D] bg-[#171B2D] p-6 text-white shadow-[0_28px_80px_rgba(15,23,42,0.22)]">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/72">
                        <CreditCard className="h-3.5 w-3.5" />
                        Current subscription
                    </span>
                    <div className="mt-4 flex items-end justify-between gap-4">
                        <div>
                            <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-white">{account.plan}</h2>
                            <p className="mt-2 text-[14px] leading-6 text-white/72">{currentPlan?.summary ?? "Your active plan for the current workspace."}</p>
                        </div>
                        <p className="text-[28px] font-semibold tracking-[-0.04em] text-white">{currentPlan?.price ?? "$0"}</p>
                    </div>

                    <div className="mt-6 rounded-3xl border border-white/10 bg-white/6 p-4">
                        <div className="flex items-center justify-between gap-3 text-[12px] font-semibold uppercase tracking-widest text-white/58">
                            <span>Credits used</span>
                            <span>{Math.round(creditUsage)}%</span>
                        </div>
                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                            <div className="h-full rounded-full bg-[linear-gradient(90deg,#8B5CF6,#75CEF3)]" style={{ width: `${creditUsage}%` }} />
                        </div>
                        <div className="mt-3 flex items-center justify-between gap-3 text-[13px] text-white/72">
                            <span>{usedCredits} used</span>
                            <span>{account.creditsRemaining} remaining</span>
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="rounded-3xl border border-white/10 bg-white/6 p-4">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/55">Renewal</p>
                            <p className="mt-2 text-[15px] font-semibold text-white">{format(new Date(account.renewalDate), "MMM d, yyyy")}</p>
                        </div>
                        <div className="rounded-3xl border border-white/10 bg-white/6 p-4">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/55">Latest output</p>
                            <p className="mt-2 text-[15px] font-semibold text-white">{latestHistoryItem ? formatDistanceToNow(latestHistoryItem.timestamp, { addSuffix: true }) : "No activity"}</p>
                        </div>
                    </div>
                </Card>
            </section>

            <Tabs defaultValue="overview">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="usage">Usage</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card className="rounded-[28px] p-5">
                            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(139,92,246,0.14),rgba(117,206,243,0.14))] text-[#141824]">
                                <CreditCard className="h-5 w-5" />
                            </div>
                            <p className="mt-4 text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-500">Current plan</p>
                            <p className="mt-2 text-2xl font-bold tracking-[-0.03em] text-[#141824]">{account.plan}</p>
                            <p className="mt-2 text-[14px] leading-6 text-slate-600">Renews on {format(new Date(account.renewalDate), "MMM d, yyyy")}</p>
                        </Card>

                        <Card className="rounded-[28px] p-5">
                            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(16,185,129,0.14),rgba(125,211,252,0.14))] text-[#141824]">
                                <BarChart3 className="h-5 w-5" />
                            </div>
                            <p className="mt-4 text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-500">Credits remaining</p>
                            <p className="mt-2 text-2xl font-bold tracking-[-0.03em] text-[#141824]">{account.creditsRemaining}</p>
                            <p className="mt-2 text-[14px] leading-6 text-slate-600">Available for new generations in the current billing cycle.</p>
                        </Card>

                        <Card className="rounded-[28px] p-5">
                            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(251,191,36,0.18),rgba(248,250,252,0.2))] text-[#141824]">
                                <Layers3 className="h-5 w-5" />
                            </div>
                            <p className="mt-4 text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-500">Active profiles</p>
                            <p className="mt-2 text-2xl font-bold tracking-[-0.03em] text-[#141824]">{activeProfiles}</p>
                            <p className="mt-2 text-[14px] leading-6 text-slate-600">Profiles currently available to the extension.</p>
                        </Card>
                    </div>

                    <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_360px]">
                        <Card className="rounded-4xl p-6">
                            <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-500">Plan notes</p>
                            <h3 className="mt-3 text-[24px] font-semibold tracking-[-0.03em] text-[#141824]">{currentPlan?.summary ?? "Your current plan is active."}</h3>
                            <div className="mt-5 grid gap-3 sm:grid-cols-3">
                                {(currentPlan?.features ?? []).map((feature) => (
                                    <div key={feature} className="rounded-3xl border border-[#E8ECF4] bg-white/75 p-4 text-[14px] font-medium text-slate-700">
                                        {feature}
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <Card className="rounded-4xl p-6">
                            <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-500">Usage balance</p>
                            <p className="mt-3 text-[24px] font-semibold tracking-[-0.03em] text-[#141824]">{Math.round(100 - creditUsage)}% capacity still available</p>
                            <p className="mt-2 text-[14px] leading-6 text-slate-600">A quick signal for whether the current plan still fits the posting rhythm you are building.</p>

                            <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#E8ECF4]">
                                <div className="h-full rounded-full bg-[linear-gradient(90deg,#8B5CF6,#75CEF3)]" style={{ width: `${Math.max(100 - creditUsage, 6)}%` }} />
                            </div>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="usage">
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card className="rounded-[28px] p-5">
                            <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-500">Generated this month</p>
                            <p className="mt-2 text-2xl font-bold tracking-[-0.03em] text-[#141824]">{generatedThisMonth}</p>
                            <p className="mt-2 text-[14px] leading-6 text-slate-600">All generated comments stored in your local MVP workspace.</p>
                        </Card>

                        <Card className="rounded-[28px] p-5">
                            <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-500">Applied comments</p>
                            <p className="mt-2 text-2xl font-bold tracking-[-0.03em] text-[#141824]">{appliedCount}</p>
                            <p className="mt-2 text-[14px] leading-6 text-slate-600">Comments already marked as posted or used.</p>
                        </Card>

                        <Card className="rounded-[28px] p-5">
                            <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-500">Reused comments</p>
                            <p className="mt-2 text-2xl font-bold tracking-[-0.03em] text-[#141824]">{reusableCount}</p>
                            <p className="mt-2 text-[14px] leading-6 text-slate-600">History items duplicated from previous high-performing outputs.</p>
                        </Card>
                    </div>

                    <div className="mt-4 grid gap-4 lg:grid-cols-2">
                        <Card className="rounded-4xl p-6">
                            <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-500">Adoption signal</p>
                            <p className="mt-3 text-[24px] font-semibold tracking-[-0.03em] text-[#141824]">{historyItems.length === 0 ? "No usage yet" : `${Math.round((appliedCount / historyItems.length) * 100)}% of archived comments were applied`}</p>
                            <p className="mt-2 text-[14px] leading-6 text-slate-600">This helps frame whether the generation flow is creating outputs that are useful enough to actually post.</p>
                        </Card>

                        <Card className="rounded-4xl p-6">
                            <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-500">Recent activity</p>
                            <p className="mt-3 text-[24px] font-semibold tracking-[-0.03em] text-[#141824]">{latestHistoryItem ? latestHistoryItem.postAuthor : "No archived comments yet"}</p>
                            <p className="mt-2 text-[14px] leading-6 text-slate-600">{latestHistoryItem ? `Latest generated comment was added ${formatDistanceToNow(latestHistoryItem.timestamp, { addSuffix: true })}.` : "Generate a few comments and this section will start showing momentum."}</p>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}

