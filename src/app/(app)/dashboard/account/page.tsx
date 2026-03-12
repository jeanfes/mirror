import { getDashboardAccount } from "@/lib/data-access/dashboard"
import { Card } from "@/components/ui"

export default async function AccountPage() {
    const { account } = await getDashboardAccount()

    return (
        <div>
            <Card className="p-5">
                <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-500">Current plan</p>
                <p className="mt-2 text-2xl font-bold text-[#141824]">{account.plan}</p>
                <p className="mt-2 text-[14px] text-slate-600">Renewal date: {new Date(account.renewalDate).toLocaleDateString()}</p>
            </Card>
        </div>
    )
}
