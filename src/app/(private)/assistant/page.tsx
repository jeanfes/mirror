import Link from "next/link"
import { Bot, CalendarDays, Layers3, Users } from "lucide-react"
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
        description: "Align tone and strategy across profiles, so your communication stays coherent.",
        tag: "Collaborate"
    },
    {
        icon: CalendarDays,
        title: "Plan priorities clearly",
        description: "Organize engagement flow, monitor activity, and focus on outcomes that matter.",
        tag: "Planning"
    }
]

export default function AssistantPage() {
    return (
        <div>
            <div className="px-2 pb-6 pt-8 md:px-6 md:pt-12">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">From first idea to published reply</p>
                <h1 className="text-4xl font-bold leading-[1.05] text-[#141824] md:text-6xl">
                    Build thoughtful comments faster with a focused workspace.
                </h1>
                <p className="mt-4 text-[15px] leading-relaxed text-slate-600">
                    Mirror helps you compose better responses, keep your voice consistent, and move from draft to action without context switching.
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-2.5">
                    <Link href="/planner">
                        <Button size="lg">
                            <Bot className="h-4 w-4" />
                            Open planner
                        </Button>
                    </Link>
                    <Link href="/team">
                        <Button variant="secondary" size="lg">Open team space</Button>
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
                            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Ready for your next action?</p>
                            <p className="mt-1 text-[14px] text-slate-600">Continue with profiles, review your history, or organize your week in planner.</p>
                        </div>
                        <div className="flex gap-2">
                            <Link href="/profiles">
                                <Button variant="secondary">Open profiles</Button>
                            </Link>
                            <Link href="/history">
                                <Button>
                                    <Bot className="h-4 w-4" />
                                    Open history
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}
