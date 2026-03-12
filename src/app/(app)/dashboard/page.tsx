"use client"

import {
    BarChart3,
    Bot,
    History,
    Settings,
    User,
    CreditCard,
    Trash2,
    CalendarDays,
    Users,
    Sparkles,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import clsx from "clsx";

export default function DashboardPage({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

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

    return (
        <div className="min-h-screen">
            <div className="grid md:grid-cols-[auto_1fr]">
                <aside className="w-min p-3 flex min-h-[calc(100vh-4.5rem)] flex-col items-center justify-between py-5">
                    <div className="space-y-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                            const Icon = item.icon
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    title={item.label}
                                    aria-label={item.label}
                                    className={clsx(
                                        "inline-flex h-10 w-10 items-center justify-center rounded-full transition-all",
                                        isActive
                                            ? "bg-[#171b2d] text-white shadow-premium-sm"
                                            : "bg-white/90 text-slate-400 hover:bg-white hover:text-slate-700"
                                    )}
                                >
                                    <Icon className="h-4 w-4" />
                                </Link>
                            )
                        })}
                    </div>

                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black text-[14px] font-bold text-white">
                        N
                    </div>
                </aside>

                <div className="neo-panel min-h-[calc(100vh-4.5rem)] p-4 md:p-6">
                    {children}
                </div>
            </div>
        </div>
    )
}
