"use client"

import React, { memo } from "react"
import { Card } from "@/components/ui/Card"
import { Toggle } from "@/components/ui/Toggle"

interface NotificationsTabProps {
  settings: {
    notificationsEnabled: boolean
    desktopAlertsEnabled: boolean
  } | null | undefined
  onToggleChange: (key: 'notificationsEnabled' | 'desktopAlertsEnabled', value: boolean) => void | Promise<void>
  title: string
  description: string
}

export const NotificationsTab = memo(function NotificationsTab({
  settings,
  onToggleChange,
  title,
  description
}: NotificationsTabProps) {
  return (
    <div className="mt-0 space-y-8 animate-in fade-in-0 slide-in-from-bottom-2 duration-200">
      <SectionHeader title={title} description={description} />
      <Card className="p-4 space-y-4">
        <Toggle 
          label="Actualizaciones por Email" 
          checked={settings?.notificationsEnabled ?? true} 
          onChange={(v) => onToggleChange('notificationsEnabled', v)}
        />
        <Toggle 
          label="Alertas de Escritorio" 
          checked={settings?.desktopAlertsEnabled ?? false} 
          onChange={(v) => onToggleChange('desktopAlertsEnabled', v)}
        />
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
