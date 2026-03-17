"use client"

import {
    Bell,
    Download,
    Globe,
    LogOut,
    Monitor,
    Palette,
    Shield,
    Trash2,
    User,
    Laptop,
    Lock,
    Smartphone,
    Settings,
    ExternalLink,
    BadgeCheck
} from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { toast } from "sonner"
import Image from "next/image"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/Dialog"
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"
import { LoadingOverlay } from "@/components/ui/Loading"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/Tabs"
import { Button } from "@/components/ui/Button"
import { ThemeSegmentedControl } from "@/components/ui/ThemeToggle"
import { useTheme } from "@/components/providers/ThemeProvider"
import { Select } from "@/components/ui/Select"
import { Card } from "@/components/ui/Card"
import { useState } from "react"
import { useLogout } from "@/features/auth/hooks/useLogout"

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
    const [lang, setLang] = useState("en")
    const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false)
    const { logout, isPending: isLogoutPending } = useLogout()
    const { themePreference } = useTheme()

    const handleLogout = async () => {
        await logout()
    }

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
                    <DialogTitle className="sr-only">Settings</DialogTitle>
                    <DialogDescription className="sr-only">Manage your account settings and preferences</DialogDescription>
                    <Tabs defaultValue="general" className="flex-1 flex flex-col overflow-hidden">
                        <div className="flex flex-col sm:flex-row flex-1 overflow-hidden">
                            {/* Sidebar Tabs */}
                            <div className="w-full sm:w-70 shrink-0 border-b sm:border-b-0 sm:border-r border-border-soft bg-surface-overlay p-4 sm:p-5 backdrop-blur-sm flex flex-col z-10">
                                <div className="hidden sm:flex items-center gap-3 px-2 mb-8 mt-2">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-elevated border border-border-soft text-primary-text shadow-premium-sm">
                                        <Settings className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-[17px] font-bold tracking-tight text-primary-dark">Settings</h2>
                                        <p className="text-[11px] font-medium text-secondary-text uppercase tracking-wider">Account Control</p>
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
                                    <TabsTrigger value="devices" className="settings-nav-trigger">
                                        <Monitor className="h-4.5 w-4.5" />
                                        Sessions
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

                            {/* Content Area */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar bg-surface-base p-5 sm:px-10 sm:py-10 backdrop-blur-sm">
                                <AnimatePresence>
                                    {/* GENERAL */}
                                    <TabsContent value="general" key="general" asChild>
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.1 }}
                                            className="mt-0 space-y-8 outline-none"
                                        >
                                            <div className="space-y-1">
                                                <h3 className="settings-section-title">General Info</h3>
                                                <p className="settings-section-description">Manage your personal details and account settings.</p>
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
                                                        <div className="space-y-2">
                                                            <label className="settings-field-label">Full Name</label>
                                                            <input disabled className="neo-input h-11 w-full rounded-2xl px-4 text-[13px] font-medium" defaultValue={user.name} />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="settings-field-label">Email Address</label>
                                                            <input disabled className="neo-input h-11 w-full rounded-2xl px-4 text-[13px] font-medium" defaultValue={user.email} />
                                                        </div>
                                                    </div>

                                                    <div className="pt-2">
                                                        <Select
                                                            label="Application Language"
                                                            value={lang}
                                                            onChange={(val) => { setLang(val); toast.success("Language preference updated"); }}
                                                            options={[
                                                                { label: "English (United States)", value: "en" },
                                                                { label: "Español (España)", value: "es" },
                                                                { label: "Português (Brasil)", value: "pt" }
                                                            ]}
                                                        />
                                                    </div>
                                                </div>
                                            </Card>
                                        </motion.div>
                                    </TabsContent>

                                    {/* APPEARANCE */}
                                    <TabsContent value="appearance" key="appearance" asChild>
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.1 }}
                                            className="mt-0 space-y-8 outline-none"
                                        >
                                            <div className="space-y-1">
                                                <h3 className="settings-section-title">Appearance</h3>
                                                <p className="settings-section-description">Switch appearance instantly across landing, auth and workspace.</p>
                                            </div>

                                            <Card className="p-6 sm:p-7">
                                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                                    <div>
                                                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-secondary-text">Active theme</p>
                                                        <p className="mt-1 text-[14px] font-semibold text-primary-text">
                                                            {themePreference === "system"
                                                                ? `System`
                                                                : `${themePreference === "dark" ? "Dark" : "Light"} mode`}
                                                        </p>
                                                    </div>
                                                    <ThemeSegmentedControl className="w-full sm:w-auto" />
                                                </div>

                                                <p className="mt-4 text-[12px] leading-5 text-secondary-text">
                                                    Light: bright interface. Dark: deeper contrast. System: follows your device.
                                                </p>
                                            </Card>
                                        </motion.div>
                                    </TabsContent>

                                    {/* SECURITY */}
                                    <TabsContent value="security" key="security" asChild>
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.1 }}
                                            className="mt-0 space-y-8 outline-none"
                                        >
                                            <div className="space-y-1">
                                                <h3 className="settings-section-title">Security</h3>
                                                <p className="settings-section-description">Protect your account with advanced authentication methods.</p>
                                            </div>

                                            <div className="grid gap-4">
                                                <Card className="settings-card-row">
                                                    <div className="flex items-center gap-5">
                                                        <div className="h-12 w-12 rounded-2xl bg-accent-blue/12 flex items-center justify-center text-accent-blue">
                                                            <Lock className="h-5.5 w-5.5" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[15px] font-bold text-primary-text">Master Password</p>
                                                            <p className="text-xs text-secondary-text font-medium">Last updated March 2026</p>
                                                        </div>
                                                    </div>
                                                    <Button variant="secondary" className="font-bold h-9" onClick={() => toast.success("Password change requested. Check your email.")}>Update</Button>
                                                </Card>

                                                <Card className="settings-card-row">
                                                    <div className="flex items-center gap-5">
                                                        <div className="h-12 w-12 rounded-2xl bg-(--accent-purple-soft-bg) flex items-center justify-center text-accent-purple">
                                                            <Shield className="h-5.5 w-5.5" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[15px] font-bold text-primary-text">2-Factor Auth (2FA)</p>
                                                            <p className="text-xs text-secondary-text font-medium">Add an extra layer of security</p>
                                                        </div>
                                                    </div>
                                                    <Button variant="primary" className="font-bold h-9" onClick={() => toast.success("2FA setup initiated")}>Enable</Button>
                                                </Card>
                                            </div>
                                        </motion.div>
                                    </TabsContent>

                                    {/* DEVICES */}
                                    <TabsContent value="devices" key="devices" asChild>
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.1 }}
                                            className="mt-0 space-y-8 outline-none"
                                        >
                                            <div className="space-y-1">
                                                <h3 className="settings-section-title">Active Sessions</h3>
                                                <p className="settings-section-description">Manage and sign out of your remote active sessions.</p>
                                            </div>

                                            <div className="space-y-4">
                                                <Card className="flex items-center gap-5 border-border-soft bg-surface-card p-5">
                                                    <div className="h-12 w-12 rounded-2xl bg-surface-elevated flex items-center justify-center text-brand-dark shadow-premium-sm">
                                                        <Laptop className="h-5.5 w-5.5" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-[15px] font-bold text-primary-text">Windows PC • Chrome</p>
                                                            <span className="settings-session-badge">Active</span>
                                                        </div>
                                                        <p className="text-xs text-secondary-text font-medium">Medellin, Colombia • IP: 181.12.XXX.XX</p>
                                                    </div>
                                                </Card>

                                                <Card className="flex items-center gap-5 p-5">
                                                    <div className="h-12 w-12 rounded-2xl bg-surface-subtle flex items-center justify-center text-secondary-text">
                                                        <Smartphone className="h-5.5 w-5.5" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-[15px] font-bold text-primary-text">iPhone 15 Pro • App</p>
                                                        <p className="text-xs text-secondary-text font-medium">Miami, USA • 2 days ago</p>
                                                    </div>
                                                    <Button variant="ghost" className="text-danger hover:bg-(--danger-soft-bg) text-xs font-bold" onClick={() => toast.success("Session revoked successfully")}>Revoke</Button>
                                                </Card>
                                            </div>
                                        </motion.div>
                                    </TabsContent>

                                    {/* NOTIFICATIONS */}
                                    <TabsContent value="notifications" key="notifications" asChild>
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.1 }}
                                            className="mt-0 space-y-8 outline-none"
                                        >
                                            <div className="space-y-1">
                                                <h3 className="settings-section-title">Notifications</h3>
                                                <p className="settings-section-description">Decide how and when you want to be notified.</p>
                                            </div>

                                            <Card className="p-0 overflow-hidden divide-y divide-border-soft">
                                                <div className="flex items-center justify-between p-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-10 w-10 rounded-xl bg-accent-orange/12 flex items-center justify-center text-accent-orange">
                                                            <Globe className="h-5 w-5" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[14px] font-bold text-primary-text">Email Updates</p>
                                                            <p className="text-xs text-secondary-text font-medium">Weekly digest and system alerts</p>
                                                        </div>
                                                    </div>
                                                    <div className="h-6 w-11 rounded-full bg-brand-dark p-1 relative cursor-pointer shadow-inner">
                                                        <div className="h-4 w-4 rounded-full bg-surface-elevated absolute right-1 shadow-premium-sm" />
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between p-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-10 w-10 rounded-xl bg-(--accent-purple-soft-bg) flex items-center justify-center text-accent-purple">
                                                            <Bell className="h-5 w-5" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[14px] font-bold text-primary-text">Desktop Alerts</p>
                                                            <p className="text-xs text-secondary-text font-medium">Real-time profile match notifications</p>
                                                        </div>
                                                    </div>
                                                    <div className="h-6 w-11 rounded-full bg-surface-subtle p-1 relative cursor-pointer border border-border-soft">
                                                        <div className="h-4 w-4 rounded-full bg-surface-elevated absolute left-1 shadow-premium-sm" />
                                                    </div>
                                                </div>
                                            </Card>
                                        </motion.div>
                                    </TabsContent>

                                    {/* DATA */}
                                    <TabsContent value="data" key="data" asChild>
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.1 }}
                                            className="mt-0 space-y-8 outline-none"
                                        >
                                            <div className="space-y-1">
                                                <h3 className="settings-section-title">Data & Controls</h3>
                                                <p className="settings-section-description">Take control of your data and backup your history.</p>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <Card className="p-6 space-y-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-9 w-9 rounded-xl bg-accent-blue/12 flex items-center justify-center text-accent-blue">
                                                            <Download className="h-5 w-5" />
                                                        </div>
                                                        <p className="text-[15px] font-bold text-primary-text">Export Library</p>
                                                    </div>
                                                    <p className="text-xs leading-5 text-secondary-text font-medium">Download a complete backup of all your created profiles and usage history in JSON format.</p>
                                                    <Button variant="secondary" className="w-full font-bold h-10 mt-2" onClick={() => toast.success("Backup started. You will receive an email shortly.")}>Start Backup</Button>
                                                </Card>

                                                <Card className="p-6 space-y-4 surface-danger">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-9 w-9 rounded-xl bg-(--danger-soft-bg) flex items-center justify-center text-danger">
                                                            <Trash2 className="h-5 w-5" />
                                                        </div>
                                                        <p className="text-[15px] font-bold text-danger">Danger Zone</p>
                                                    </div>
                                                    <p className="text-xs leading-5 text-danger/70 font-medium">Deleting your account is permanent. All profiles, history and plans will be lost immediately.</p>
                                                    <Button variant="dangerSoft" className="w-full font-bold h-10 mt-2" onClick={() => toast.error("Are you sure? This cannot be undone.", { action: { label: "Confirm", onClick: () => toast.success("Account deleted.") } })}>Delete Account</Button>
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

            <LoadingOverlay show={isLogoutPending} label="Logging out..." />
        </>
    )
}
