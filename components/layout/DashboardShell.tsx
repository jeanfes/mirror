"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    BarChart3,
    Bot,
    ChevronRight,
    Compass,
    History,
    Settings,
    User,
    CreditCard,
    Trash2,
    LogOut,
    CalendarDays,
    Users,
    Sparkles,
    Bell,
    Search,
    CircleUserRound
} from "lucide-react"
import { signOut } from "next-auth/react"
import { clsx } from "clsx"
import { Button } from "@/components/ui"

const navItems = [
    { href: "/dashboard", label: "Home", icon: Bot },
    { href: "/dashboard/assistant", label: "Assistant", icon: Sparkles },
    { href: "/dashboard/planner", label: "Planner", icon: CalendarDays },
    { href: "/dashboard/team", label: "Team", icon: Users },
    { href: "/dashboard/personas", label: "Personas", icon: User },
    { href: "/dashboard/history", label: "History", icon: History },
    { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
    { href: "/dashboard/account", label: "Account", icon: CreditCard },
    { href: "/dashboard/plans", label: "Plans", icon: Bot },
    { href: "/dashboard/trash", label: "Trash", icon: Trash2 }
]

interface DashboardShellProps {
    children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
    const pathname = usePathname()
    const activeItem =
        navItems.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`)) ?? navItems[0]

    return (
        <div className="min-h-screen px-4 py-4 md:px-6 md:py-6">
            <div className="neo-shell dashboard-shell min-h-[calc(100vh-2rem)] p-3 md:p-4">
                <div className="grid gap-4 lg:grid-cols-[262px_1fr]">
                    <aside className="neo-panel relative overflow-hidden p-3 md:p-4">
                        <div className="pointer-events-none absolute -right-14 -top-14 h-32 w-32 rounded-full bg-[#D8D3F4]/60 blur-2xl" />
                        <div className="pointer-events-none absolute -bottom-14 -left-8 h-28 w-28 rounded-full bg-[#F1E8DD]/60 blur-2xl" />

                        <div className="relative mb-5 flex items-center justify-between">
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">Mirror workspace</p>
                                <p className="mt-1 text-[20px] font-bold tracking-[-0.03em] text-[#121726]">Dashboard</p>
                            </div>
                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                        </div>

                        <nav className="relative space-y-1.5">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                                const Icon = item.icon
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={clsx(
                                            "group flex items-center gap-2.5 rounded-2xl border px-3 py-2.5 text-[13px] font-semibold transition-all",
                                            isActive
                                                ? "border-[#D9DDF0] bg-white text-[#1A1D26] shadow-premium-sm"
                                                : "border-transparent text-slate-500 hover:border-[#E6EAF2] hover:bg-white/70 hover:text-slate-700"
                                        )}
                                    >
                                        <Icon className="h-4 w-4" />
                                        <span>{item.label}</span>
                                        <ChevronRight
                                            className={clsx(
                                                "ml-auto h-3.5 w-3.5 transition-opacity",
                                                isActive ? "opacity-100" : "opacity-0 group-hover:opacity-70"
                                            )}
                                        />
                                    </Link>
                                )
                            })}
                        </nav>

                        <div className="relative mt-5 rounded-2xl border border-[#E7EBF4] bg-white/80 p-3.5 shadow-premium-sm">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Status</p>
                            <p className="mt-1 text-[14px] font-semibold text-slate-800">All systems stable</p>
                            <p className="mt-1 text-[12px] leading-relaxed text-slate-500">Assistant responses are healthy and credits are synchronized.</p>
                        </div>

                        <Button
                            variant="secondary"
                            className="relative mt-5 w-full"
                            onClick={() => signOut({ callbackUrl: "/login" })}
                        >
                            <LogOut className="h-4 w-4" />
                            Sign out
                        </Button>
                    </aside>

                    <main className="neo-panel overflow-hidden p-3 md:p-4">
                        <div className="rounded-2xl border border-[#E5E9F2] bg-white/78 p-4 shadow-premium-sm md:p-5">
                            <header className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-[#E8ECF4] pb-4">
                                <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">Private workspace</p>
                                    <h1 className="mt-1 text-[24px] font-bold tracking-[-0.03em] text-[#121726]">{activeItem.label}</h1>
                                </div>

                                <div className="flex w-full items-center gap-2 sm:w-auto">
                                    <button
                                        type="button"
                                        className="inline-flex h-10 min-w-10 items-center justify-center rounded-xl border border-[#E4E8F2] bg-white/85 text-slate-500 transition hover:bg-white hover:text-slate-700"
                                        aria-label="Open notifications"
                                    >
                                        <Bell className="h-4 w-4" />
                                    </button>
                                    <button
                                        type="button"
                                        className="inline-flex h-10 min-w-10 items-center justify-center rounded-xl border border-[#E4E8F2] bg-white/85 text-slate-500 transition hover:bg-white hover:text-slate-700"
                                        aria-label="Open profile"
                                    >
                                        <CircleUserRound className="h-4 w-4" />
                                    </button>
                                </div>
                            </header>

                            <div className="mb-4 grid gap-2 sm:grid-cols-[1fr_auto]">
                                <div className="inline-flex items-center gap-2 rounded-xl border border-[#E6EAF2] bg-white/85 px-3 py-2.5 text-[13px] text-slate-500">
                                    <Search className="h-4 w-4" />
                                    <span>Search conversations, personas or goals...</span>
                                </div>
                                <div className="inline-flex items-center gap-2 rounded-xl border border-[#E6EAF2] bg-white/85 px-3 py-2.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                                    <Compass className="h-4 w-4" />
                                    Focus mode
                                </div>
                            </div>

                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}
