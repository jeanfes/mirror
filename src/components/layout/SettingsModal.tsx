"use client"

import {
    Bell,
    Check,
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
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { isClientMockAuthMode } from "@/lib/auth-config"
import { clearMockSession } from "@/lib/mock-auth"
import { ROUTES } from "@/lib/routes"
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/Dialog"
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"
import { useLoadingDelay } from "@/components/ui/Loading"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/Tabs"
import { Button } from "@/components/ui/Button"
import { Select } from "@/components/ui/Select"
import { Card } from "@/components/ui/Card"
import { cn } from "@/lib/utils"
import { useState } from "react"

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
    const [activeTheme, setActiveTheme] = useState<"light" | "dark" | "system">("light")
    const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false)
    const [isLogoutPending, setIsLogoutPending] = useState(false)
    const router = useRouter()
    const isMockMode = isClientMockAuthMode()
    const showLogoutPending = useLoadingDelay(isLogoutPending)

    const handleLogout = async () => {
        setIsLogoutPending(true)

        try {
            if (isMockMode) {
                clearMockSession()
                toast.success("Session closed")
                setIsLogoutConfirmOpen(false)
                onOpenChange?.(false)
                router.replace(ROUTES.auth.login)
                router.refresh()
                return
            }

            const supabase = createClient()
            const { error } = await supabase.auth.signOut()

            if (error) {
                toast.error("Could not close your session")
                return
            }

            toast.success("Session closed")
            setIsLogoutConfirmOpen(false)
            onOpenChange?.(false)
            router.replace(ROUTES.auth.login)
            router.refresh()
        } catch {
            toast.error("Could not close your session")
        } finally {
            setIsLogoutPending(false)
        }
    }

    return (
        <>
        <Dialog open={open} onOpenChange={(nextOpen) => {
            if (!showLogoutPending) {
                onOpenChange?.(nextOpen)
            }
        }}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="max-w-4xl p-0 h-[80vh] flex flex-col sm:h-162.5">
                <DialogTitle className="sr-only">Settings</DialogTitle>
                <Tabs defaultValue="general" className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex flex-1 overflow-hidden">
                        {/* Sidebar Tabs */}
                        <div className="w-70 shrink-0 border-r border-border-soft bg-white/70 p-5 backdrop-blur-sm flex flex-col">
                            <div className="flex items-center gap-3 px-2 mb-8 mt-2">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-dark text-white shadow-premium-sm">
                                    <Settings className="h-5 w-5" />
                                </div>
                                <div>
                                    <h2 className="text-[17px] font-bold tracking-tight text-slate-900">Settings</h2>
                                    <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Account Control</p>
                                </div>
                            </div>

                            <TabsList className="flex-1 flex flex-col h-auto items-stretch justify-start rounded-none border-0 bg-transparent p-0 space-y-1.5 focus:outline-none">
                                <TabsTrigger value="general" className="settings-nav-trigger">
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
                                <TabsTrigger value="data" className="settings-nav-trigger">
                                    <Download className="h-4.5 w-4.5" />
                                    Export
                                </TabsTrigger>

                                <div className="pt-8 mt-auto space-y-2">
                                    <Button type="button" variant="dangerSoft" className="w-full justify-start" onClick={() => setIsLogoutConfirmOpen(true)} disabled={showLogoutPending}>
                                        <LogOut className="h-4 w-4 shrink-0 stroke-[2.2]" />
                                        <span>{showLogoutPending ? "Logging out..." : "Log out"}</span>
                                    </Button>
                                    <div className="px-4 py-2 opacity-50">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Version 1.0.4</p>
                                    </div>
                                </div>
                            </TabsList>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar bg-white/60 px-10 py-10 backdrop-blur-sm">
                            <AnimatePresence mode="wait">
                                {/* GENERAL */}
                                <TabsContent value="general" key="general" asChild>
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
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
                                                    <button className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-xl bg-white text-accent-purple shadow-premium-sm ring-1 ring-slate-100 hover:scale-110 transition-transform">
                                                        <BadgeCheck className="h-4 w-4 fill-accent-purple text-white" />
                                                    </button>
                                                </div>
                                                <div className="space-y-1">
                                                    <h4 className="font-bold text-slate-900">{user.name}</h4>
                                                    <p className="text-xs text-slate-500 font-medium">{user.email}</p>
                                                    <Button variant="ghost" className="h-8 px-0 text-accent-purple text-xs font-bold hover:bg-transparent hover:underline">Change profile photo</Button>
                                                </div>
                                            </div>

                                            <div className="grid gap-5">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label className="settings-field-label">Full Name</label>
                                                        <input className="neo-input h-11 w-full rounded-2xl px-4 text-[13px] font-medium" defaultValue={user.name} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="settings-field-label">Email Address</label>
                                                        <input className="neo-input h-11 w-full rounded-2xl px-4 text-[13px] font-medium" defaultValue={user.email} />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="settings-field-label">Workspace ID</label>
                                                    <div className="flex items-center gap-2 neo-input h-11 rounded-2xl px-4 bg-slate-50/50">
                                                        <span className="text-[13px] font-mono text-slate-500">mirror_workspace_0892</span>
                                                        <Button variant="ghost" size="md" className="ml-auto h-7 px-2 text-[10px] font-bold uppercase" onClick={() => { navigator.clipboard.writeText("mirror_workspace_0892"); toast.success("Copied to clipboard") }}>Copy</Button>
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
                                        transition={{ duration: 0.2 }}
                                        className="mt-0 space-y-8 outline-none"
                                    >
                                        <div className="space-y-1">
                                            <h3 className="settings-section-title">Appearance</h3>
                                            <p className="settings-section-description">Customize the interface visual theme and behavior.</p>
                                        </div>

                                        <Card className="p-8">
                                            <div className="grid grid-cols-3 gap-6">
                                                <button
                                                    onClick={() => setActiveTheme("light")}
                                                    className={cn("settings-theme-option group space-y-3", activeTheme === "light" ? "settings-theme-option-active" : "settings-theme-option-idle")}
                                                >
                                                    <div className="aspect-4/3 w-full rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden p-2">
                                                        <div className="h-full w-full bg-white rounded-lg shadow-sm border border-slate-200/50 p-2 space-y-1.5">
                                                            <div className="h-1.5 w-1/2 rounded bg-slate-100" />
                                                            <div className="h-1.5 w-full rounded bg-slate-50" />
                                                            <div className="h-1.5 w-3/4 rounded bg-slate-50" />
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between px-1">
                                                        <span className="text-[13px] font-bold text-slate-900">Light</span>
                                                        {activeTheme === "light" && <div className="h-4 w-4 rounded-full bg-brand-dark flex items-center justify-center"><Check className="h-3 w-3 text-white" /></div>}
                                                    </div>
                                                </button>

                                                <button
                                                    onClick={() => setActiveTheme("dark")}
                                                    className={cn("settings-theme-option group space-y-3", activeTheme === "dark" ? "settings-theme-option-active" : "settings-theme-option-idle")}
                                                >
                                                    <div className="aspect-4/3 w-full rounded-2xl bg-brand-dark overflow-hidden p-2">
                                                        <div className="h-full w-full bg-[#242942] rounded-lg border border-white/5 p-2 space-y-1.5">
                                                            <div className="h-1.5 w-1/2 rounded bg-slate-700" />
                                                            <div className="h-1.5 w-full rounded bg-slate-800" />
                                                            <div className="h-1.5 w-3/4 rounded bg-slate-800" />
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between px-1">
                                                        <span className="text-[13px] font-bold text-slate-900">Dark</span>
                                                        {activeTheme === "dark" && <div className="h-4 w-4 rounded-full bg-brand-dark flex items-center justify-center"><Check className="h-3 w-3 text-white" /></div>}
                                                    </div>
                                                </button>

                                                <button
                                                    onClick={() => setActiveTheme("system")}
                                                    className={cn("settings-theme-option group space-y-3", activeTheme === "system" ? "settings-theme-option-active" : "settings-theme-option-idle")}
                                                >
                                                    <div className="aspect-4/3 w-full rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden relative">
                                                        <div className="absolute inset-0 bg-brand-dark [clip-path:polygon(100%_0,0_100%,100%_100%)]" />
                                                        <div className="absolute inset-0 p-2 flex flex-col justify-center items-center gap-1 opacity-20">
                                                            <Laptop className="h-8 w-8 text-black" />
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between px-1">
                                                        <span className="text-[13px] font-bold text-slate-900">System</span>
                                                        {activeTheme === "system" && <div className="h-4 w-4 rounded-full bg-brand-dark flex items-center justify-center"><Check className="h-3 w-3 text-white" /></div>}
                                                    </div>
                                                </button>
                                            </div>
                                        </Card>
                                    </motion.div>
                                </TabsContent>

                                {/* SECURITY */}
                                <TabsContent value="security" key="security" asChild>
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="mt-0 space-y-8 outline-none"
                                    >
                                        <div className="space-y-1">
                                            <h3 className="settings-section-title">Security</h3>
                                            <p className="settings-section-description">Protect your account with advanced authentication methods.</p>
                                        </div>

                                        <div className="grid gap-4">
                                            <Card className="settings-card-row">
                                                <div className="flex items-center gap-5">
                                                    <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                                                        <Lock className="h-5.5 w-5.5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[15px] font-bold text-slate-900">Master Password</p>
                                                        <p className="text-xs text-slate-500 font-medium">Last updated March 2026</p>
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
                                                        <p className="text-[15px] font-bold text-slate-900">2-Factor Auth (2FA)</p>
                                                        <p className="text-xs text-slate-500 font-medium">Add an extra layer of security</p>
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
                                        transition={{ duration: 0.2 }}
                                        className="mt-0 space-y-8 outline-none"
                                    >
                                        <div className="space-y-1">
                                            <h3 className="settings-section-title">Active Sessions</h3>
                                            <p className="settings-section-description">Manage and sign out of your remote active sessions.</p>
                                        </div>

                                        <div className="space-y-4">
                                            <Card className="flex items-center gap-5 border-border-soft bg-white/75 p-5">
                                                <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-brand-dark shadow-premium-sm">
                                                    <Laptop className="h-5.5 w-5.5" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-[15px] font-bold text-slate-900">Windows PC • Chrome</p>
                                                        <span className="settings-session-badge">Active</span>
                                                    </div>
                                                    <p className="text-xs text-slate-500 font-medium">Medellin, Colombia • IP: 181.12.XXX.XX</p>
                                                </div>
                                            </Card>

                                            <Card className="flex items-center gap-5 p-5">
                                                <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500">
                                                    <Smartphone className="h-5.5 w-5.5" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-[15px] font-bold text-slate-900">iPhone 15 Pro • App</p>
                                                    <p className="text-xs text-slate-500 font-medium">Miami, USA • 2 days ago</p>
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
                                        transition={{ duration: 0.2 }}
                                        className="mt-0 space-y-8 outline-none"
                                    >
                                        <div className="space-y-1">
                                            <h3 className="settings-section-title">Notifications</h3>
                                            <p className="settings-section-description">Decide how and when you want to be notified.</p>
                                        </div>

                                        <Card className="p-0 overflow-hidden divide-y divide-border-soft">
                                            <div className="flex items-center justify-between p-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                                                        <Globe className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[14px] font-bold text-slate-900">Email Updates</p>
                                                        <p className="text-xs text-slate-500 font-medium">Weekly digest and system alerts</p>
                                                    </div>
                                                </div>
                                                <div className="h-6 w-11 rounded-full bg-brand-dark p-1 relative cursor-pointer shadow-inner">
                                                    <div className="h-4 w-4 rounded-full bg-white absolute right-1 shadow-premium-sm" />
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between p-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-xl bg-(--accent-purple-soft-bg) flex items-center justify-center text-accent-purple">
                                                        <Bell className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[14px] font-bold text-slate-900">Desktop Alerts</p>
                                                        <p className="text-xs text-slate-500 font-medium">Real-time profile match notifications</p>
                                                    </div>
                                                </div>
                                                <div className="h-6 w-11 rounded-full bg-slate-200 p-1 relative cursor-pointer">
                                                    <div className="h-4 w-4 rounded-full bg-white absolute left-1 shadow-premium-sm" />
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
                                        transition={{ duration: 0.2 }}
                                        className="mt-0 space-y-8 outline-none"
                                    >
                                        <div className="space-y-1">
                                            <h3 className="settings-section-title">Data & Controls</h3>
                                            <p className="settings-section-description">Take control of your data and backup your history.</p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <Card className="p-6 space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                                        <Download className="h-5 w-5" />
                                                    </div>
                                                    <p className="text-[15px] font-bold text-slate-900">Export Library</p>
                                                </div>
                                                <p className="text-xs leading-5 text-slate-500 font-medium">Download a complete backup of all your created profiles and usage history in JSON format.</p>
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
                                                <Button variant="ghost" className="w-full bg-white border border-(--danger-soft-border) text-danger font-bold h-10 mt-2 hover:bg-(--danger-soft-bg) transition-colors" onClick={() => toast.error("Are you sure? This cannot be undone.", { action: { label: "Confirm", onClick: () => toast.success("Account deleted.") } })}>Delete Account</Button>
                                            </Card>
                                        </div>
                                    </motion.div>
                                </TabsContent>
                            </AnimatePresence>
                        </div>
                    </div>
                </Tabs>

                <div className="relative z-10 flex h-14 shrink-0 items-center justify-between border-t border-border-soft bg-white/70 px-8 backdrop-blur-sm">
                    <div className="flex items-center gap-5">
                        <button className="settings-footer-link">Status <ExternalLink className="h-2.5 w-2.5" /></button>
                        <button className="settings-footer-link">Docs <ExternalLink className="h-2.5 w-2.5" /></button>
                        <button className="settings-footer-link">Changelog <ExternalLink className="h-2.5 w-2.5" /></button>
                    </div>
                    <div className="flex items-center gap-1.5 opacity-60 transition-all duration-300 hover:opacity-100">
                        <p className="text-[10px] font-bold text-slate-400">Powered by </p>
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-black tracking-tighter text-slate-950 uppercase">
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
            isPending={showLogoutPending}
            onConfirm={handleLogout}
            onCancel={() => {
                if (!showLogoutPending) {
                    setIsLogoutConfirmOpen(false)
                }
            }}
        />
        </>
    )
}
