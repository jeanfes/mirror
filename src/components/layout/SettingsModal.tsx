import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "motion/react"
import { toast } from "sonner"
import {
    BadgeCheck,
    Bell,
    Download,
    ExternalLink,
    LogOut,
    Shield,
    Trash2,
    Settings,
    Palette,
    User,
} from "lucide-react"

import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Select } from "@/components/ui/Select"
import { LoadingOverlay } from "@/components/ui/Loading"
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs"
import { Toggle } from "@/components/ui/Toggle"
import { Input } from "@/components/ui/Input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/Dialog"
import { ThemeSegmentedControl } from "@/components/ui/ThemeToggle"
import { useLogout } from "@/features/auth/hooks/useLogout"
import { useLanguageStore } from "@/store/useLanguageStore"
import { useUserSettings } from "@/features/settings/hooks/useUserSettings"
import { useTheme } from "../providers/ThemeProvider"
import { ChangePasswordModal } from "@/features/auth/components/ChangePasswordModal"
import type { ThemePreference } from "@/lib/theme"

interface SettingsModalProps {
    children: React.ReactNode
    open?: boolean
    onOpenChange?: (open: boolean) => void
    user?: {
        name: string
        email: string
        avatar?: string
    }
}

export default function SettingsModal({ children, open, onOpenChange, user = { name: "User Name", email: "user@example.com" } }: SettingsModalProps) {

    const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false)
    const [isDeleteAccountConfirmOpen, setIsDeleteAccountConfirmOpen] = useState(false)
    const { logout, isPending: isLogoutPending } = useLogout()
    const { themePreference, setThemePreference } = useTheme()
    const { t, language, setLanguage } = useLanguageStore()
    const { updateSettings } = useUserSettings()

    const mapThemePreferenceToSettingsTheme = (preference: ThemePreference): "light" | "dark" | "auto" => {
        return preference === "system" ? "auto" : preference
    }

    const handleThemeChange = async (nextPreference: ThemePreference) => {
        const previousPreference = themePreference

        try {
            await updateSettings({ theme: mapThemePreferenceToSettingsTheme(nextPreference) })
        } catch {
            setThemePreference(previousPreference)
            toast.error("Could not save theme to profile")
        }
    }

    const handleLogout = async () => {
        await logout()
    }

    const handleDeleteAccountConfirm = async () => {
        setIsDeleteAccountConfirmOpen(false)
    }

    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)

    return (
        <>
            <Dialog open={open} onOpenChange={(nextOpen) => {
                if (!isLogoutPending) {
                    onOpenChange?.(nextOpen)
                }
            }}>
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>
                <DialogContent className="max-w-4xl p-0 h-[80vh] flex flex-col sm:h-162.5">
                    <DialogTitle className="sr-only">{t.app.settingsModal.title}</DialogTitle>
                    <DialogDescription className="sr-only">Manage your account settings and preferences</DialogDescription>
                    <Tabs defaultValue="general" className="flex-1 flex flex-col overflow-hidden">
                        <div className="flex flex-col sm:flex-row flex-1 overflow-hidden">

                            <div className="w-full sm:w-70 shrink-0 border-b sm:border-b-0 sm:border-r border-border-soft bg-surface-overlay p-4 sm:p-5 backdrop-blur-sm flex flex-col z-10">
                                <div className="hidden sm:flex items-center gap-3 px-2 mb-8 mt-2">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-elevated border border-border-soft text-primary-text shadow-premium-sm">
                                        <Settings className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-[17px] font-bold tracking-tight text-primary-dark">{t.app.settingsModal.title}</h2>
                                        <p className="text-[11px] font-medium text-secondary-text uppercase tracking-wider">{t.app.settingsModal.subtitle}</p>
                                    </div>
                                </div>

                                <TabsList className="flex-row sm:flex-col h-auto items-center sm:items-stretch justify-start rounded-none border-0 bg-transparent p-0 sm:space-y-1.5 focus:outline-none overflow-x-auto overflow-y-hidden sm:overflow-visible custom-scrollbar pb-2 sm:pb-0 gap-2 sm:gap-0">
                                    <TabsTrigger value="general" className="settings-nav-trigger shrink-0">
                                        <User className="h-4.5 w-4.5" />
                                        General
                                    </TabsTrigger>
                                    <TabsTrigger value="appearance" className="settings-nav-trigger">
                                        <Palette className="h-4.5 w-4.5" />
                                        Appearance
                                    </TabsTrigger>
                                    <TabsTrigger value="security" className="settings-nav-trigger">
                                        <Shield className="h-4.5 w-4.5" />
                                        Security
                                    </TabsTrigger>
                                    <TabsTrigger value="notifications" className="settings-nav-trigger">
                                        <Bell className="h-4.5 w-4.5" />
                                        Alerts
                                    </TabsTrigger>
                                    <TabsTrigger value="data" className="settings-nav-trigger shrink-0">
                                        <Download className="h-4.5 w-4.5" />
                                        Export
                                    </TabsTrigger>

                                    <div className="hidden sm:block pt-8 mt-auto space-y-2">
                                        <Button type="button" variant="dangerSoft" className="w-full justify-start" onClick={() => setIsLogoutConfirmOpen(true)} disabled={isLogoutPending}>
                                            <LogOut className="h-4 w-4 shrink-0 stroke-[2.2]" />
                                            <span>{isLogoutPending ? "Logging out..." : "Log out"}</span>
                                        </Button>
                                        <div className="px-4 py-2 opacity-50">
                                            <p className="text-[10px] font-bold text-secondary-text uppercase tracking-widest">Version 1.0.4</p>
                                        </div>
                                    </div>
                                </TabsList>
                            </div>


                            <div className="flex-1 overflow-y-auto custom-scrollbar bg-surface-base p-5 sm:px-10 sm:py-10 backdrop-blur-sm">
                                <AnimatePresence>

                                    <TabsContent value="general" key="general" asChild>
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.1 }}
                                            className="mt-0 space-y-8 outline-none"
                                        >
                                            <div className="space-y-1">
                                                <h3 className="settings-section-title">{t.app.settingsModal.generalInfoTitle}</h3>
                                                <p className="settings-section-description">{t.app.settingsModal.generalInfoDesc}</p>
                                            </div>

                                            <Card className="p-6 space-y-6">
                                                <div className="flex items-center gap-5">
                                                    <div className="group relative h-20 w-20 shrink-0">
                                                        <div className="h-full w-full rounded-3xl bg-linear-to-br from-[#171b2d] to-[#2d334d] flex items-center justify-center text-white text-3xl font-bold shadow-premium-lg">
                                                            {user.avatar ? (
                                                                <Image src={user.avatar} alt={`${user.name} avatar`} fill className="rounded-3xl object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                                                            ) : user.name.charAt(0)}
                                                        </div>
                                                        <button className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-xl bg-surface-elevated text-accent-purple shadow-premium-sm ring-1 ring-border-soft hover:scale-110 transition-transform">
                                                            <BadgeCheck className="h-4 w-4 fill-accent-purple text-white" />
                                                        </button>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <h4 className="font-bold text-primary-text">{user.name}</h4>
                                                        <p className="text-xs text-secondary-text font-medium">{user.email}</p>
                                                    </div>
                                                </div>

                                                <div className="grid gap-5">
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        <Input
                                                            disabled
                                                            label={t.app.settingsModal.fullName}
                                                            defaultValue={user.name}
                                                        />
                                                        <Input
                                                            disabled
                                                            label={t.app.settingsModal.emailAddress}
                                                            defaultValue={user.email}
                                                        />
                                                    </div>

                                                    <div className="pt-2">
                                                        <Select
                                                            label={t.app.settingsModal.appLanguage}
                                                            value={language}
                                                            onChange={async (val) => {
                                                                const newLang = val as "en" | "es" | "pt" | "fr" | "de";
                                                                try {
                                                                    await updateSettings({ language: newLang });
                                                                    setLanguage(newLang);
                                                                    toast.success("Language preference updated");
                                                                } catch {
                                                                    toast.error("Could not save language to profile");
                                                                }
                                                            }}
                                                            options={[
                                                                { label: "English", value: "en" },
                                                                { label: "Español", value: "es" },
                                                                { label: "Português", value: "pt" },
                                                                { label: "Français", value: "fr" },
                                                                { label: "Deutsch", value: "de" }
                                                            ]}
                                                        />
                                                    </div>
                                                </div>
                                            </Card>
                                        </motion.div>
                                    </TabsContent>


                                    <TabsContent value="appearance" key="appearance" asChild>
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.1 }}
                                            className="mt-0 space-y-8 outline-none"
                                        >
                                            <div className="space-y-1">
                                                <h3 className="settings-section-title">{t.app.settingsModal.appearanceTitle}</h3>
                                                <p className="settings-section-description">{t.app.settingsModal.appearanceDesc}</p>
                                            </div>

                                            <Card className="p-6 sm:p-7">
                                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                                    <div>
                                                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-secondary-text">{t.app.settingsModal.activeTheme}</p>
                                                        <p className="mt-1 text-[14px] font-semibold text-primary-text">
                                                            {themePreference === "system"
                                                                ? `System`
                                                                : `${themePreference === "dark" ? "Dark" : "Light"} mode`}
                                                        </p>
                                                    </div>
                                                    <ThemeSegmentedControl className="w-full sm:w-auto" onChange={handleThemeChange} />
                                                </div>

                                                <p className="mt-4 text-[12px] leading-5 text-secondary-text">
                                                    {t.app.settingsModal.themeDesc}
                                                </p>
                                            </Card>
                                        </motion.div>
                                    </TabsContent>


                                    <TabsContent value="security" key="security" asChild>
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.1 }}
                                            className="mt-0 space-y-8 outline-none"
                                        >
                                            <div className="space-y-1">
                                                <h3 className="settings-section-title">{t.app.settingsModal.securityTitle}</h3>
                                                <p className="settings-section-description">{t.app.settingsModal.securityDesc}</p>
                                            </div>

                                            <div className="grid gap-4">
                                                <Card className="settings-card-row">
                                                    <div className="flex items-center gap-5">
                                                        <div className="h-12 w-12 rounded-2xl bg-accent-blue/12 flex items-center justify-center text-accent-blue">
                                                            <Shield className="h-5.5 w-5.5" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[15px] font-bold text-primary-text">{t.app.settingsModal.masterPassword}</p>
                                                            <p className="text-xs text-secondary-text font-medium">Last updated March 2026</p>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="secondary"
                                                        className="font-bold h-9 px-5"
                                                        onClick={() => setIsChangePasswordOpen(true)}
                                                    >
                                                        Update
                                                    </Button>
                                                </Card>

                                                <div className="rounded-2xl border border-border-soft bg-surface-base/50 p-5 mt-2">
                                                    <h4 className="text-[13px] font-bold text-primary-text mb-3 uppercase tracking-wider">{t.app.settingsModal.securityBestPractices}</h4>
                                                    <ul className="space-y-2.5 text-[13px] text-secondary-text">
                                                        <li className="flex items-start gap-3">
                                                            <div className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent-blue" />
                                                            <span>{t.app.settingsModal.securityBp1}</span>
                                                        </li>
                                                        <li className="flex items-start gap-3">
                                                            <div className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent-blue" />
                                                            <span>{t.app.settingsModal.securityBp2}</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </TabsContent>


                                    <TabsContent value="notifications" key="notifications" asChild>
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.1 }}
                                            className="mt-0 space-y-8 outline-none"
                                        >
                                            <div className="space-y-1">
                                                <h3 className="settings-section-title">{t.app.settingsModal.notificationsTitle}</h3>
                                                <p className="settings-section-description">{t.app.settingsModal.notificationsDesc}</p>
                                            </div>

                                            <Card className="p-0 overflow-hidden divide-y divide-border-soft border-0 shadow-none!">
                                                <div className="space-y-3">
                                                    <Toggle
                                                        label="Email Updates"
                                                        checked={true}
                                                        onChange={() => { }}
                                                    />
                                                    <Toggle
                                                        label="Desktop Alerts"
                                                        checked={false}
                                                        onChange={() => { }}
                                                    />
                                                </div>
                                            </Card>
                                        </motion.div>
                                    </TabsContent>


                                    <TabsContent value="data" key="data" asChild>
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.1 }}
                                            className="mt-0 space-y-8 outline-none"
                                        >
                                            <div className="space-y-1">
                                                <h3 className="settings-section-title">{t.app.settingsModal.dataControlsTitle}</h3>
                                                <p className="settings-section-description">{t.app.settingsModal.dataControlsDesc}</p>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <Card className="p-6 space-y-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-9 w-9 rounded-xl bg-accent-blue/12 flex items-center justify-center text-accent-blue">
                                                            <Download className="h-5 w-5" />
                                                        </div>
                                                        <p className="text-[15px] font-bold text-primary-text">{t.app.settingsModal.exportLibrary}</p>
                                                    </div>
                                                    <p className="text-xs leading-5 text-secondary-text font-medium">{t.app.settingsModal.exportLibraryDesc}</p>
                                                    <Button variant="secondary" className="w-full font-bold h-10 mt-2" onClick={() => toast.success("Backup started. You will receive an email shortly.")}>{t.app.settingsModal.startBackup}</Button>
                                                </Card>

                                                <Card className="p-6 space-y-4 surface-danger">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-9 w-9 rounded-xl bg-(--danger-soft-bg) flex items-center justify-center text-danger">
                                                            <Trash2 className="h-5 w-5" />
                                                        </div>
                                                        <p className="text-[15px] font-bold text-danger">{t.app.settingsModal.dangerZone}</p>
                                                    </div>
                                                    <p className="text-xs leading-5 text-danger/70 font-medium">{t.app.settingsModal.dangerZoneDesc}</p>
                                                    <Button variant="dangerSoft" className="w-full font-bold h-10 mt-2" onClick={() => setIsDeleteAccountConfirmOpen(true)}>{t.app.settingsModal.deleteAccount}</Button>
                                                </Card>
                                            </div>
                                        </motion.div>
                                    </TabsContent>
                                </AnimatePresence>
                            </div>
                        </div>
                    </Tabs>

                    <div className="relative z-10 flex flex-col sm:flex-row h-auto min-h-14 py-3 sm:py-0 shrink-0 items-center justify-between gap-3 sm:gap-0 border-t border-border-soft bg-surface-overlay px-4 sm:px-8 backdrop-blur-sm">
                        <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-5">
                            <button className="settings-footer-link">Status <ExternalLink className="h-2.5 w-2.5" /></button>
                            <button className="settings-footer-link">Docs <ExternalLink className="h-2.5 w-2.5" /></button>
                            <button className="settings-footer-link">Changelog <ExternalLink className="h-2.5 w-2.5" /></button>
                        </div>
                        <div className="flex items-center gap-1.5 opacity-60 transition-all duration-300 hover:opacity-100">
                            <p className="text-[10px] font-bold text-secondary-text">Powered by </p>
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-black tracking-tighter text-primary-text uppercase">
                                <Image src="/icon.png" alt="Mirror logo" width={16} height={16} className="h-4 w-auto" />
                                <span>Mirror</span>
                            </span>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <ConfirmDialog
                open={isLogoutConfirmOpen}
                title="Close your session?"
                description="You will leave the private workspace and will need to sign in again to continue."
                confirmLabel="Log out"
                confirmPendingLabel="Logging out..."
                isPending={isLogoutPending}
                onConfirm={handleLogout}
                onCancel={() => {
                    if (!isLogoutPending) {
                        setIsLogoutConfirmOpen(false)
                    }
                }}
            />

            <ConfirmDialog
                open={isDeleteAccountConfirmOpen}
                title="Delete your account?"
                description="This action is permanent and will remove all your profiles, history and plans."
                confirmLabel="Delete account"
                onConfirm={handleDeleteAccountConfirm}
                onCancel={() => setIsDeleteAccountConfirmOpen(false)}
            />

            <ChangePasswordModal
                open={isChangePasswordOpen}
                onOpenChange={setIsChangePasswordOpen}
            />

            <LoadingOverlay show={isLogoutPending} label="Logging out..." />
        </>
    )
}

