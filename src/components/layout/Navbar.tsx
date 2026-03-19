"use client"

import { usePathname } from "next/navigation"
import { Button } from "../ui/Button"
import { MobileSidebar } from "./MobileSidebar"
import { useAccount } from "@/features/billing/hooks/useAccount"
import { getNavItems } from "./nav-items"
import { useLanguageStore } from "@/store/useLanguageStore"

export function Navbar() {
    const { data: account } = useAccount()
    const pathname = usePathname()
    const { t } = useLanguageStore()
    const navItems = getNavItems(t)

    const currentSection =
        navItems.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))?.label ?? t.app.navigation.profiles

    return (
        <header className="relative flex pb-2 pt-1 w-full shrink-0 items-center justify-between border-b border-border-soft px-1 md:px-2">
            <div className="flex min-w-0 items-center gap-3">
                <MobileSidebar />
                <h1 className="truncate text-[16px] font-semibold tracking-[-0.01em] text-primary-text">{currentSection}</h1>
            </div>

            {account?.plan === "Free" ? (
                <Button size="md" className="h-8 rounded-full px-3.5 text-[12px]">
                    Upgrade
                </Button>
            ) : <div className="h-8 w-22.5" aria-hidden="true" />}
        </header>
    )
}
