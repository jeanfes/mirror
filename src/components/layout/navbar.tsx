"use client"

import { usePathname } from "next/navigation"
import { Button } from "../ui/Button"
import { MobileSidebar } from "./mobile-sidebar"
import { useAccount } from "@/features/billing/hooks/useAccount"

const SECTION_TITLES = [
    { href: "/profiles", label: "Profiles" },
    { href: "/history", label: "History" },
    { href: "/settings", label: "Settings" },
    { href: "/account", label: "Account" },
    { href: "/plans", label: "Plans" },
    { href: "/trash", label: "Trash" }
] as const

export function Navbar() {
    const { data: account } = useAccount()
    const pathname = usePathname()

    const currentSection =
        SECTION_TITLES.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))?.label ?? "Profiles"

    return (
        <header className="relative flex h-14 w-full items-center justify-between rounded-[18px] border border-border-light bg-white/78 px-3 py-2 backdrop-blur-sm ring-1 ring-white/60 shadow-premium-sm md:px-4">
            <div className="flex min-w-0 items-center gap-3">
                <MobileSidebar />
                <h1 className="truncate text-[14px] font-semibold tracking-[-0.01em] text-primary-text">{currentSection}</h1>
            </div>

            {account?.plan === "Free" ? (
                <Button size="md" className="h-8 rounded-full px-3.5 text-[12px]">
                    Upgrade
                </Button>
            ) : <div className="h-8 w-22.5" aria-hidden="true" />}
        </header>
    )
}
