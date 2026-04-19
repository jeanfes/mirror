"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Sparkles, UserRound } from "lucide-react"
import { toast } from "sonner"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Textarea } from "@/components/ui/Textarea"
import { LoadingOverlay } from "@/components/ui/Loading"
import { StatePanel } from "@/components/ui/StatePanel"
import { useUserSettings } from "@/features/settings/hooks/useUserSettings"
import { notifyExtensionSettingsChanged } from "@/lib/extension-bridge"
import { ROUTES } from "@/lib/routes"
import { useLanguageStore } from "@/store/useLanguageStore"

export default function ProfessionalOnboardingPage() {
    const router = useRouter()
    const { t } = useLanguageStore()
    const { data: settings, isLoading, isError, updateSettings } = useUserSettings()

    const [personaBio, setPersonaBio] = useState("")
    const [isSaving, setIsSaving] = useState(false)

    const profilesCreateHref = useMemo(
        () => `${ROUTES.private.profiles}?create=1`,
        []
    )

    useEffect(() => {
        if (!settings) {
            return
        }

        const existingBio = settings.personaBio?.trim() ?? ""
        if (existingBio.length > 0) {
            router.replace(profilesCreateHref)
        }
    }, [profilesCreateHref, router, settings])

    const continueToProfileCreation = () => {
        router.replace(profilesCreateHref)
    }

    const handleContinue = async () => {
        const normalized = personaBio.trim()

        if (!normalized) {
            continueToProfileCreation()
            return
        }

        setIsSaving(true)

        try {
            await updateSettings({ personaBio: normalized })
            void notifyExtensionSettingsChanged({ force: true })
            toast.success(t.app.onboardingProfessional.savedToast)
            continueToProfileCreation()
        } catch {
            toast.error(t.app.settings.preferencesError)
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading || !settings) {
        return <LoadingOverlay show={true} />
    }

    if (isError) {
        return (
            <StatePanel
                tone="error"
                title={t.app.common.accountErrorTitle}
                description={t.app.common.accountErrorDesc}
            />
        )
    }

    return (
        <div className="space-y-6">
            <section className="workspace-hero-shell">
                <div aria-hidden="true" className="absolute -right-14 top-0 h-44 w-44 rounded-full workspace-hero-orb-purple" />
                <div aria-hidden="true" className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full workspace-hero-orb-cyan" />

                <div className="relative max-w-3xl">
                    <div className="inline-flex items-center gap-2 rounded-full border border-border-soft bg-surface-elevated px-3 py-1.5 text-[12px] font-semibold tracking-[0.08em] text-secondary-text uppercase">
                        <Sparkles className="h-3.5 w-3.5" />
                        {t.app.onboardingProfessional.badge}
                    </div>
                    <h1 className="mt-4 text-4xl font-black tracking-[-0.05em] text-primary-text md:text-5xl">
                        {t.app.onboardingProfessional.title}
                    </h1>
                    <p className="mt-4 max-w-2xl text-[15px] leading-7 text-secondary-text">
                        {t.app.onboardingProfessional.description}
                    </p>
                </div>
            </section>

            <Card className="dashboard-card-xl max-w-3xl">
                <div className="flex items-center gap-3">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-purple/12 text-accent-purple">
                        <UserRound className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="dashboard-overline">{t.app.settings.defaultsLabel}</p>
                        <h2 className="mt-1 text-[26px] font-semibold tracking-[-0.03em] text-primary-text">
                            {t.app.onboardingProfessional.question}
                        </h2>
                    </div>
                </div>

                <p className="mt-4 body-muted">
                    {t.app.onboardingProfessional.helper}
                </p>

                <div className="mt-6">
                    <Textarea
                        rows={6}
                        placeholder={t.app.onboardingProfessional.placeholder}
                        value={personaBio}
                        onChange={(event) => setPersonaBio(event.target.value)}
                    />
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={continueToProfileCreation}
                        disabled={isSaving}
                    >
                        {t.app.onboardingProfessional.skipAction}
                    </Button>

                    <Button
                        type="button"
                        onClick={handleContinue}
                        loading={isSaving}
                        loadingLabel={t.app.profileForm.saving}
                    >
                        {personaBio.trim().length > 0
                            ? t.app.onboardingProfessional.continueAction
                            : t.app.onboardingProfessional.continueWithoutBio}
                    </Button>
                </div>
            </Card>
        </div>
    )
}
