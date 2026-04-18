"use client"

import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { useLanguageStore } from "@/store/useLanguageStore"
import { useSession } from "@/lib/supabase/useSession"
import { createClient } from "@/lib/supabase/client"
import { useAccount } from "@/features/billing/hooks/useAccount"
import { planDefinitions } from "@/features/billing/services/billing.service"
import { ProgressBar } from "@/components/ui/ProgressBar"

export function CreditsWidget() {
  const { data: account, isLoading, isError } = useAccount()
  const { userId } = useSession()
  const { t } = useLanguageStore()
  const queryClient = useQueryClient()
  const supabase = createClient()

  useEffect(() => {
    if (!userId) return

    const channel = supabase.channel(`public:user_account:user_id=eq.${userId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "user_account",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          void queryClient.invalidateQueries({ queryKey: ["account", userId] })
        }
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [supabase, userId, queryClient])

  if (isLoading || isError || !account) {
    return (
      <div className="hidden sm:flex flex-col gap-1.5 w-32 animate-pulse">
        <div className="h-2 w-full bg-surface-hover rounded-full" />
        <div className="h-3 w-3/4 bg-surface-hover rounded" />
      </div>
    )
  }

  const currentPlan = planDefinitions.find(p => p.name === account.plan)
  const totalCredits = currentPlan?.credits ?? account.creditsRemaining // Fallback if no plan found
  const usedCredits = Math.max(totalCredits - account.creditsRemaining, 0)
  
  const usagePercent = totalCredits > 0 ? Math.min((usedCredits / totalCredits) * 100, 100) : 0
  const dateStr = account.renewalDate ? format(new Date(account.renewalDate), "dd/MM") : ""
  
  return (
    <div className="hidden sm:flex flex-col justify-center min-w-[140px] px-3 py-1.5 rounded-2xl bg-surface-base/50 border border-border-soft">
      <div className="flex items-center justify-between text-[11px] font-bold text-primary-text mb-1.5">
        <span className="tracking-wide">{usedCredits} / {totalCredits}</span>
        {dateStr && (
          <span className="text-[10px] uppercase font-semibold text-secondary-text opacity-80 pl-2">
            {t.app.billing.creditsWidgetRenewsAt.replace("{0}", dateStr)}
          </span>
        )}
      </div>
      <ProgressBar 
        value={usagePercent} 
        className="h-1.5"
        trackClassName="bg-surface-subtle"
        fillClassName={usagePercent > 85 ? "bg-red-500" : "bg-[linear-gradient(90deg,#8B5CF6,#75CEF3)]"}
      />
    </div>
  )
}
