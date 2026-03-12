import { Card } from "@/components/ui"

export default function AnalyticsPage() {
    return (
        <div>
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="p-5">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-500">Applied rate</p>
                    <p className="mt-2 text-4xl font-bold text-[#141824]">68%</p>
                </Card>
                <Card className="p-5">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-500">Best goal</p>
                    <p className="mt-2 text-2xl font-bold text-[#141824]">Add Value</p>
                </Card>
                <Card className="p-5">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-500">Weekly streak</p>
                    <p className="mt-2 text-4xl font-bold text-[#141824]">5 days</p>
                </Card>
            </div>
        </div>
    )
}
