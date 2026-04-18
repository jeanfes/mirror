"use client"

import { formatDistanceToNow } from "date-fns"
import {
  Download,
  Eye,
  EyeOff,
  MessageSquareQuote,
  MoreHorizontal,
  Pencil,
  WandSparkles,
  Trash2,
} from "lucide-react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu"
import type { VoiceProfile } from "@/types/database.types"

import { useLanguageStore } from "@/store/useLanguageStore"

interface ProfileCardProps {
  profile: VoiceProfile
  onEdit: (id: string) => void
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onExport?: (id: string) => void
}
export function ProfileCard({
  profile,
  onEdit,
  onToggle,
  onExport,
  onDelete,
}: ProfileCardProps) {
  const t = useLanguageStore((state) => state.t)

  return (
    <Card className="relative overflow-hidden rounded-[28px] border border-border-soft p-0 shadow-premium-md">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-surface-elevated to-transparent"
      />

      <div className="relative p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="max-w-[80%]">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-border-soft bg-surface-elevated px-2.5 py-1 text-[11px] font-semibold text-secondary-text shadow-premium-sm">
              <WandSparkles className="h-2.5 w-2.5 text-secondary-text" />
              {t.app.profiles.voiceProfile}
            </div>
            <h2 className="mt-4 text-2xl font-black tracking-[-0.04em] text-primary-text">
              {profile.name}
            </h2>
            <p className="mt-3 body-muted">{profile.description}</p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                className="h-10 w-10 rounded-full border border-border-soft bg-surface-elevated p-0"
                aria-label={t.app.profiles.openActions}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(profile.id)}>
                <Pencil className="mr-2 h-4 w-4" />
                {t.app.profiles.edit}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onToggle(profile.id)}>
                {profile.enabled ? (
                  <EyeOff className="mr-2 h-4 w-4" />
                ) : (
                  <Eye className="mr-2 h-4 w-4" />
                )}
                {profile.enabled ? t.app.profiles.disable : t.app.profiles.enable}
              </DropdownMenuItem>
              {onExport && (
                <DropdownMenuItem onClick={() => onExport(profile.id)}>
                  <Download className="mr-2 h-4 w-4" />
                  {t.app.settingsModal.tabExport}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => onDelete(profile.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {t.app.profiles.delete}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-border-soft bg-surface-elevated px-2.5 py-1 text-[11px] font-semibold text-secondary-text">
            {profile.enabled ? t.app.profiles.enabled : t.app.profiles.disabled}
          </span>
          <span className="text-[12px] font-medium text-secondary-text">
            {t.app.profiles.updatedPrefix} {formatDistanceToNow(profile.updatedAt, { addSuffix: true })}
          </span>
        </div>

        <div className="mt-5 rounded-3xl border border-border-soft bg-surface-card p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="dashboard-overline">{t.app.profiles.toneMap}</p>
              <p className="mt-1 text-[15px] font-semibold text-primary-text">
                {profile.tone}
              </p>
            </div>
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border-soft bg-surface-elevated">
              <MessageSquareQuote className="h-4 w-4 text-primary-text" />
            </div>
          </div>
        </div>

        {/* Use index as key — example content is not stable as a unique identifier */}
        <div className="mt-4 space-y-2.5">
          {(profile.examples ?? []).map((example, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border-soft bg-surface-card px-3.5 py-3"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-text">
                {t.app.profiles.examplePrefix} {i + 1}
              </p>
              <p className="mt-2 text-[13px] leading-6 text-secondary-text">
                {example}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
