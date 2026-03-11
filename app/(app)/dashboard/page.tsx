import { ArrowRight, Clock3, MessageSquareText, Sparkles, TrendingUp } from "lucide-react"
import { Button, Card } from "@/components/ui"
import { getDashboardHistory, getDashboardOverview } from "@/lib/data-access/dashboard"

export default async function DashboardPage() {
    const [{ stats, account }, { history }] = await Promise.all([
        getDashboardOverview(),
        getDashboardHistory()
    ])
    const latest = history[0]

    return (
        <div className="space-y-4">
            <section className="grid gap-4 xl:grid-cols-[1.25fr_1fr]">
                <Card className="relative overflow-hidden border-[#DEE3EF] p-6">
                    <div className="pointer-events-none absolute -right-14 -top-14 h-32 w-32 rounded-full bg-[#D8D3F4]/60 blur-2xl" />
                    <div className="pointer-events-none absolute -bottom-12 -left-8 h-28 w-28 rounded-full bg-[#F1E8DD]/60 blur-2xl" />

                    <p className="relative text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">Daily mirror</p>
                    <h2 className="relative mt-2 max-w-[28ch] text-[30px] font-bold leading-[1.05] tracking-[-0.03em] text-[#121726]">
                        Keep your communication sharp and consistent every day.
                    </h2>
                    <p className="relative mt-3 max-w-[52ch] text-[14px] leading-relaxed text-slate-600">
                        Review your output, monitor plan usage, and trigger a fresh generation sequence in one focused view.
                    </p>

                    <div className="relative mt-5 flex flex-wrap items-center gap-2.5">
                        <Button variant="primary" size="lg">
                            <Sparkles className="h-4 w-4" />
                            Start New Generation
                        </Button>
                        <Button variant="secondary" size="lg">
                            Open Assistant
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </div>
                </Card>

                <Card className="p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">Latest generation</p>
                    <p className="mt-2 text-[15px] leading-relaxed text-slate-700">{latest?.generatedComment}</p>

                    <div className="mt-4 grid gap-2 text-[12px] text-slate-500">
                        <div className="inline-flex items-center gap-2">
                            <Clock3 className="h-3.5 w-3.5" />
                            <span>{latest ? new Date(latest.timestamp).toLocaleString() : "No recent activity"}</span>
                        </div>
                        <div className="inline-flex items-center gap-2">
                            <MessageSquareText className="h-3.5 w-3.5" />
                            <span>{latest?.goal ?? "No goal selected"}</span>
                        </div>
                    </div>
                </Card>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
                <Card className="p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">Generated this month</p>
                    <p className="mt-2 text-4xl font-bold text-[#141824]">{stats.generatedThisMonth}</p>
                    <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                        <TrendingUp className="h-3.5 w-3.5" />
                        +12% vs last month
                    </div>
                </Card>

                <Card className="p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">Active personas</p>
                    <p className="mt-2 text-4xl font-bold text-[#141824]">{stats.activePersonas}</p>
                    <p className="mt-3 text-[12px] text-slate-500">Ready voices available for generation</p>
                </Card>

                <Card className="p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">Credits remaining</p>
                    <p className="mt-2 text-4xl font-bold text-[#141824]">{account.creditsRemaining}</p>
                    <p className="mt-3 text-[12px] text-slate-500">Current plan: {account.plan}</p>
                </Card>
            </section>

            <section className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
                <Card className="p-5">
                    <div className="flex items-center justify-between gap-2">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">Quick compose</p>
                            <p className="mt-1 text-[16px] font-semibold text-[#141824]">Draft your next reply</p>
                        </div>
                        <Button variant="secondary" size="md">Use template</Button>
                    </div>

                    <div className="mt-4 rounded-2xl border border-[#E6EAF2] bg-white/85 p-3.5">
                        <p className="text-[12px] text-slate-500">What do you want to communicate today?</p>
                        <p className="mt-2 text-[14px] font-medium text-slate-700">Example: Congratulate on the post and ask one thoughtful follow-up question.</p>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                        <Button variant="primary" size="md">
                            <Sparkles className="h-4 w-4" />
                            Generate
                        </Button>
                        <Button variant="secondary" size="md">Save draft</Button>
                    </div>
                </Card>

                <Card className="p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">Focus checklist</p>
                    <div className="mt-3 space-y-2.5 text-[14px] text-slate-700">
                        <div className="rounded-xl border border-[#E6EAF2] bg-white/85 px-3 py-2.5">Review your top persona tone profile</div>
                        <div className="rounded-xl border border-[#E6EAF2] bg-white/85 px-3 py-2.5">Confirm goal before generation</div>
                        <div className="rounded-xl border border-[#E6EAF2] bg-white/85 px-3 py-2.5">Archive weak outputs and keep signal high</div>
                    </div>
                </Card>
            </section>
        </div>
    )
}
