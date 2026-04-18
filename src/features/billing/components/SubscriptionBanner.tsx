"use client"

import { AlertCircle, Clock } from "lucide-react"
import { format } from "date-fns"
import { useLanguageStore } from "@/store/useLanguageStore"
import { useAccount } from "@/features/billing/hooks/useAccount"
import { useBilling } from "@/features/billing/hooks/useBilling"

export function SubscriptionBanner() {
  const { data: account, isLoading } = useAccount()
  const { billingInfo } = useBilling()
  const { t } = useLanguageStore()

  if (isLoading || !account) return null

  const { subscriptionStatus, renewalDate } = account
  if (!subscriptionStatus || subscriptionStatus === "active") return null

  const dateStr = renewalDate ? format(new Date(renewalDate), "dd/MM/yyyy") : ""

  if (subscriptionStatus === "trialing") {
    return (
      <div className="bg-accent-blue/10 border-b border-accent-blue/20 px-4 py-2 flex items-center justify-center gap-2 text-[13px] text-accent-blue font-medium">
        <Clock className="w-4 h-4" />
        <span>{t.app.billing.freeTrialEndsOn.replace("{0}", dateStr)}</span>
      </div>
    )
  }

  if (subscriptionStatus === "past_due") {
    return (
      <div className="bg-red-500/10 border-b border-red-500/20 px-4 py-2 flex items-center justify-center gap-2 text-[13px] text-red-500 font-medium">
        <AlertCircle className="w-4 h-4" />
        <span>{t.app.billing.pastDue} - {t.app.billing.paymentFailedBanner}</span>
        {billingInfo?.updateUrl && (
          <a href={billingInfo.updateUrl} target="_blank" rel="noopener noreferrer" className="underline font-bold ml-2">
            {t.app.billing.updateCard}
          </a>
        )}
      </div>
    )
  }

  if (subscriptionStatus === "canceled") {
    return (
      <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 flex items-center justify-center gap-2 text-[13px] text-amber-500 font-medium">
        <AlertCircle className="w-4 h-4" />
        <span>{t.app.billing.subscriptionCanceledNotice.replace("{0}", dateStr)}</span>
      </div>
    )
  }

  return null
}
