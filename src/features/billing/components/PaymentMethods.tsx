"use client"

import { type PaymentMethod } from "@/features/billing/services/billing.service"
import { useLanguageStore } from "@/store/useLanguageStore"
import { Card } from "@/components/ui/Card"
import { CreditCard} from "lucide-react"
import { m } from "motion/react"

interface PaymentMethodsProps {
  methods: PaymentMethod[]
}

export function PaymentMethods({ methods }: PaymentMethodsProps) {
  const { t } = useLanguageStore()
  const method = methods[0] 

  if (!method) {
    return (
      <m.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="space-y-4"
      >
        <div className="flex flex-col items-center justify-center py-20 px-10 text-center neo-card rounded-3xl border border-border-soft bg-surface-base/30 backdrop-blur-sm shadow-premium-sm">
          <div className="relative mb-6">
            <div className="absolute -inset-4 bg-brand-light/10 blur-2xl rounded-full" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-elevated text-secondary-text shadow-sm ring-1 ring-border-soft">
              <CreditCard className="h-8 w-8 text-primary-text/40" strokeWidth={1.5} />
            </div>
          </div>
          <h3 className="text-lg font-bold text-primary-text mb-2 tracking-tight">
            {t.app.billing.noPaymentMethodsTitle}
          </h3>
          <p className="max-w-60 text-[14px] font-medium text-secondary-text leading-relaxed">
            {t.app.billing.noPaymentMethodsDesc}
          </p>
        </div>
      </m.div>
    )
  }

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
                  {t.app.billing.cardEndingIn} {method.last4}
                </p>
                {method.isDefault && (
                  <span className="inline-flex items-center rounded-full bg-accent-blue/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-accent-blue">
                    Default
                  </span>
                )}
              </div>
              <p className="text-[13px] text-secondary-text font-medium opacity-80">
                {t.app.billing.expires} {method.expiry}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

