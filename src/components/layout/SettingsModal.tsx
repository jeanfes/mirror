"use client"

import * as React from "react"
import Image from "next/image"
import {
    Bell,
    Download,
    Globe,
    LogOut,
    Monitor,
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
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/Dialog"
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

interface SettingsModalProps {
    children: React.ReactNode
    user?: {
        name: string
        email: string
        avatar?: string
    }
}

export function SettingsModal({ children, user = { name: "User Name", email: "user@example.com" } }: SettingsModalProps) {
    const [lang, setLang] = React.useState("en")
    const [activeTheme, setActiveTheme] = React.useState<"light" | "dark" | "system">("light")

    return (
        <Dialog>
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
                                <TabsTrigger value="general" className="justify-start gap-3 h-11 px-4 text-[14px] rounded-xl hover:bg-white hover:text-slate-800 data-[state=active]:bg-brand-dark data-[state=active]:text-white data-[state=active]:shadow-premium-sm transition-all duration-200">
                                    <User className="h-4.5 w-4.5" />
                                    General
                                </TabsTrigger>
                                <TabsTrigger value="appearance" className="justify-start gap-3 h-11 px-4 text-[14px] rounded-xl hover:bg-white hover:text-slate-800 data-[state=active]:bg-brand-dark data-[state=active]:text-white data-[state=active]:shadow-premium-sm transition-all duration-200">
                                    <Laptop className="h-4.5 w-4.5" />
                                    Appearance
                                </TabsTrigger>
                                <TabsTrigger value="security" className="justify-start gap-3 h-11 px-4 text-[14px] rounded-xl hover:bg-white hover:text-slate-800 data-[state=active]:bg-brand-dark data-[state=active]:text-white data-[state=active]:shadow-premium-sm transition-all duration-200">
                                    <Shield className="h-4.5 w-4.5" />
                                    Security
                                </TabsTrigger>
                                <TabsTrigger value="devices" className="justify-start gap-3 h-11 px-4 text-[14px] rounded-xl hover:bg-white hover:text-slate-800 data-[state=active]:bg-brand-dark data-[state=active]:text-white data-[state=active]:shadow-premium-sm transition-all duration-200">
                                    <Monitor className="h-4.5 w-4.5" />
                                    Sessions
                                </TabsTrigger>
                                <TabsTrigger value="notifications" className="justify-start gap-3 h-11 px-4 text-[14px] rounded-xl hover:bg-white hover:text-slate-800 data-[state=active]:bg-brand-dark data-[state=active]:text-white data-[state=active]:shadow-premium-sm transition-all duration-200">
                                    <Bell className="h-4.5 w-4.5" />
                                    Alerts
                                </TabsTrigger>
                                <TabsTrigger value="data" className="justify-start gap-3 h-11 px-4 text-[14px] rounded-xl hover:bg-white hover:text-slate-800 data-[state=active]:bg-brand-dark data-[state=active]:text-white data-[state=active]:shadow-premium-sm transition-all duration-200">
                                    <Download className="h-4.5 w-4.5" />
                                    Export
                                </TabsTrigger>

                                <div className="pt-8 mt-auto space-y-2">
                                    <Button variant="ghost" className="w-full justify-start gap-3 text-slate-500 hover:bg-white hover:text-danger transition-colors">
                                        <LogOut className="h-4 w-4" />
                                        <span>Log out</span>
                                    </Button>
                                    <div className="px-4 py-2 opacity-50">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Version 1.0.4</p>
                                    </div>
                                </div>
                            </TabsList>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar bg-white/60 p-10 backdrop-blur-sm">
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
                                            <h3 className="text-[22px] font-bold text-slate-900 tracking-tight">General Info</h3>
                                            <p className="text-sm text-slate-500 font-medium">Manage your personal details and account settings.</p>
                                        </div>

                                        <Card className="p-6 space-y-6">
                                            <div className="flex items-center gap-5">
                                                <div className="group relative h-20 w-20 shrink-0">
                                                    <div className="h-full w-full rounded-3xl bg-linear-to-br from-[#171b2d] to-[#2d334d] flex items-center justify-center text-white text-3xl font-bold shadow-premium-lg">
                                                        {user.avatar ? (
                                                            <Image
                                                                src={user.avatar}
                                                                alt={`${user.name} avatar`}
                                                                fill
                                                                sizes="80px"
                                                                className="rounded-3xl object-cover"
                                                            />
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
                                                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Full Name</label>
                                                        <input className="neo-input h-11 w-full rounded-2xl px-4 text-[13px] font-medium" defaultValue={user.name} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Email Address</label>
                                                        <input className="neo-input h-11 w-full rounded-2xl px-4 text-[13px] font-medium" defaultValue={user.email} />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Workspace ID</label>
                                                    <div className="flex items-center gap-2 neo-input h-11 rounded-2xl px-4 bg-slate-50/50">
                                                        <span className="text-[13px] font-mono text-slate-500">mirror_workspace_0892</span>
                                                        <Button variant="ghost" size="md" className="ml-auto h-7 px-2 text-[10px] font-bold uppercase">Copy</Button>
                                                    </div>
                                                </div>

                                                <div className="pt-2">
                                                    <Select
                                                        label="Application Language"
                                                        value={lang}
                                                        onChange={setLang}
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
                                            <h3 className="text-[22px] font-bold text-slate-900 tracking-tight">Appearance</h3>
                                            <p className="text-sm text-slate-500 font-medium">Customize the interface visual theme and behavior.</p>
                                        </div>

                                        <Card className="p-8">
                                            <div className="grid grid-cols-3 gap-6">
                                                <button
                                                    onClick={() => setActiveTheme("light")}
                                                    className={cn(
                                                        "group relative space-y-3 rounded-3xl border p-3 text-left transition-all duration-200",
                                                        activeTheme === "light" ? "border-brand-dark bg-white/85 shadow-premium-sm" : "border-border-soft bg-white/70 hover:border-slate-300"
                                                    )}
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
                                                        {activeTheme === "light" && <div className="h-4 w-4 rounded-full bg-brand-dark flex items-center justify-center"><BadgeCheck className="h-3 w-3 text-white" /></div>}
                                                    </div>
                                                </button>

                                                <button
                                                    onClick={() => setActiveTheme("dark")}
                                                    className={cn(
                                                        "group relative space-y-3 rounded-3xl border p-3 text-left transition-all duration-200",
                                                        activeTheme === "dark" ? "border-brand-dark bg-white/85 shadow-premium-sm" : "border-border-soft bg-white/70 hover:border-slate-300"
                                                    )}
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
                                                        {activeTheme === "dark" && <div className="h-4 w-4 rounded-full bg-brand-dark flex items-center justify-center"><BadgeCheck className="h-3 w-3 text-white" /></div>}
                                                    </div>
                                                </button>

                                                <button
                                                    onClick={() => setActiveTheme("system")}
                                                    className={cn(
                                                        "group relative space-y-3 rounded-3xl border p-3 text-left transition-all duration-200",
                                                        activeTheme === "system" ? "border-brand-dark bg-white/85 shadow-premium-sm" : "border-border-soft bg-white/70 hover:border-slate-300"
                                                    )}
                                                >
                                                    <div className="aspect-4/3 w-full rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden relative">
                                                        <div className="absolute inset-0 bg-brand-dark [clip-path:polygon(100%_0,0_100%,100%_100%)]" />
                                                        <div className="absolute inset-0 p-2 flex flex-col justify-center items-center gap-1 opacity-20">
                                                            <Laptop className="h-8 w-8 text-black" />
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between px-1">
                                                        <span className="text-[13px] font-bold text-slate-900">System</span>
                                                        {activeTheme === "system" && <div className="h-4 w-4 rounded-full bg-brand-dark flex items-center justify-center"><BadgeCheck className="h-3 w-3 text-white" /></div>}
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
                                            <h3 className="text-[22px] font-bold text-slate-900 tracking-tight">Security</h3>
                                            <p className="text-sm text-slate-500 font-medium">Protect your account with advanced authentication methods.</p>
                                        </div>

                                        <div className="grid gap-4">
                                            <Card className="flex items-center justify-between p-5 transition-colors hover:border-slate-300">
                                                <div className="flex items-center gap-5">
                                                    <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                                                        <Lock className="h-5.5 w-5.5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[15px] font-bold text-slate-900">Master Password</p>
                                                        <p className="text-xs text-slate-500 font-medium">Last updated March 2026</p>
                                                    </div>
                                                </div>
                                                <Button variant="secondary" className="font-bold h-9">Update</Button>
                                            </Card>

                                            <Card className="flex items-center justify-between p-5 transition-colors hover:border-slate-300">
                                                <div className="flex items-center gap-5">
                                                    <div className="h-12 w-12 rounded-2xl bg-(--accent-purple-soft-bg) flex items-center justify-center text-accent-purple">
                                                        <Shield className="h-5.5 w-5.5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[15px] font-bold text-slate-900">2-Factor Auth (2FA)</p>
                                                        <p className="text-xs text-slate-500 font-medium">Add an extra layer of security</p>
                                                    </div>
                                                </div>
                                                <Button variant="primary" className="font-bold h-9">Enable</Button>
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
                                            <h3 className="text-[22px] font-bold text-slate-900 tracking-tight">Active Sessions</h3>
                                            <p className="text-sm text-slate-500 font-medium">Manage and sign out of your remote active sessions.</p>
                                        </div>

                                        <div className="space-y-4">
                                            <Card className="flex items-center gap-5 border-border-soft bg-white/75 p-5">
                                                <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-brand-dark shadow-premium-sm">
                                                    <Laptop className="h-5.5 w-5.5" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-[15px] font-bold text-slate-900">Windows PC • Chrome</p>
                                                        <span className="rounded-full border border-border-soft bg-white px-2 py-0.5 text-[10px] font-black uppercase text-brand-dark">Active</span>
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
                                                <Button variant="ghost" className="text-danger hover:bg-(--danger-soft-bg) text-xs font-bold">Revoke</Button>
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
                                            <h3 className="text-[22px] font-bold text-slate-900 tracking-tight">Notifications</h3>
                                            <p className="text-sm text-slate-500 font-medium">Decide how and when you want to be notified.</p>
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
                                            <h3 className="text-[22px] font-bold text-slate-900 tracking-tight">Data & Controls</h3>
                                            <p className="text-sm text-slate-500 font-medium">Take control of your data and backup your history.</p>
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
                                                <Button variant="secondary" className="w-full font-bold h-10 mt-2">Start Backup</Button>
                                            </Card>

                                            <Card className="p-6 space-y-4 surface-danger">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-9 w-9 rounded-xl bg-(--danger-soft-bg) flex items-center justify-center text-danger">
                                                        <Trash2 className="h-5 w-5" />
                                                    </div>
                                                    <p className="text-[15px] font-bold text-danger">Danger Zone</p>
                                                </div>
                                                <p className="text-xs leading-5 text-danger/70 font-medium">Deleting your account is permanent. All profiles, history and plans will be lost immediately.</p>
                                                <Button variant="ghost" className="w-full bg-white border border-(--danger-soft-border) text-danger font-bold h-10 mt-2 hover:bg-(--danger-soft-bg) transition-colors">Delete Account</Button>
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
                        <button className="flex items-center gap-1 text-[11px] font-bold text-slate-600 transition-colors hover:text-brand-dark hover:underline">Status <ExternalLink className="h-2.5 w-2.5" /></button>
                        <button className="flex items-center gap-1 text-[11px] font-bold text-slate-600 transition-colors hover:text-brand-dark hover:underline">Docs <ExternalLink className="h-2.5 w-2.5" /></button>
                        <button className="flex items-center gap-1 text-[11px] font-bold text-slate-600 transition-colors hover:text-brand-dark hover:underline">Changelog <ExternalLink className="h-2.5 w-2.5" /></button>
                    </div>
                    <div className="flex items-center gap-1.5 opacity-60 transition-all duration-300 hover:opacity-100">
                        <p className="text-[10px] font-bold text-slate-400">Powered by </p>
                        <span className="text-[12px] font-black tracking-tighter text-slate-950 uppercase">Nixtio Tech</span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
