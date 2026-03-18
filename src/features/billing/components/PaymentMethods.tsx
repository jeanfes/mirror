"use client"

import { CreditCard, Edit2, Plus } from "lucide-react"
import { useLanguageStore } from "@/store/useLanguageStore"
import { type PaymentMethod } from "@/features/billing/services/billing.service"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"

interface PaymentMethodsProps {
  methods: PaymentMethod[]
}

export function PaymentMethods({ methods }: PaymentMethodsProps) {
  const { t } = useLanguageStore()
  const method = methods[0] 

  if (!method) return null

  return (
    <div className="space-y-4 text-center sm:text-left">
      <Card className="p-6 border-border-soft bg-surface-base/40 backdrop-blur-sm shadow-premium-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-elevated text-primary-text ring-1 ring-border-soft shadow-sm shrink-0">
              <CreditCard className="h-6 w-6" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <p className="text-[15px] font-bold text-primary-text">
                  {t.billing.cardEndingIn} {method.last4}
                </p>
                {method.isDefault && (
                  <span className="inline-flex items-center rounded-full bg-accent-blue/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-accent-blue">
                    Default
                  </span>
                )}
              </div>
              <p className="text-[13px] text-secondary-text font-medium opacity-80">
                {t.billing.expires} {method.expiry}
              </p>
            </div>
          </div>

          <Button variant="secondary" size="md" className="h-10 px-4 gap-2.5 font-bold shadow-sm whitespace-nowrap w-full sm:w-auto">
            <Edit2 className="h-3.5 w-3.5" />
            {t.billing.updateCard}
          </Button>
        </div>
      </Card>

      <Button
        variant="secondary"
        className="w-full border-dashed border-2 py-6 bg-transparent hover:bg-surface-subtle transition-all gap-2 rounded-2xl"
      >
        <Plus className="h-4 w-4" />
        {t.billing.managePaymentMethod}
      </Button>
    </div>
  )
}

