import Link from "next/link"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"

const plans = [
    { name: "Free", credits: 120, price: "$0", features: ["1 active profile", "Basic history", "Community support"] },
    { name: "Pro", credits: 1200, price: "$19", features: ["10 profiles", "Advanced history", "Priority support"] },
    { name: "Elite", credits: 4000, price: "$59", features: ["Unlimited profiles", "Advanced analytics", "Team collaboration"] }
]

export default function PlansPage() {
    return (
        <div>
            <div className="grid gap-4 md:grid-cols-3">
                {plans.map((plan) => (
                    <Card key={plan.name} className="p-5">
                        <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-500">{plan.name}</p>
                        <p className="mt-2 text-3xl font-bold text-[#141824]">{plan.price}</p>
                        <p className="text-[13px] text-slate-600">{plan.credits} credits / month</p>
                        <ul className="mt-4 space-y-2">
                            {plan.features.map((feature) => (
                                <li key={feature} className="flex items-center gap-2 text-[13px] text-slate-700">
                                    <Check className="h-4 w-4 text-emerald-600" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <Link className="mt-4 block" href="/account">
                            <Button className="w-full">Select {plan.name}</Button>
                        </Link>
                    </Card>
                ))}
            </div>
        </div>
    )
}
