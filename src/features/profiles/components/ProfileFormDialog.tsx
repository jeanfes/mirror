"use client"

import { useEffect, memo } from "react"
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

const profileSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().min(8, "Add a clearer description"),
  tone: z.string().min(3, "Tone is required"),
  example1: z.string().min(6, "Example 1 is too short"),
  example2: z.string().min(6, "Example 2 is too short"),
  example3: z.string().min(6, "Example 3 is too short"),
  allowEmojis: z.boolean(),
  enabled: z.boolean(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

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

const defaults: ProfileFormValues = {
  name: "",
  description: "",
  tone: "",
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
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: defaults,
  })

  useEffect(() => {
    if (!open) return
    if (profile) {
      reset({
        name: profile.name,
        description: profile.description,
        tone: profile.tone,
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
    await onSubmit(values, profile?.id)
    reset(defaults)
  })

  return (
    <Dialog open={open} onOpenChange={(next) => (!next ? onClose() : undefined)}>
      {/* Remove inline style — border-none class already handles this */}
      <DialogContent className="w-[min(94vw,760px)] max-h-[90vh] flex flex-col rounded-[28px] border-none bg-surface-overlay-strong p-0 overflow-hidden">
        <DialogDescription className="sr-only">
          Form to create or edit a voice profile
        </DialogDescription>
        <div className="flex flex-col lg:grid lg:grid-cols-[0.92fr_1.08fr] overflow-hidden flex-1">
          <div className="dashboard-dark-panel dashboard-dark-panel-split shrink-0 overflow-hidden md:p-6">
            <h2 className="text-3xl font-black tracking-[-0.04em]">
              {profile ? "Refine this voice" : "Create a new voice"}
            </h2>
            <p className="mt-4 text-[14px] leading-7 text-white/85">
              Good profiles are specific enough to guide tone and flexible
              enough to work across different LinkedIn posts.
            </p>

            <div className="hidden sm:block mt-6 rounded-[22px] border border-white/20 bg-white/12 p-4 backdrop-blur-sm">
              <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-white/85">
                {t.app.profileForm.strongProfileTitle}
              </p>
              <ul className="mt-3 space-y-3 text-[13px] leading-6 text-white/90">
                <li>Choose one clear posture, not three mixed personalities.</li>
                <li>Use examples that sound publishable right away.</li>
                <li>Only enable emojis if they match your public tone.</li>
              </ul>
            </div>

            <div className="mt-5 flex items-start gap-3 rounded-[22px] border border-white/20 bg-white/12 p-4 backdrop-blur-sm">
              <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20">
                <Lightbulb className="h-4 w-4" />
              </div>
              <p className="text-[13px] leading-6 text-white/85">
                Mirror works best when each profile sounds like a repeatable
                professional persona, not just a different adjective.
              </p>
            </div>
          </div>

          <div className="bg-surface-elevated p-5 md:p-6 overflow-y-auto custom-scrollbar flex-1 lg:max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-primary-text">
                {profile ? "Edit profile" : "Create profile"}
              </DialogTitle>
              <p className="text-[13px] leading-6 text-secondary-text">
                Define voice, tone and three sample comments for consistent
                generation.
              </p>
            </DialogHeader>

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
                  placeholder="What kind of perspective does this profile bring?"
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

                <div className="space-y-3">
                  <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-secondary-text">
                    {t.app.profileForm.exampleComments}
                  </p>
                  <p className="text-[13px] text-secondary-text">
                    Use three short examples that feel ready to post, not
                    abstract instructions.
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
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending
                    ? "Saving..."
                    : profile
                      ? "Save changes"
                      : "Create profile"}
                </Button>
              </DialogFooter>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
})
