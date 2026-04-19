import { type PaymentMethod } from "@/features/billing/services/billing.service"
import { useState } from "react"
import { useLanguageStore } from "@/store/useLanguageStore"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { CreditCard } from "lucide-react"
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"
import { toast } from "sonner"
import { format } from "date-fns"
import { getFormatLocale } from "@/lib/utils/date-utils"

interface PaymentMethodsProps {
  methods: PaymentMethod[]
  updateUrl?: string | null
  portalUrl?: string | null
  onCancelSubscription?: () => Promise<void>
  isCancelling?: boolean
  renewalDate?: string | null
}

export function PaymentMethods({
  methods,
  updateUrl,
  portalUrl,
  onCancelSubscription,
  isCancelling = false,
  renewalDate,
}: PaymentMethodsProps) {
  const { t, language } = useLanguageStore()
  const [showCancelModal, setShowCancelModal] = useState(false)
  const method = methods[0]

  if (!method) {
    return (
      <div
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
          {(portalUrl || updateUrl) ? (
            <div className="mt-5 w-full max-w-72">
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => window.open(portalUrl || updateUrl || "", "_blank", "noopener,noreferrer")}
              >
                {t.app.billing.manageSubscription}
              </Button>
            </div>
          ) : null}
        </div>
      </div>
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
                    {t.app.settingsModal.managedByGoogle}
                  </span>
                )}
              </div>
              <p className="text-[13px] text-secondary-text font-medium opacity-80">
                {t.app.billing.expires} {method.expiry}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-2">
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => window.open(updateUrl || portalUrl || "", "_blank", "noopener,noreferrer")}
            disabled={!updateUrl && !portalUrl}
          >
            {t.app.billing.managePaymentMethod}
          </Button>

          <Button
            variant="dangerSoft"
            className="w-full"
            onClick={() => setShowCancelModal(true)}
            loading={isCancelling}
            loadingLabel={t.app.common.working}
            disabled={!onCancelSubscription}
          >
            {t.app.billing.cancelSubscription}
          </Button>
        </div>
      </Card>

      <ConfirmDialog
        open={showCancelModal}
        onCancel={() => setShowCancelModal(false)}
        title={t.app.billing.cancelSubscription}
        description={t.app.billing.cancelSubscriptionDescription}
        confirmLabel={t.app.billing.cancelSubscription}
        cancelLabel={t.app.common.cancel}
        isPending={isCancelling}
        onConfirm={async () => {
          if (!onCancelSubscription) return
          try {
            await onCancelSubscription()
            const dateStr = renewalDate ? format(new Date(renewalDate), "MMM d, yyyy", { locale: getFormatLocale(language) }) : t.app.billing.nextCycleIndicator
            toast.success(t.app.billing.subscriptionCanceledNotice.replace("{0}", dateStr))
            setShowCancelModal(false)
          } catch {
            // Error managed globally or above
            setShowCancelModal(false)
          }
        }}
      />
    </div>
  )
}

