"use client"

import { memo } from "react"
import { Download, Trash2 } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { useLanguageStore } from "@/store/useLanguageStore"

interface DataTabProps {
  onDeleteAccount: () => void
  onExportData: () => void
  isExporting: boolean
  title: string
  description: string
}

export const DataTab = memo(function DataTab({
  onDeleteAccount,
  onExportData,
  isExporting,
  title,
  description
}: DataTabProps) {
  const t = useLanguageStore((state) => state.t)

  return (
    <div className="mt-0 space-y-8 animate-in fade-in-0 slide-in-from-bottom-2 duration-200">
      <SectionHeader title={title} description={description} />
      <div className="flex-col space-y-4">
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Download className="h-5 w-5 text-blue-500" />
            <p className="text-sm font-bold">{t.app.settingsModal.exportLibrary}</p>
          </div>
          <Button variant="secondary" className="w-full" onClick={onExportData} disabled={isExporting}>
            {isExporting ? t.app.settingsModal.savingChanges : t.app.settingsModal.startBackup}
          </Button>
        </Card>
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Trash2 className="h-5 w-5 text-red-500" />
            <p className="text-sm font-bold text-red-600">{t.app.settingsModal.dangerZone}</p>
          </div>
          <Button variant="dangerSoft" className="w-full" onClick={onDeleteAccount}>{t.app.settingsModal.deleteAccount}</Button>
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
