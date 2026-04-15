"use client"

import { useEffect, memo, useMemo } from "react"
import { z } from "zod"
import { useForm, Controller, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Sparkles, Check } from "lucide-react"
import type { ObjectiveProfile, PlatformId } from "@/types/database.types"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Select } from "@/components/ui/Select"
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

const PLATFORM_OPTIONS = ["linkedin", "upwork", "twitter", "reddit", "youtube"] as const
const PLATFORMS: PlatformId[] = [...PLATFORM_OPTIONS]
const GOAL_TYPE_OPTIONS = ["Add Value", "Challenge", "Networking", "Question"] as const

const createGoalSchema = (t: Dictionary) => z.object({
  name: z.string().min(2, t.app.goals.nameRequiredError),
  canonicalGoal: z.enum(GOAL_TYPE_OPTIONS),
  description: z.string().max(300).optional(),
  strategyPrompt: z.string().min(10, "El prompt debe ser más descriptivo").max(1200),
  scope: z.array(z.enum(PLATFORM_OPTIONS)).min(1, "Selecciona al menos una plataforma"),
  active: z.boolean(),
})

export type GoalFormValues = z.infer<ReturnType<typeof createGoalSchema>>

interface GoalFormDialogProps {
  open: boolean
  goal: ObjectiveProfile | null
  isPending: boolean
  onClose: () => void
  onSubmit: (values: GoalFormValues, goalId?: string) => Promise<void>
}

const defaults: GoalFormValues = {
  name: "",
  canonicalGoal: "Add Value",
  description: "",
  strategyPrompt: "",
  scope: [...PLATFORMS],
  active: true,
}

export const GoalFormDialog = memo(function GoalFormDialog({
  open,
  goal,
  isPending,
  onClose,
  onSubmit,
}: GoalFormDialogProps) {
  const t = useLanguageStore((state) => state.t)
  const currentSchema = useMemo(() => createGoalSchema(t), [t])

  const goalOptions = useMemo(() => [
    { label: t.app.settings.goalValue, value: "Add Value" },
    { label: t.app.settings.goalChallenge, value: "Challenge" },
    { label: t.app.settings.goalConnect, value: "Networking" },
    { label: t.app.settings.goalQuestion, value: "Question" }
  ], [t])

  const platformLabels: Record<PlatformId, string> = {
    linkedin: t.app.settings.platformLinkedIn,
    upwork: t.app.settings.platformUpwork,
    twitter: t.app.settings.platformTwitter,
    reddit: t.app.settings.platformReddit,
    youtube: t.app.settings.platformYoutube
  }

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<GoalFormValues>({
    resolver: zodResolver(currentSchema),
    defaultValues: defaults,
  })

  useEffect(() => {
    if (!open) return
    if (goal) {
      reset({
        name: goal.name,
        canonicalGoal: goal.canonicalGoal,
        description: goal.description || "",
        strategyPrompt: goal.strategyPrompt,
        scope: [...goal.scope],
        active: goal.active,
      })
      return
    }
    reset(defaults)
  }, [open, goal, reset])

  const submit = handleSubmit(async (values) => {
    await onSubmit(values, goal?.id)
    if (!goal) reset(defaults)
  })

  const currentScope = useWatch({ control, name: "scope" })

  const togglePlatform = (id: PlatformId) => {
    const next: PlatformId[] = currentScope.includes(id)
      ? currentScope.filter((p) => p !== id)
      : [...currentScope, id]
    if (next.length > 0) setValue("scope", next)
  }

  return (
    <Dialog open={open} onOpenChange={(next) => (!next ? onClose() : undefined)}>
      <DialogContent className="w-[min(94vw,760px)] max-h-[90vh] flex flex-col rounded-[28px] border-none bg-surface-overlay-strong p-0 overflow-hidden">
        <DialogDescription className="sr-only">
          Formulario para crear o editar un objetivo estratégico
        </DialogDescription>
        <div className="flex flex-col lg:grid lg:grid-cols-[0.92fr_1.08fr] overflow-hidden flex-1">
          <div className="dashboard-dark-panel dashboard-dark-panel-split shrink-0 overflow-hidden md:p-6">
            <h2 className="text-3xl font-black tracking-[-0.04em]">
              {goal ? t.app.goals.editObjective : t.app.goals.newObjective}
            </h2>
            <p className="mt-4 text-[14px] leading-7 text-white/85">
              {t.app.goals.customLibraryDesc}
            </p>

            <div className="mt-5 flex items-start gap-3 rounded-[22px] border border-white/20 bg-white/12 p-4 backdrop-blur-sm">
              <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20">
                <Sparkles className="h-4 w-4" />
              </div>
              <p className="text-[13px] leading-6 text-white/85">
                {t.app.goals.objectiveGoalHelp}
              </p>
            </div>
          </div>

          <div className="bg-surface-elevated p-5 md:p-6 overflow-y-auto custom-scrollbar flex-1 lg:max-h-[85vh]">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-primary-text">
                {goal ? t.app.goals.editObjective : t.app.goals.createObjective}
              </DialogTitle>
              <p className="text-[13px] leading-6 text-secondary-text">
                {t.app.goals.objectiveGoalHelp}
              </p>
            </DialogHeader>

            <form onSubmit={submit} className="mt-6 space-y-5">
              <Input
                label={t.app.goals.objectiveNamePlaceholder}
                error={errors.name?.message}
                {...register("name")}
              />

              <Controller
                name="canonicalGoal"
                control={control}
                render={({ field }) => (
                  <Select
                    label={t.app.goals.objectiveGoalLabel}
                    value={field.value}
                    options={goalOptions}
                    onChange={field.onChange}
                    triggerClassName="h-11 rounded-xl"
                  />
                )}
              />

              <div className="space-y-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-secondary-text">
                  {t.app.goals.scopeLabel}
                </p>
                <div className="flex flex-wrap gap-2">
                  {PLATFORMS.map((id) => {
                    const active = currentScope.includes(id)
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => togglePlatform(id)}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-all ${active
                          ? "border-accent-purple bg-accent-purple/15 text-accent-purple"
                          : "border-border-soft bg-surface-base text-secondary-text hover:text-primary-text"
                          }`}
                      >
                        {active && <Check className="h-3 w-3" />}
                        {platformLabels[id]}
                      </button>
                    )
                  })}
                </div>
                {errors.scope && <p className="text-[11px] text-red-500">{errors.scope.message}</p>}
              </div>

              <Textarea
                label={t.app.goals.strategyPromptLabel}
                placeholder={t.app.goals.strategyPromptPlaceholder}
                rows={3}
                error={errors.strategyPrompt?.message}
                {...register("strategyPrompt")}
              />

              <Textarea
                label={t.app.goals.descriptionOptional}
                placeholder={t.app.goals.objectiveDescriptionPlaceholder}
                rows={2}
                error={errors.description?.message}
                {...register("description")}
              />

              <DialogFooter className="pt-2">
                <Button type="button" variant="secondary" onClick={onClose}>
                  {t.app.common.cancel}
                </Button>
                <Button type="submit" disabled={isPending} className="px-8">
                  {isPending ? t.app.common.working : (goal ? t.app.profiles.edit : t.app.goals.createObjective)}
                </Button>
              </DialogFooter>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
})
