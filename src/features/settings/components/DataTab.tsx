"use client"

import { memo } from "react"
import { Download, Trash2 } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { toast } from "sonner"

interface DataTabProps {
  onDeleteAccount: () => void
  title: string
  description: string
}

export const DataTab = memo(function DataTab({
  onDeleteAccount,
  title,
  description
}: DataTabProps) {
  return (
    <div className="mt-0 space-y-8 animate-in fade-in-0 slide-in-from-bottom-2 duration-200">
      <SectionHeader title={title} description={description} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Download className="h-5 w-5 text-blue-500" />
            <p className="text-sm font-bold">Exportar Biblioteca</p>
          </div>
          <Button variant="secondary" className="w-full" onClick={() => toast.success("Backup iniciado")}>Empezar Backup</Button>
        </Card>
        <Card className="p-6 space-y-4 border-red-200 bg-red-50/30">
          <div className="flex items-center gap-3">
            <Trash2 className="h-5 w-5 text-red-500" />
            <p className="text-sm font-bold text-red-600">Zona de Peligro</p>
          </div>
          <Button variant="dangerSoft" className="w-full" onClick={onDeleteAccount}>Eliminar Cuenta</Button>
        </Card>
      </div>
    </div>
  )
})

const SectionHeader = ({ title, description }: { title: string, description: string }) => (
  <div className="space-y-1">
    <h3 className="settings-section-title">{title}</h3>
    <p className="settings-section-description">{description}</p>
  </div>
)
