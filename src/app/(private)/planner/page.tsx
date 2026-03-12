import { CalendarRange, CheckCircle2 } from "lucide-react"
import { Card } from "@/components/ui"

const tasks = [
    "Review 5 posts from strategic accounts",
    "Generate 3 add-value replies",
    "Publish 1 networking response",
    "Capture one reusable persona example"
]

export default function PlannerPage() {
    return (
        <div>
            <Card className="p-5">
                <div className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                    <CalendarRange className="h-4 w-4" />
                    This week
                </div>
                <ul className="mt-4 space-y-3">
                    {tasks.map((task) => (
                        <li key={task} className="flex items-center gap-2 text-[14px] text-slate-700">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            {task}
                        </li>
                    ))}
                </ul>
            </Card>
        </div>
    )
}
