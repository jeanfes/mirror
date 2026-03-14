"use client"

import { useMemo } from "react"
import { Layers3, MessageSquareQuote, Plus, Sparkles, Stars } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { ProfileCard } from "@/features/profiles/components/ProfileCard"
import { ProfileFormDialog } from "@/features/profiles/components/ProfileFormDialog"
import { useProfiles } from "@/features/profiles/hooks/useProfiles"
import type { CreateProfileInput } from "@/features/profiles/services/profiles.local.service"
import { useProfilesUIStore } from "@/store/useProfilesUIStore"

export default function ProfilesPage() {
    const {
        data: profiles,
        isLoading,
        isError,
        createProfile,
        updateProfile,
        toggleProfile,
        deleteProfile,
        isMutating
    } = useProfiles()

    const { isDialogOpen, editingProfileId, openCreateDialog, openEditDialog, closeDialog } = useProfilesUIStore()

    const editingProfile = useMemo(() => {
        if (!profiles || !editingProfileId) return null
        return profiles.find((profile) => profile.id === editingProfileId) ?? null
    }, [profiles, editingProfileId])

    const handleSubmit = async (values: CreateProfileInput, profileId?: string) => {
        try {
            if (profileId) {
                await updateProfile({ ...values, id: profileId })
                toast.success("Profile updated")
            } else {
                await createProfile(values)
                toast.success("Profile created")
            }

            closeDialog()
        } catch {
            toast.error("Could not save profile")
        }
    }

    const handleToggle = async (profileId: string) => {
        try {
            await toggleProfile(profileId)
            toast.success("Profile status updated")
        } catch {
            toast.error("Could not update profile status")
        }
    }

    const handleDelete = async (profileId: string) => {
        if (!window.confirm("Delete this profile? This action cannot be undone.")) return

        try {
            await deleteProfile(profileId)
            toast.success("Profile deleted")
        } catch {
            toast.error("Could not delete profile")
        }
    }

    if (isLoading) {
        return (
            <Card className="p-5">
                <p className="text-[14px] text-slate-500">Loading profiles...</p>
            </Card>
        )
    }

    if (isError) {
        return (
            <Card className="p-5">
                <p className="text-[14px] text-red-600">Could not load profiles.</p>
            </Card>
        )
    }

    const list = profiles ?? []
    const activeProfiles = list.filter((profile) => profile.enabled).length
    const emojiReadyProfiles = list.filter((profile) => profile.allowEmojis).length

    return (
        <div className="space-y-6">
            <section className="relative overflow-hidden rounded-4xl border border-[#E8ECF4] bg-[linear-gradient(135deg,rgba(255,255,255,0.9),rgba(214,210,240,0.35)_40%,rgba(117,206,243,0.2)_100%)] p-6 shadow-premium-md md:p-8">
                <div aria-hidden="true" className="absolute -right-14 top-0 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.24),transparent_72%)]" />
                <div aria-hidden="true" className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(117,206,243,0.28),transparent_74%)]" />

                <div className="relative grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/75 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-700 backdrop-blur-sm">
                            <Sparkles className="h-3.5 w-3.5 text-[#8B5CF6]" />
                            Voice studio
                        </div>
                        <h1 className="mt-4 max-w-xl text-4xl font-black tracking-[-0.05em] text-[#141824] md:text-5xl">
                            Build the voices your extension comments with.
                        </h1>
                        <p className="mt-4 max-w-xl text-[15px] leading-7 text-slate-600">
                            Profiles are the identity layer of Mirror. Each one defines tone, posture and sample phrasing so your comment suggestions feel consistent instead of generic.
                        </p>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <div className="inline-flex items-center gap-2 rounded-2xl border border-white/80 bg-white/80 px-4 py-3 text-[13px] font-medium text-slate-700 shadow-premium-sm">
                                <MessageSquareQuote className="h-4 w-4 text-[#141824]" />
                                Tone-led comments
                            </div>
                            <div className="inline-flex items-center gap-2 rounded-2xl border border-white/80 bg-white/80 px-4 py-3 text-[13px] font-medium text-slate-700 shadow-premium-sm">
                                <Layers3 className="h-4 w-4 text-[#141824]" />
                                Multiple posting angles
                            </div>
                            <div className="inline-flex items-center gap-2 rounded-2xl border border-white/80 bg-white/80 px-4 py-3 text-[13px] font-medium text-slate-700 shadow-premium-sm">
                                <Stars className="h-4 w-4 text-[#141824]" />
                                Reusable brand voices
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[28px] border border-[#E8ECF4] bg-[linear-gradient(180deg,rgba(23,27,45,0.98),rgba(23,27,45,0.92))] p-5 text-white shadow-[0_18px_50px_rgba(15,19,32,0.16)]">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-white/60">Profile coverage</p>
                                <p className="mt-2 text-3xl font-black tracking-[-0.04em]">{list.length}</p>
                            </div>
                            <Button onClick={openCreateDialog} className="bg-white text-[#141824] hover:bg-white/92">
                                <Plus className="h-4 w-4" />
                                New profile
                            </Button>
                        </div>

                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            <div>
                                <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-white/50">Active now</p>
                                <p className="mt-2 text-2xl font-black tracking-[-0.03em]">{activeProfiles}</p>
                            </div>
                            <div>
                                <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-white/50">Emoji ready</p>
                                <p className="mt-2 text-2xl font-black tracking-[-0.03em]">{emojiReadyProfiles}</p>
                            </div>
                        </div>

                        <p className="mt-5 text-[13px] leading-6 text-white/68">
                            The best profile set mixes one reliable default voice with one or two more opinionated tones for different post contexts.
                        </p>
                    </div>
                </div>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
                <Card className="rounded-3xl p-5">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-500">Role</p>
                    <p className="mt-2 text-lg font-bold text-[#141824]">Identity system</p>
                    <p className="mt-2 text-[14px] leading-6 text-slate-600">Profiles make the extension feel opinionated and consistent instead of random on every generation.</p>
                </Card>
                <Card className="rounded-3xl p-5">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-500">Best practice</p>
                    <p className="mt-2 text-lg font-bold text-[#141824]">Three clear examples</p>
                    <p className="mt-2 text-[14px] leading-6 text-slate-600">A good profile gives enough sample phrasing to guide tone without overfitting every response.</p>
                </Card>
                <Card className="rounded-3xl p-5">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-500">Outcome</p>
                    <p className="mt-2 text-lg font-bold text-[#141824]">Faster daily use</p>
                    <p className="mt-2 text-[14px] leading-6 text-slate-600">When the voices are strong, choosing a comment direction becomes much faster inside the extension.</p>
                </Card>
            </section>

            {list.length === 0 ? (
                <Card className="rounded-4xl p-8 text-center">
                    <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(135deg,rgba(139,92,246,0.16),rgba(117,206,243,0.18))]">
                        <Sparkles className="h-6 w-6 text-[#141824]" />
                    </div>
                    <h2 className="mt-4 text-2xl font-bold tracking-[-0.03em] text-[#141824]">No profiles yet</h2>
                    <p className="mx-auto mt-3 max-w-xl text-[14px] leading-7 text-slate-600">
                        Start with one default voice that sounds like your best professional self. You can add more nuanced profiles once the workflow feels natural.
                    </p>
                    <Button className="mt-5" onClick={openCreateDialog}>
                        <Plus className="h-4 w-4" />
                        Create your first profile
                    </Button>
                </Card>
            ) : (
                <section className="space-y-3">
                    <div className="flex items-end justify-between gap-3">
                        <div>
                            <h2 className="text-2xl font-bold tracking-[-0.03em] text-[#141824]">Your voice library</h2>
                            <p className="mt-1 text-[14px] text-slate-600">Each card should feel like a distinct commenting posture you can deploy on demand.</p>
                        </div>
                        <div className="hidden rounded-full border border-[#E8ECF4] bg-white/70 px-3 py-1.5 text-[12px] font-semibold text-slate-600 md:inline-flex md:items-center md:gap-1.5">
                            <Stars className="h-3.5 w-3.5 text-[#8B5CF6]" />
                            Stronger profiles create better generations
                        </div>
                    </div>

                    <div className="grid gap-4 xl:grid-cols-2">
                        {list.map((profile) => (
                            <ProfileCard
                                key={profile.id}
                                profile={profile}
                                onEdit={openEditDialog}
                                onToggle={handleToggle}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                </section>
            )}

            <ProfileFormDialog
                open={isDialogOpen}
                profile={editingProfile}
                isPending={isMutating}
                onClose={closeDialog}
                onSubmit={handleSubmit}
            />
        </div>
    )
}
