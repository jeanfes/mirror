"use client"

import { useEffect } from "react"
import { z } from "zod"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Lightbulb, Sparkles } from "lucide-react"
import type { Persona } from "@/types/dashboard"
import type { CreateProfileInput } from "@/features/profiles/services/profiles.local.service"
import { Button } from "@/components/ui/Button"
import { Toggle } from "@/components/ui/Toggle"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/Dialog"

const profileSchema = z.object({
    name: z.string().min(2, "Name is required"),
    description: z.string().min(8, "Add a clearer description"),
    tone: z.string().min(3, "Tone is required"),
    example1: z.string().min(6, "Example 1 is too short"),
    example2: z.string().min(6, "Example 2 is too short"),
    example3: z.string().min(6, "Example 3 is too short"),
    allowEmojis: z.boolean(),
    enabled: z.boolean()
})

type ProfileFormValues = z.infer<typeof profileSchema>

interface ProfileFormDialogProps {
    open: boolean
    profile: Persona | null
    isPending: boolean
    onClose: () => void
    onSubmit: (values: CreateProfileInput, profileId?: string) => Promise<void>
}

const defaults: ProfileFormValues = {
    name: "",
    description: "",
    tone: "",
    example1: "",
    example2: "",
    example3: "",
    allowEmojis: false,
    enabled: true
}

export function ProfileFormDialog({ open, profile, isPending, onClose, onSubmit }: ProfileFormDialogProps) {
    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: defaults
    })

    useEffect(() => {
        if (!open) return

        if (profile) {
            reset({
                name: profile.name,
                description: profile.description,
                tone: profile.tone,
                example1: profile.examples[0],
                example2: profile.examples[1],
                example3: profile.examples[2],
                allowEmojis: profile.allowEmojis,
                enabled: profile.enabled
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
            <DialogContent className="w-[min(94vw,760px)] rounded-[28px] p-0 overflow-hidden">
                <div className="grid lg:grid-cols-[0.92fr_1.08fr]">
                    <div className="overflow-hidden rounded-t-[28px] border-b border-[#E8ECF4] bg-[linear-gradient(180deg,rgba(23,27,45,0.98),rgba(23,27,45,0.92))] p-6 text-white lg:rounded-t-none lg:rounded-l-[28px] lg:border-b-0 lg:border-r">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/84 ring-1 ring-white/10">
                            <Sparkles className="h-3.5 w-3.5" />
                            Voice editor
                        </div>
                        <h2 className="mt-4 text-3xl font-black tracking-[-0.04em]">
                            {profile ? "Refine this voice" : "Create a new voice"}
                        </h2>
                        <p className="mt-4 text-[14px] leading-7 text-white/85">
                            Good profiles are specific enough to guide tone and flexible enough to work across different LinkedIn posts.
                        </p>

                        <div className="mt-6 rounded-[22px] border border-white/20 bg-white/12 p-4 backdrop-blur-sm">
                            <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-white/85">What makes a strong profile</p>
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
                                Mirror works best when each profile sounds like a repeatable professional persona, not just a different adjective.
                            </p>
                        </div>
                    </div>

                    <div className="p-5 md:p-6">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-semibold text-primary-text">
                                {profile ? "Edit profile" : "Create profile"}
                            </DialogTitle>
                            <p className="text-[13px] leading-6 text-slate-600">Define voice, tone and three sample comments for consistent generation.</p>
                        </DialogHeader>

                        <form className="space-y-4" onSubmit={submit}>
                            <div className="space-y-1">
                                <label className="text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-600">Name</label>
                                <input
                                    {...register("name")}
                                    className="h-11 w-full rounded-2xl border border-border-soft bg-white px-3 text-[14px] outline-none focus:ring-2 focus:ring-accent-purple/30"
                                    placeholder="Example: Insight Architect"
                                />
                                {errors.name ? <p className="text-[12px] text-danger">{errors.name.message}</p> : null}
                            </div>

                            <div className="space-y-1">
                                <label className="text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-600">Description</label>
                                <textarea
                                    {...register("description")}
                                    rows={2}
                                    className="w-full rounded-2xl border border-border-soft bg-white px-3 py-3 text-[14px] outline-none focus:ring-2 focus:ring-accent-purple/30"
                                    placeholder="What kind of perspective does this profile bring?"
                                />
                                {errors.description ? <p className="text-[12px] text-danger">{errors.description.message}</p> : null}
                            </div>

                            <div className="space-y-1">
                                <label className="text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-600">Tone</label>
                                <input
                                    {...register("tone")}
                                    className="h-11 w-full rounded-2xl border border-border-soft bg-white px-3 text-[14px] outline-none focus:ring-2 focus:ring-accent-purple/30"
                                    placeholder="Confident, practical, concise"
                                />
                                {errors.tone ? <p className="text-[12px] text-danger">{errors.tone.message}</p> : null}
                            </div>

                            <div className="rounded-3xl border border-border-soft bg-white/70 p-4">
                                <label className="text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-600">Example comments</label>
                                <p className="mt-1 text-[13px] text-slate-600">Use three short examples that feel ready to post, not abstract instructions.</p>

                                <div className="mt-3 grid gap-3">
                                    <textarea {...register("example1")} rows={2} className="w-full rounded-2xl border border-border-soft bg-white px-3 py-3 text-[14px] outline-none focus:ring-2 focus:ring-accent-purple/30" placeholder="Example #1" />
                                    {errors.example1 ? <p className="-mt-1 text-[12px] text-danger">{errors.example1.message}</p> : null}
                                    <textarea {...register("example2")} rows={2} className="w-full rounded-2xl border border-border-soft bg-white px-3 py-3 text-[14px] outline-none focus:ring-2 focus:ring-accent-purple/30" placeholder="Example #2" />
                                    {errors.example2 ? <p className="-mt-1 text-[12px] text-danger">{errors.example2.message}</p> : null}
                                    <textarea {...register("example3")} rows={2} className="w-full rounded-2xl border border-border-soft bg-white px-3 py-3 text-[14px] outline-none focus:ring-2 focus:ring-accent-purple/30" placeholder="Example #3" />
                                    {errors.example3 ? <p className="-mt-1 text-[12px] text-danger">{errors.example3.message}</p> : null}
                                </div>
                            </div>

                            <div className="grid gap-2 md:grid-cols-2">
                                <Controller
                                    name="allowEmojis"
                                    control={control}
                                    render={({ field }) => (
                                        <Toggle checked={field.value} onChange={field.onChange} label="Allow emojis" />
                                    )}
                                />
                                <Controller
                                    name="enabled"
                                    control={control}
                                    render={({ field }) => (
                                        <Toggle checked={field.value} onChange={field.onChange} label="Profile enabled" />
                                    )}
                                />
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="secondary" onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isPending}>
                                    {isPending ? "Saving..." : profile ? "Save changes" : "Create profile"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
