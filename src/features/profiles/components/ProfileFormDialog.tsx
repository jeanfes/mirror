"use client"

import { useEffect, memo, useMemo } from "react"
import { z } from "zod"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Lightbulb } from "lucide-react"
import type { VoiceProfile } from "@/types/database.types"
import type { CreateProfileInput } from "@/features/profiles/services/profiles.service"
import { Button } from "@/components/ui/Button"
import { Toggle } from "@/components/ui/Toggle"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"
import { useLanguageStore } from "@/store/useLanguageStore"

import { Dictionary } from "@/lib/i18n"

const createProfileSchema = (t: Dictionary) => z.object({
  name: z.string().min(2, t.app.profileForm.errors.nameRequired),
  description: z.string().min(8, t.app.profileForm.errors.descRequired),
  tone: z.string().min(3, t.app.profileForm.errors.toneRequired),
  personaBio: z.string().min(8, t.app.profileForm.errors.descRequired),
  expertiseTopics: z.string().min(2, t.app.profileForm.errors.descRequired),
  personalityTraits: z.string().min(2, t.app.profileForm.errors.descRequired),
  writingTraits: z.string().optional(),
  vocabularyLevel: z.string().optional(),
  example1: z.string().min(6, t.app.profileForm.errors.exampleMin),
  example2: z.string().min(6, t.app.profileForm.errors.exampleMin),
  example3: z.string().min(6, t.app.profileForm.errors.exampleMin),
  allowEmojis: z.boolean(),
  enabled: z.boolean(),
})

type ProfileFormValues = z.infer<ReturnType<typeof createProfileSchema>>

interface ProfileFormDialogProps {
  open: boolean
  profile: VoiceProfile | null
  isPending: boolean
  onClose: () => void
  onSubmit: (
    values: CreateProfileInput,
    profileId?: string
  ) => Promise<void>
}

function parseCommaSeparated(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
}

function parseWritingTraits(value: string | undefined): Record<string, unknown> {
  const normalized = (value ?? "").trim()
  if (!normalized) {
    return {}
  }

  try {
    const parsed = JSON.parse(normalized)
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>
    }
  } catch {
    // Keep graceful fallback to avoid blocking the submit flow.
  }

  return {}
}

function normalizeVocabularyLevel(value: string | undefined): CreateProfileInput["vocabularyLevel"] {
  return value === "simple" || value === "conversational" || value === "technical" || value === "academic"
    ? value
    : null
}

const defaults: ProfileFormValues = {
  name: "",
  description: "",
  tone: "",
  personaBio: "",
  expertiseTopics: "",
  personalityTraits: "",
  writingTraits: "",
  vocabularyLevel: "",
  example1: "",
  example2: "",
  example3: "",
  allowEmojis: false,
  enabled: true,
}

export const ProfileFormDialog = memo(function ProfileFormDialog({
  open,
  profile,
  isPending,
  onClose,
  onSubmit,
}: ProfileFormDialogProps) {
  const t = useLanguageStore((state) => state.t)
  const currentSchema = useMemo(() => createProfileSchema(t), [t])

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(currentSchema),
    defaultValues: defaults,
  })

  useEffect(() => {
    if (!open) return
    if (profile) {
      reset({
        name: profile.name,
        description: profile.description,
        tone: profile.tone,
        personaBio: profile.personaBio,
        expertiseTopics: profile.expertiseTopics.join(", "),
        personalityTraits: profile.personalityTraits.join(", "),
        writingTraits: Object.keys(profile.writingTraits).length
          ? JSON.stringify(profile.writingTraits, null, 2)
          : "",
        vocabularyLevel: profile.vocabularyLevel ?? "",
        example1: profile.examples[0] ?? "",
        example2: profile.examples[1] ?? "",
        example3: profile.examples[2] ?? "",
        allowEmojis: profile.allowEmojis,
        enabled: profile.enabled,
      })
      return
    }
    reset(defaults)
  }, [open, profile, reset])

  const submit = handleSubmit(async (values) => {
    const payload: CreateProfileInput = {
      ...values,
      personaBio: values.personaBio.trim(),
      expertiseTopics: parseCommaSeparated(values.expertiseTopics),
      personalityTraits: parseCommaSeparated(values.personalityTraits),
      writingTraits: parseWritingTraits(values.writingTraits),
      vocabularyLevel: normalizeVocabularyLevel(values.vocabularyLevel)
    }

    await onSubmit(payload, profile?.id)
    reset(defaults)
  })

  return (
    <Dialog open={open} onOpenChange={(next) => (!next ? onClose() : undefined)}>
      {/* Remove inline style — border-none class already handles this */}
      <DialogContent className="w-[min(94vw,880px)] max-h-[90vh] flex flex-col rounded-[28px] border-none bg-surface-overlay-strong p-0 overflow-hidden">
        <DialogDescription className="sr-only">
          {t.app.profileForm.formDescription}
        </DialogDescription>
        <div className="flex flex-col lg:grid lg:grid-cols-[0.92fr_1.08fr] overflow-hidden flex-1">
          <div className="dashboard-dark-panel dashboard-dark-panel-split shrink-0 overflow-hidden md:p-6">
            <h2 className="text-3xl font-black tracking-[-0.04em]">
              {profile ? t.app.profileForm.refineVoice : t.app.profileForm.createNewVoice}
            </h2>
            <p className="mt-4 text-[14px] leading-7 text-white/85">
              {t.app.profileForm.voiceDesc}
            </p>

            <div className="hidden sm:block mt-6 rounded-[22px] border border-white/20 bg-white/12 p-4 backdrop-blur-sm">
              <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-white/85">
                {t.app.profileForm.strongProfileTitle}
              </p>
              <ul className="mt-3 space-y-3 text-[13px] leading-6 text-white/90">
                <li>{t.app.profileForm.strongProfileL1}</li>
                <li>{t.app.profileForm.strongProfileL2}</li>
                <li>{t.app.profileForm.strongProfileL3}</li>
              </ul>
            </div>

            <div className="mt-5 flex items-start gap-3 rounded-[22px] border border-white/20 bg-white/12 p-4 backdrop-blur-sm">
              <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20">
                <Lightbulb className="h-4 w-4" />
              </div>
              <p className="text-[13px] leading-6 text-white/85">
                {t.app.profileForm.mirrorWorksBest}
              </p>
            </div>
          </div>

          <div className="bg-surface-elevated flex flex-col flex-1 overflow-hidden lg:max-h-[80vh]">
            <div className="px-5 md:px-6 pt-5 md:pt-6 pb-2 shrink-0 pr-12">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-primary-text">
                  {profile ? t.app.profileForm.editProfile : t.app.profileForm.createProfile}
                </DialogTitle>
                <p className="text-[13px] leading-6 text-secondary-text">
                  {t.app.profileForm.defineVoiceDesc}
                </p>
              </DialogHeader>
            </div>

            <div className="flex-1 overflow-y-auto px-5 md:px-6 pb-5 md:pb-6 custom-scrollbar">

            <form onSubmit={submit}>
              <div className="grid gap-5">
                <Input
                  label={t.app.profileForm.nameLabel}
                  placeholder={t.app.profileForm.namePlaceholder}
                  error={errors.name?.message}
                  {...register("name")}
                />
                <Textarea
                  label={t.app.profileForm.descLabel}
                  placeholder={t.app.profileForm.descPlaceholder}
                  rows={2}
                  error={errors.description?.message}
                  {...register("description")}
                />
                <Input
                  label={t.app.profileForm.toneLabel}
                  placeholder={t.app.profileForm.tonePlaceholder}
                  error={errors.tone?.message}
                  {...register("tone")}
                />

                <Textarea
                  label="Persona bio"
                  placeholder="Founder in B2B SaaS, 6 years in enterprise sales..."
                  rows={2}
                  error={errors.personaBio?.message}
                  {...register("personaBio")}
                />

                <Input
                  label="Expertise topics (comma separated)"
                  placeholder="startups, sales, AI, product"
                  error={errors.expertiseTopics?.message}
                  {...register("expertiseTopics")}
                />

                <Input
                  label="Personality traits (comma separated)"
                  placeholder="direct, analytical, provocative"
                  error={errors.personalityTraits?.message}
                  {...register("personalityTraits")}
                />

                <Textarea
                  label="Writing traits JSON (optional)"
                  placeholder='{"sentence_length":"short","opener_style":"question"}'
                  rows={3}
                  error={errors.writingTraits?.message}
                  {...register("writingTraits")}
                />

                <div className="w-full space-y-2 group">
                  <div className="flex items-center justify-between">
                    <label className="text-[12px] font-bold uppercase tracking-[0.12em] text-secondary-text transition-colors group-focus-within:text-accent-purple">
                      Vocabulary level
                    </label>
                  </div>
                  <select
                    className="flex h-11 w-full flex-row items-center rounded-2xl border border-border-soft bg-surface-elevated px-4 text-[13px] font-medium text-primary-text transition-all duration-200 hover:border-border-medium focus:border-accent-purple/40 focus:ring-4 focus:ring-accent-purple/8 focus:outline-none"
                    {...register("vocabularyLevel")}
                  >
                    <option value="">Auto</option>
                    <option value="simple">Simple</option>
                    <option value="conversational">Conversational</option>
                    <option value="technical">Technical</option>
                    <option value="academic">Academic</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-secondary-text">
                    {t.app.profileForm.exampleComments}
                  </p>
                  <p className="text-[13px] text-secondary-text">
                    {t.app.profileForm.exampleCommentsDesc}
                  </p>
                  <div className="mt-3 grid gap-3">
                    <Textarea
                      placeholder={t.app.profileForm.example1Placeholder}
                      rows={2}
                      error={errors.example1?.message}
                      {...register("example1")}
                    />
                    <Textarea
                      placeholder={t.app.profileForm.example2Placeholder}
                      rows={2}
                      error={errors.example2?.message}
                      {...register("example2")}
                    />
                    <Textarea
                      placeholder={t.app.profileForm.example3Placeholder}
                      rows={2}
                      error={errors.example3?.message}
                      {...register("example3")}
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-2 md:grid-cols-2 mt-3">
                <Controller
                  name="allowEmojis"
                  control={control}
                  render={({ field }) => (
                    <Toggle
                      checked={field.value}
                      onChange={field.onChange}
                      label={t.app.profileForm.allowEmojis}
                    />
                  )}
                />
                <Controller
                  name="enabled"
                  control={control}
                  render={({ field }) => (
                    <Toggle
                      checked={field.value}
                      onChange={field.onChange}
                      label={t.app.profileForm.profileEnabled}
                    />
                  )}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                >
                  {t.app.profileForm.cancel}
                </Button>
                <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
                  {isPending
                    ? t.app.profileForm.saving
                    : profile
                      ? t.app.profileForm.saveChanges
                      : t.app.profileForm.createProfile}
                </Button>
              </DialogFooter>
            </form>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
})
