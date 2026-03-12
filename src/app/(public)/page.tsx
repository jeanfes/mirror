import Link from "next/link"
import { Bot, CalendarDays, CircleDot, Grid2X2, History, Layers3, Plus, Search, Sparkles, Users } from "lucide-react"
import { Button, Card } from "@/components/ui"

const featureCards = [
    {
        icon: Layers3,
        title: "Contribute ideas and feedback",
        description: "Capture your authentic point of view and turn it into repeatable, high-quality comments.",
        tag: "Fast Start"
    },
    {
        icon: Users,
        title: "Stay connected with your team",
        description: "Align tone and strategy across personas, so your communication stays coherent.",
        tag: "Collaborate"
    },
    {
        icon: CalendarDays,
        title: "Plan priorities clearly",
        description: "Organize engagement flow, monitor activity, and focus on outcomes that matter.",
        tag: "Planning"
    }
]

export default function LandingPage() {
    return (
        <div className="min-h-screen">
            <div className="grid md:grid-cols-[auto_1fr]">
                <aside className="w-min p-3 flex min-h-[calc(100vh-4.5rem)] flex-col items-center justify-between py-5">
                    <div className="space-y-2">
                        <button type="button" className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#171b2d] text-white">
                            <Plus className="h-5 w-5" />
                        </button>
                        <button type="button" className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#E2E7F1] bg-white text-slate-500">
                            <Search className="h-5 w-5" />
                        </button>
                        <button type="button" className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#E2E7F1] bg-white text-slate-500">
                            <CircleDot className="h-5 w-5" />
                        </button>
                        <button type="button" className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#E2E7F1] bg-white text-slate-500">
                            <Grid2X2 className="h-5 w-5" />
                        </button>
                        <button type="button" className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#E2E7F1] bg-white text-slate-500">
                            <History className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black text-[14px] font-bold text-white">
                        N
                    </div>
                </aside>

                <div className="neo-panel min-h-[calc(100vh-4.5rem)] p-4 md:p-6">
                    <header className="flex items-center justify-between rounded-2xl border border-white/80 bg-white/70 px-4 py-3 backdrop-blur">
                        <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-700">
                            <Sparkles className="h-4 w-4" />
                            Assistant v2.6
                        </div>
                        <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-500">Daily Nixtio</div>
                        <Link href="/login">
                            <Button size="md">Upgrade</Button>
                        </Link>
                    </header>

                    <main className="px-2 pb-6 pt-8 md:px-6 md:pt-12">
                        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">From first idea to published reply</p>
                        <h1 className="text-4xl font-bold leading-[1.05] text-[#141824] md:text-6xl">
                            Build thoughtful comments faster with a focused workspace.
                        </h1>
                        <p className="mt-4 text-[15px] leading-relaxed text-slate-600">
                            Mirror helps you compose better responses, keep your voice consistent, and move from draft to action without context switching.
                        </p>

                        <div className="mt-5 flex flex-wrap items-center gap-2.5">
                            <Link href="/register">
                                <Button size="lg">
                                    <Bot className="h-4 w-4" />
                                    Create workspace
                                </Button>
                            </Link>
                            <Link href="/login">
                                <Button variant="secondary" size="lg">I already have an account</Button>
                            </Link>
                        </div>

                        <div className="mt-8 grid gap-4 md:grid-cols-3">
                            {featureCards.map((card) => (
                                <Card key={card.title} className="min-h-57.5 p-5">
                                    <card.icon className="h-6 w-6 text-[#1A1D26]" />
                                    <h2 className="mt-4 text-2xl font-semibold text-[#141824]">{card.title}</h2>
                                    <p className="mt-2 text-[14px] leading-relaxed text-slate-600">{card.description}</p>
                                    <p className="mt-5 text-[12px] font-semibold text-slate-500">{card.tag}</p>
                                </Card>
                            ))}
                        </div>

                        <Card className="mt-8 p-4">
                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Ready to enter your control center?</p>
                                    <p className="mt-1 text-[14px] text-slate-600">Sign in to continue where you left off or create an account to start with your first persona.</p>
                                </div>
                                <div className="flex gap-2">
                                    <Link href="/register">
                                        <Button variant="secondary">Create account</Button>
                                    </Link>
                                    <Link href="/login">
                                        <Button>
                                            <Bot className="h-4 w-4" />
                                            Open dashboard
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </Card>
                    </main>
                </div>
            </div>
        </div>
    )
}
