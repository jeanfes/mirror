import { Repeat } from "lucide-react"
import { format } from "date-fns"
import { useLanguageStore } from "@/store/useLanguageStore"
import type { PlanChangeHistory } from "@/features/billing/services/billing.service"
import { getFormatLocale } from "@/lib/utils/date-utils"

interface PlanChangeHistoryTableProps {
    changes: PlanChangeHistory[]
}

function formatPlan(value: string | null, fallback: string) {
    if (!value) {
        return fallback
    }
    return value
}

export function PlanChangeHistoryTable({ changes }: PlanChangeHistoryTableProps) {
    const { t, language } = useLanguageStore()

    if (changes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-border-soft bg-surface-base/30 px-6 py-16 text-center shadow-premium-sm backdrop-blur-sm">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-elevated text-secondary-text ring-1 ring-border-soft">
                    <Repeat className="h-7 w-7 text-primary-text/45" strokeWidth={1.5} />
                </div>
                <h3 className="text-base font-black tracking-tight text-primary-text">
                    {t.app.billing.planChangesEmptyTitle}
                </h3>
                <p className="mt-2 max-w-sm text-sm font-medium leading-relaxed text-secondary-text">
                    {t.app.billing.planChangesEmptyDesc}
                </p>
            </div>
        )
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-border-soft bg-surface-base shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                    <thead>
                        <tr className="border-b border-border-soft bg-surface-subtle/50">
                            <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-secondary-text">{t.app.billing.planChangeDate}</th>
                            <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-secondary-text">{t.app.billing.planChangeFrom}</th>
                            <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-secondary-text">{t.app.billing.planChangeTo}</th>
                            <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-secondary-text">{t.app.billing.planChangeReason}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-soft">
                        {changes.map((item) => (
                            <tr key={item.id} className="transition-colors hover:bg-surface-subtle/30">
                                <td className="px-5 py-3 text-sm font-medium text-primary-text">
                                    {format(new Date(item.createdAt), "MMM d, yyyy", { locale: getFormatLocale(language) })}
                                </td>
                                <td className="px-5 py-3 text-sm font-semibold text-secondary-text">
                                    {formatPlan(item.fromPlan, t.app.billing.unknownValue)}
                                </td>
                                <td className="px-5 py-3 text-sm font-semibold text-primary-text">
                                    {formatPlan(item.toPlan, t.app.billing.unknownValue)}
                                </td>
                                <td className="px-5 py-3 text-sm text-secondary-text">
                                    {item.reason ?? t.app.billing.unknownValue}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
