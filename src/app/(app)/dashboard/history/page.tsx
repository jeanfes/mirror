import { getDashboardHistory } from "@/lib/data-access/dashboard"
import { Card } from "@/components/ui"

export default async function HistoryPage() {
    const { history } = await getDashboardHistory()

    return (
        <div>
            <div className="space-y-3">
                {history.map((item) => (
                    <Card key={item.id} className="p-5">
                        <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-500">{item.postAuthor}</p>
                        <p className="mt-2 text-[14px] text-slate-600">{item.postSnippet}</p>
                        <p className="mt-3 text-[15px] font-medium text-[#1A1D26]">{item.generatedComment}</p>
                    </Card>
                ))}
            </div>
        </div>
    )
}
