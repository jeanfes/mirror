"use client"

import Link from "next/link"
import { useMemo } from "react"
import { usePathname } from "next/navigation"
import { ROUTES } from "@/lib/routes"
import { Button } from "../ui/Button"
import { MobileSidebar } from "./MobileSidebar"
import { useAccount } from "@/features/billing/hooks/useAccount"
import { getNavItems } from "./nav-items"
import { useLanguageStore } from "@/store/useLanguageStore"
import { useLoadingStore } from "@/store/useLoadingStore"
import { DownloadDropdown } from "../ui/DownloadDropdown"

export function Navbar() {
  const { data: account, isLoading: isAccountLoading } = useAccount()
  const pathname = usePathname()
  const t = useLanguageStore((state) => state.t)
  const isPageLoading = useLoadingStore((state) => state.isPageLoading)

  const navItems = useMemo(() => getNavItems(t), [t])

  const currentSection =
    navItems.find(
      (item) =>
        pathname === item.href || pathname.startsWith(`${item.href}/`)
    )?.label ?? t.app.navigation.profiles

  const isLoading = isAccountLoading || isPageLoading

  return (
    <header className="relative flex pb-3 pt-0 w-full shrink-0 items-center justify-between border-b border-border-soft">
      <div className="flex min-w-0 items-center gap-3">
        <MobileSidebar />
        <h1 className="truncate text-[16px] font-semibold leading-normal tracking-[-0.01em] text-primary-text">
          {isLoading ? t.auth.loading : currentSection}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        {!isLoading && account?.plan === "Free" && (
          <Link href={ROUTES.private.plans}>
            <Button size="md" className="h-8.5 rounded-full px-4 text-[12px]">
              {t.app.navigation.upgrade}
            </Button>
          </Link>
        )}
        {isLoading && (
          <div className="hidden sm:block h-8.5 w-32 animate-pulse rounded-full bg-surface-hover" />
        )}

        <DownloadDropdown className="h-8.5 w-8.5" />
      </div>
    </header>
  )
}
