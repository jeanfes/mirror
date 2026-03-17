"use client"

import { Download, FileText } from "lucide-react"
import { format } from "date-fns"
import { useLanguageStore } from "@/store/useLanguageStore"
import { type Invoice } from "@/features/billing/services/billing.local.service"
import { cn } from "@/lib/utils"

interface BillingHistoryProps {
  invoices: Invoice[]
}

export function BillingHistory({ invoices }: BillingHistoryProps) {
  const { t } = useLanguageStore()

  if (invoices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-subtle text-secondary-text mb-4">
          <FileText className="h-6 w-6" />
        </div>
        <p className="text-[14px] font-medium text-secondary-text">{t.billing.noInvoices}</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border-soft bg-surface-base shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border-soft bg-surface-subtle/50">
              <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-secondary-text">{t.billing.invoiceDate}</th>
              <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-secondary-text">{t.billing.invoiceAmount}</th>
              <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-secondary-text">{t.billing.invoiceStatus}</th>
              <th className="px-6 py-4 text-right text-[12px] font-bold uppercase tracking-wider text-secondary-text"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-soft">
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="group hover:bg-surface-subtle/30 transition-colors">
                <td className="px-6 py-4 text-[14px] font-medium text-primary-text">
                  {format(new Date(invoice.date), "MMM d, yyyy")}
                </td>
                <td className="px-6 py-4 text-[14px] font-bold text-primary-text">
                  {invoice.amount}
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider",
                    invoice.status === "Paid" 
                      ? "bg-success/10 text-success" 
                      : "bg-warning/10 text-warning"
                  )}>
                    {invoice.status === "Paid" ? t.billing.statusPaid : t.billing.statusPending}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-secondary-text hover:bg-surface-elevated hover:text-primary-text transition-all active:scale-95"
                    title={t.billing.invoiceDownload}
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
