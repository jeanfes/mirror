"use client"

import React, { memo } from "react"
import { Shield } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { useLanguageStore } from "@/store/useLanguageStore"

interface SecurityTabProps {
  onUpdatePassword: () => void
  title: string
  description: string
  provider?: string
}

export const SecurityTab = memo(function SecurityTab({
  onUpdatePassword,
  title,
  description,
  provider
}: SecurityTabProps) {
  const { t } = useLanguageStore()
  const isGoogleUser = provider === "google"

  return (
    <div className="mt-0 space-y-8 animate-in fade-in-0 slide-in-from-bottom-2 duration-200">
      <SectionHeader title={title} description={description} />
      <Card className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-primary-text">{t.app.settingsModal.masterPassword}</p>
            {isGoogleUser ? (
              <p className="text-[11px] text-success font-medium flex items-center gap-1.5 mt-0.5">
                <span className="flex h-1.5 w-1.5 rounded-full bg-success" />
                {t.app.settingsModal.managedByGoogle}
              </p>
            ) : (
              <p className="text-[10px] text-secondary-text uppercase">{t.app.settingsModal.lastUpdated}</p>
            )}
          </div>
        </div>
        {!isGoogleUser && (
          <Button variant="secondary" onClick={onUpdatePassword}>
            {t.app.settingsModal.update}
          </Button>
        )}
      </Card>
    </div>
  )
})

const SectionHeader = ({ title, description }: { title: string, description: string }) => (
  <div className="space-y-1">
    <h3 className="settings-section-title">{title}</h3>
    <p className="settings-section-description">{description}</p>
  </div>
)
