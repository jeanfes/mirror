"use client"

import { memo } from "react"
import { Card } from "@/components/ui/Card"
import { ThemeSegmentedControl } from "@/components/ui/ThemeToggle"
import type { ThemePreference } from "@/lib/theme"

interface AppearanceTabProps {
  themePreference: ThemePreference
  onThemeChange: (pref: ThemePreference) => void | Promise<void>
  title: string
  description: string
  activeLabel: string
}

export const AppearanceTab = memo(function AppearanceTab({
  themePreference,
  onThemeChange,
  title,
  description,
  activeLabel
}: AppearanceTabProps) {
  return (
    <div className="mt-0 space-y-8 animate-in fade-in-0 slide-in-from-bottom-2 duration-200">
      <SectionHeader title={title} description={description} />
      <Card className="p-6 sm:p-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-secondary-text">{activeLabel}</p>
          <p className="mt-1 text-[14px] font-semibold text-primary-text capitalize">{themePreference} mode</p>
        </div>
        <ThemeSegmentedControl onChange={onThemeChange} />
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
