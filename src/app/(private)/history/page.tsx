import { Card } from "@/components/ui"

export default async function HistoryPage() {
    return (
        <div>
            <div className="space-y-3">
                <Card className="p-5">
                    <p className="text-[14px] text-slate-500">No history yet.</p>
                </Card>
            </div>
        </div>
    )
}

