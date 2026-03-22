"use client"

import React, { memo } from "react"
import { Shield } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"

interface SecurityTabProps {
  onUpdatePassword: () => void
  title: string
  description: string
}

export const SecurityTab = memo(function SecurityTab({
  onUpdatePassword,
  title,
  description
}: SecurityTabProps) {
  return (
    <div className="mt-0 space-y-8 animate-in fade-in-0 slide-in-from-bottom-2 duration-200">
      <SectionHeader title={title} description={description} />
      <Card className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500"><Shield className="h-5 w-5" /></div>
          <div>
            <p className="text-sm font-bold text-primary-text">Contraseña Maestra</p>
            <p className="text-[10px] text-secondary-text uppercase">Actualizada hace poco</p>
          </div>
        </div>
        <Button variant="secondary" onClick={onUpdatePassword}>Actualizar</Button>
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
