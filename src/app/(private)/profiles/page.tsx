"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Download, Layers3, MessageSquareQuote, Plus, WandSparkles, Star } from "lucide-react"
import { toast } from "sonner"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/Dialog"
import { Card } from "@/components/ui/Card"
import { LoadingOverlay } from "@/components/ui/Loading"
import { StatePanel } from "@/components/ui/StatePanel"
import { Textarea } from "@/components/ui/Textarea"
import { ProfileCard } from "@/features/profiles/components/ProfileCard"
import { ProfileFormDialog } from "@/features/profiles/components/ProfileFormDialog"
import { useProfiles } from "@/features/profiles/hooks/useProfiles"
import { useUserSettings } from "@/features/settings/hooks/useUserSettings"
import { startDataExport } from "@/features/settings/services/account-data.service"
import { notifyExtensionSettingsChanged } from "@/lib/extension-bridge"
import { ROUTES } from "@/lib/routes"
import { createClient } from "@/lib/supabase/client"
import type { CreateProfileInput } from "@/features/profiles/services/profiles.service"
import { useProfilesUIStore } from "@/store/useProfilesUIStore"
import { useLanguageStore } from "@/store/useLanguageStore"
import { useAccount } from "@/features/billing/hooks/useAccount"

export default function ProfilesPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const pendingCreateFromQueryRef = useRef(false)
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
    const { data: settings, updateSettings, isMutating: isSettingsMutating } = useUserSettings()
    const { quota } = useAccount()

    const { isDialogOpen, editingProfileId, openCreateDialog, openEditDialog, closeDialog } = useProfilesUIStore()

    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
    const [isExporting, setIsExporting] = useState(false)
    const [isPersonaBioPromptOpen, setIsPersonaBioPromptOpen] = useState(false)
    const [personaBioDraft, setPersonaBioDraft] = useState("")
    const [isSavingPersonaBio, setIsSavingPersonaBio] = useState(false)
    const [personaBioPromptDismissed, setPersonaBioPromptDismissed] = useState(false)
    const { t } = useLanguageStore()
    const supabase = createClient()

    const deleteTarget = useMemo(
        () => (profiles ? (profiles.find((p) => p.id === deleteTargetId) ?? null) : null),
        [profiles, deleteTargetId]
    )

    const editingProfile = useMemo(() => {
        if (!profiles || !editingProfileId) return null
        return profiles.find((profile) => profile.id === editingProfileId) ?? null
    }, [profiles, editingProfileId])

    useEffect(() => {
        if (searchParams.get("create") === "1") {
            pendingCreateFromQueryRef.current = true
        }
    }, [searchParams])

    const openCreateFlow = useCallback(() => {
        const hasProfiles = (profiles?.length ?? 0) > 0
        const hasPersonaBio = (settings?.personaBio?.trim().length ?? 0) > 0

        if (!hasProfiles && !hasPersonaBio && !personaBioPromptDismissed) {
            setPersonaBioDraft("")
            setIsPersonaBioPromptOpen(true)
            return
        }

        openCreateDialog()
    }, [openCreateDialog, personaBioPromptDismissed, profiles, settings?.personaBio])

    useEffect(() => {
        if (!pendingCreateFromQueryRef.current) {
            return
        }

        if (isLoading || isDialogOpen || isPersonaBioPromptOpen) {
            return
        }

        pendingCreateFromQueryRef.current = false
        openCreateFlow()
        router.replace(ROUTES.private.profiles)
    }, [isDialogOpen, isLoading, isPersonaBioPromptOpen, openCreateFlow, router])

    const continueToProfileDialog = () => {
        setIsPersonaBioPromptOpen(false)
        setPersonaBioPromptDismissed(true)
        openCreateDialog()
    }

    const handleSavePersonaBio = async () => {
        const normalized = personaBioDraft.trim()

        if (!normalized) {
            continueToProfileDialog()
            return
        }

        setIsSavingPersonaBio(true)

        try {
            await updateSettings({ personaBio: normalized })
            void notifyExtensionSettingsChanged({ force: true })
            toast.success(t.app.onboardingProfessional.savedToast)
            continueToProfileDialog()
        } catch {
            toast.error(t.app.settings.preferencesError)
        } finally {
            setIsSavingPersonaBio(false)
        }
    }

    const handleSubmit = async (values: CreateProfileInput, profileId?: string) => {
        try {
            if (profileId) {
                await updateProfile({ ...values, id: profileId })
                toast.success(t.app.common.profileUpdated)
            } else {
                await createProfile(values)
                toast.success(t.app.common.profileCreated)
            }

            closeDialog()
        } catch (error: unknown) {
            if ((error as { message?: string })?.message?.includes("profile_limit_reached")) {
                toast.error(t.app.common.profileLimitReached ?? "Has alcanzado el límite de perfiles de tu plan. Pásate a Pro para crear más.")
                return
            }
            toast.error(t.app.common.profileSaveError)
        }
    }

    const handleToggle = async (profileId: string) => {
        const profile = profiles?.find((p) => p.id === profileId)
        if (!profile) return

        try {
            await toggleProfile(profileId, profile.enabled)
            toast.success(t.app.common.profileStatusUpdated)
        } catch {
            toast.error(t.app.common.profileStatusError)
        }
    }

    const handleDelete = (profileId: string) => {
        setDeleteTargetId(profileId)
    }

    const handleConfirmDelete = async () => {
        if (!deleteTargetId) return
        try {
            await deleteProfile(deleteTargetId)
            toast.success(t.app.common.profileDeleted)
        } catch {
            toast.error(t.app.common.profileDeleteError)
        } finally {
            setDeleteTargetId(null)
        }
    }

    const handleExportOne = async (profileId: string) => {
        try {
            setIsExporting(true)
            const downloadUrl = await startDataExport(supabase, { profiles: [profileId], objectives: [] })
            if (downloadUrl) {
                const link = document.createElement("a")
                link.href = downloadUrl
                link.download = `mirror-export-profile.json`
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                setTimeout(() => URL.revokeObjectURL(downloadUrl), 500)
            }
            toast.success(t.app.settingsModal.backupStarted)
        } catch {
            toast.error(t.app.common.exportError)
        } finally {
            setIsExporting(false)
        }
    }

    const handleExportAll = async () => {
        try {
            setIsExporting(true)
            const allIds = profiles ? profiles.map(p => p.id) : []
            const downloadUrl = await startDataExport(supabase, { profiles: allIds, objectives: [] })
            if (downloadUrl) {
                const link = document.createElement("a")
                link.href = downloadUrl
                link.download = `mirror-export-profiles.json`
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                setTimeout(() => URL.revokeObjectURL(downloadUrl), 500)
            }
            toast.success(t.app.settingsModal.backupStarted)
        } catch {
            toast.error(t.app.common.exportError)
        } finally {
            setIsExporting(false)
        }
    }

    if (isLoading || !profiles) {
        return <LoadingOverlay show={true} />
    }

    if (isError) {
        return (
            <StatePanel
                tone="error"
                title={t.app.common.profilesErrorTitle}
                description={t.app.common.profilesErrorDesc}
            />
        )
    }

    const list = profiles ?? []
    const activeProfiles = list.filter((profile) => profile.enabled).length

    return (
        <div className="space-y-6">
            <section className="workspace-hero-shell">
                <div aria-hidden="true" className="absolute -right-14 top-0 h-44 w-44 rounded-full workspace-hero-orb-purple" />
                <div aria-hidden="true" className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full workspace-hero-orb-cyan" />

                <div className="relative grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
                    <div className="max-w-2xl">
                        <h1 className="max-w-xl text-4xl font-black tracking-[-0.05em] text-primary-text md:text-5xl">
                            {t.app.profiles.heroTitle}
                        </h1>
                        <p className="mt-4 max-w-xl text-[15px] leading-7 text-secondary-text">
                            {t.app.profiles.heroDesc}
                        </p>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <div className="workspace-hero-chip">
                                <MessageSquareQuote className="h-4 w-4 text-primary-text" />
                                {t.app.profiles.chip1}
                            </div>
                            <div className="workspace-hero-chip">
                                <Layers3 className="h-4 w-4 text-primary-text" />
                                {t.app.profiles.chip2}
                            </div>
                            <div className="workspace-hero-chip">
                                <Star className="h-4 w-4 text-primary-text" />
                                {t.app.profiles.chip3}
                            </div>
                        </div>
                    </div>

                    <div className="dashboard-dark-panel p-5">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-white/60">{t.app.profiles.profileCoverage}</p>
                                <p className="mt-2 text-3xl font-black tracking-[-0.04em]">
                                    {list.length}
                                    {quota && (
                                        <span className="text-xl text-white/40 ml-1.5 font-bold">/ {quota.max_profiles ?? "∞"}</span>
                                    )}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                {list.length > 0 && (
                                    <Button onClick={handleExportAll} disabled={isExporting} className="hidden sm:inline-flex bg-white/5 border-white/5 text-white hover:bg-white/10" variant="secondary">
                                        <Download className="mr-2 h-4 w-4" />
                                        {t.app.settingsModal.tabExport}
                                    </Button>
                                )}
                                <Button
                                    onClick={openCreateFlow}
                                    className="bg-surface-elevated text-primary-text hover:bg-surface-hover border border-border-soft disabled:opacity-50"
                                    disabled={quota ? list.length >= (quota.max_profiles ?? 999) : false}
                                >
                                    <Plus className="h-4 w-4" />
                                    {t.app.profiles.newProfile}
                                </Button>
                            </div>
                        </div>

                        <div className="mt-6">
                            <div>
                                <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-white/50">{t.app.profiles.activeNow}</p>
                                <p className="mt-2 text-2xl font-black tracking-[-0.03em]">{activeProfiles}</p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
                <Card className="rounded-3xl p-5">
                    <p className="dashboard-overline">{t.app.profiles.role}</p>
                    <p className="mt-2 text-lg font-bold text-primary-text">{t.app.profiles.identitySystem}</p>
                    <p className="mt-2 body-muted">{t.app.profiles.identitySystemDesc}</p>
                </Card>
                <Card className="rounded-3xl p-5">
                    <p className="dashboard-overline">{t.app.profiles.bestPractice}</p>
                    <p className="mt-2 text-lg font-bold text-primary-text">{t.app.profiles.threeExamples}</p>
                    <p className="mt-2 body-muted">{t.app.profiles.threeExamplesDesc}</p>
                </Card>
                <Card className="rounded-3xl p-5">
                    <p className="dashboard-overline">{t.app.profiles.outcome}</p>
                    <p className="mt-2 text-lg font-bold text-primary-text">{t.app.profiles.fasterDaily}</p>
                    <p className="mt-2 body-muted">{t.app.profiles.fasterDailyDesc}</p>
                </Card>
            </section>

            {list.length === 0 ? (
                <StatePanel
                    icon={<WandSparkles className="h-6 w-6 text-primary-text" />}
                    title={t.app.common.profilesEmptyTitle}
                    description={t.app.common.profilesEmptyDesc}
                    actionLabel={t.app.common.profilesEmptyAction}
                    onAction={openCreateFlow}
                />
            ) : (
                <section className="space-y-3">
                    <div className="flex items-end justify-between gap-3">
                        <div>
                            <h2 className="text-2xl font-bold tracking-[-0.03em] text-primary-text">{t.app.profiles.libraryTitle}</h2>
                            <p className="mt-1 text-[14px] text-secondary-text">{t.app.profiles.libraryDesc}</p>
                        </div>
                        <div className="hidden rounded-full border border-border-soft bg-surface-base px-3 py-1.5 text-[12px] font-semibold text-secondary-text md:inline-flex md:items-center md:gap-1.5">
                            <Star className="h-3.5 w-3.5 text-accent-purple" />
                            {t.app.profiles.strongerProfilesHint}
                        </div>
                    </div>

                    <div className="grid gap-4 xl:grid-cols-2">
                        {list.map((profile) => (
                            <ProfileCard
                                key={profile.id}
                                profile={profile}
                                onEdit={openEditDialog}
                                onToggle={handleToggle}
                                onExport={handleExportOne}
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
                quota={quota}
            />

            <Dialog open={isPersonaBioPromptOpen} onOpenChange={setIsPersonaBioPromptOpen}>
                <DialogContent className="w-[min(92vw,640px)] rounded-3xl bg-surface-elevated p-0">
                    <DialogHeader className="border-b border-border-soft px-6 py-5">
                        <DialogTitle className="text-[22px] font-semibold tracking-[-0.03em] text-primary-text">
                            {t.app.onboardingProfessional.firstProfileTitle}
                        </DialogTitle>
                        <DialogDescription className="mt-2 text-[14px] leading-6 text-secondary-text">
                            {t.app.onboardingProfessional.firstProfileDesc}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="px-6 pb-6 pt-5">
                        <Textarea
                            rows={5}
                            placeholder={t.app.onboardingProfessional.placeholder}
                            value={personaBioDraft}
                            onChange={(event) => setPersonaBioDraft(event.target.value)}
                        />

                        <DialogFooter className="mt-5">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={continueToProfileDialog}
                                disabled={isSavingPersonaBio || isSettingsMutating}
                            >
                                {t.app.onboardingProfessional.skipAction}
                            </Button>

                            <Button
                                type="button"
                                onClick={handleSavePersonaBio}
                                loading={isSavingPersonaBio || isSettingsMutating}
                                loadingLabel={t.app.profileForm.saving}
                            >
                                {personaBioDraft.trim().length > 0
                                    ? t.app.onboardingProfessional.continueAction
                                    : t.app.onboardingProfessional.continueWithoutBio}
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>

            <ConfirmDialog
                open={deleteTargetId !== null}
                title={t.app.profiles.deleteDialogTitle}
                description={
                    deleteTarget
                        ? t.app.profiles.deleteDialogDescMatch.replace("{0}", deleteTarget.name)
                        : t.app.profiles.deleteDialogDescFallback
                }
                confirmLabel={t.app.profiles.deleteConfirm}
                cancelLabel={t.app.profileForm.cancel}
                isPending={isMutating}
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteTargetId(null)}
            />
        </div>
    )
}
