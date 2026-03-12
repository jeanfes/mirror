import { Card } from "@/components/ui"

export default async function AccountPage() {
    return (
        <div>
            <Card className="p-5">
                <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-500">Current plan</p>
                <p className="mt-2 text-2xl font-bold text-[#141824]">Free</p>
                <p className="mt-2 text-[14px] text-slate-600">No active subscription.</p>
            </Card>
        </div>
    )
}

