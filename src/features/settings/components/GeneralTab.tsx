"use client"

import React, { memo } from "react"
import Image from "next/image"
import { BadgeCheck } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"

interface GeneralTabProps {
  user: {
    name: string
    email: string
    avatar?: string
  }
  language: string
  onLanguageChange: (val: string) => void | Promise<void>
  t: {
    generalInfoTitle: string
    generalInfoDesc: string
    fullName: string
    emailAddress: string
    appLanguage: string
    labelEn: string
    labelEs: string
    labelPt: string
    labelFr: string
    labelDe: string
  }
}

export const GeneralTab = memo(function GeneralTab({
  user,
  language,
  onLanguageChange,
  t
}: GeneralTabProps) {
  return (
    <div className="mt-0 space-y-8 animate-in fade-in-0 slide-in-from-bottom-2 duration-200">
      <SectionHeader title={t.generalInfoTitle} description={t.generalInfoDesc} />
      <Card className="p-6 space-y-6">
        <div className="flex items-center gap-5">
          <div className="relative h-20 w-20 shrink-0">
            <div className="relative h-full w-full rounded-3xl bg-linear-to-br from-slate-800 to-slate-900 flex items-center justify-center text-white text-3xl font-bold shadow-lg overflow-hidden">
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.name}
                  fill
                  sizes="80px"
                  className="rounded-3xl object-cover"
                />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-xl bg-surface-elevated text-accent-purple shadow-sm ring-1 ring-border-soft">
              <BadgeCheck className="h-4 w-4 fill-accent-purple text-white" />
            </div>
          </div>
          <div>
            <h4 className="font-bold text-primary-text">{user.name}</h4>
            <p className="text-xs text-secondary-text font-medium">{user.email}</p>
          </div>
        </div>
        <div className="grid gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input disabled label={t.fullName} defaultValue={user.name} />
            <Input disabled label={t.emailAddress} defaultValue={user.email} />
          </div>
          <Select
            label={t.appLanguage}
            value={language}
            onChange={onLanguageChange}
            options={[
              { label: t.labelEn, value: "en" },
              { label: t.labelEs, value: "es" },
              { label: t.labelPt, value: "pt" },
              { label: t.labelFr, value: "fr" },
              { label: t.labelDe, value: "de" },
            ]}
          />
        </div>
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
