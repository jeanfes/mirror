"use client"

import { Download, FileText } from "lucide-react"
import { m } from "motion/react"
import { format } from "date-fns"
import { useLanguageStore } from "@/store/useLanguageStore"
import { type Invoice } from "@/features/billing/services/billing.service"
import type { Dictionary } from "@/lib/i18n"
import { cn } from "@/lib/utils"

interface BillingHistoryProps {
  invoices: Invoice[]
}

function getStatusClassName(status: Invoice["status"]) {
  if (status === "paid") return "bg-success/10 text-success"
  if (status === "pending") return "bg-warning/10 text-warning"
  if (status === "failed") return "bg-danger/10 text-danger"
  if (status === "refunded") return "bg-accent-blue/12 text-accent-blue"
  if (status === "void") return "bg-secondary-text/10 text-secondary-text"

  return "bg-secondary-text/10 text-secondary-text"
}

function getStatusLabel(status: Invoice["status"], t: Dictionary) {
  if (status === "paid") return t.app.billing.statusPaid
  if (status === "pending") return t.app.billing.statusPending
  if (status === "failed") return t.app.billing.statusFailed
  if (status === "refunded") return t.app.billing.statusRefunded
  if (status === "void") return t.app.billing.statusVoid

  return t.app.billing.statusUnknown
}

export function BillingHistory({ invoices }: BillingHistoryProps) {
  const { t } = useLanguageStore()

  if (invoices.length === 0) {
    return (
      <m.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col items-center justify-center py-20 px-6 text-center neo-card rounded-3xl border border-border-soft bg-surface-base/30 backdrop-blur-sm shadow-premium-sm"
      >
        <div className="relative mb-6">
          <m.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -inset-8 bg-accent-blue/20 blur-3xl rounded-full" 
          />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-surface-elevated text-secondary-text shadow-premium-sm ring-1 ring-border-soft">
            <FileText className="h-10 w-10 text-primary-text/40" strokeWidth={1.5} />
          </div>
        </div>
        <h3 className="text-xl font-black text-primary-text mb-2 tracking-tight">
          {t.app.billing.noInvoicesTitle}
        </h3>
        <p className="max-w-xs text-[15px] font-medium text-secondary-text leading-relaxed">
          {t.app.billing.noInvoicesDesc}
        </p>
      </m.div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border-soft bg-surface-base shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border-soft bg-surface-subtle/50">
              <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-secondary-text">{t.app.billing.invoiceDate}</th>
              <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-secondary-text">{t.app.billing.invoiceAmount}</th>
              <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-secondary-text">{t.app.billing.invoiceStatus}</th>
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
                    getStatusClassName(invoice.status)
                  )}>
                    {getStatusLabel(invoice.status, t)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-secondary-text hover:bg-surface-elevated hover:text-primary-text transition-all active:scale-95"
                    title={t.app.billing.invoiceDownload}
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
