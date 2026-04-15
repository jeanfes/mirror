"use client";

import Link from "next/link";
import Image from "next/image";
import { Globe } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useLanguageStore } from "@/store/useLanguageStore";
import { ROUTES } from "@/lib/routes";
import { DownloadDropdown } from "@/components/ui/DownloadDropdown";

export function LandingHeader() {
    const { language, setLanguage, t } = useLanguageStore();

    return (
        <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-3 sm:px-4">
            <header className="flex h-16 w-full max-w-5xl items-center justify-between rounded-full border border-border-soft bg-surface-overlay px-3 sm:px-5 lg:px-6 backdrop-blur-md shadow-premium-md">
                <div className="flex min-w-0 items-center gap-4 lg:gap-7">
                    <Link href={ROUTES.public.index} className="flex shrink-0 items-center gap-2 text-[1.15rem] font-black tracking-tighter text-primary-dark">
                        <Image src="/icon.png" alt="Mirror Logo" width={24} height={24} className="rounded-md" />
                    </Link>

                    <nav className="hidden min-w-0 items-center gap-5 lg:gap-7 md:flex">
                        <Link href={ROUTES.public.features} className="text-[13px] lg:text-[14px] font-semibold text-secondary-text transition-colors hover:text-primary-dark">{t.header.features}</Link>
                        <Link href={ROUTES.public.pricing} className="text-[13px] lg:text-[14px] font-semibold text-secondary-text transition-colors hover:text-primary-dark">{t.header.pricing}</Link>
                        <Link href={ROUTES.public.faq} className="text-[13px] lg:text-[14px] font-semibold text-secondary-text transition-colors hover:text-primary-dark">{t.header.faq}</Link>
                        <Link href={ROUTES.public.contact} className="text-[13px] lg:text-[14px] font-semibold text-secondary-text transition-colors hover:text-primary-dark">{t.header.contact}</Link>
                    </nav>
                </div>

                <div className="ml-2 flex shrink-0 items-center gap-1.5 sm:gap-2">
                    <DownloadDropdown />
                    <ThemeToggle className="h-10" />
                    <div className="relative group hidden sm:block">
                        <button
                            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full border border-border-soft bg-surface-subtle px-3 text-secondary-text transition-all duration-150 hover:bg-surface-hover hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/35 lg:px-4"
                        >
                            <Globe className="h-4 w-4" />
                            <span className="hidden md:inline text-[12px] font-bold uppercase tracking-wider">{language}</span>
                        </button>

                        <div className="absolute top-full right-0 mt-3 flex w-40 origin-top-right flex-col gap-0.5 rounded-[14px] border border-border-soft bg-surface-solid p-1.5 shadow-premium-lg opacity-0 invisible translate-y-2 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-hover:visible">
                            {[
                                { code: "es", label: "Español" },
                                { code: "en", label: "English" },
                                { code: "pt", label: "Português" },
                                { code: "fr", label: "Français" },
                                { code: "de", label: "Deutsch" },
                            ].map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => setLanguage(lang.code as "es" | "en" | "pt" | "fr" | "de")}
                                    className={`relative flex w-full items-center justify-between rounded-[10px] px-3 py-2 text-[13px] outline-none transition-colors ${language === lang.code
                                            ? "border border-border-light bg-surface-elevated text-primary-dark shadow-premium-sm"
                                            : "border border-transparent bg-transparent text-secondary-text hover:border-border-soft hover:bg-surface-hover hover:text-primary-dark"
                                        }`}
                                >
                                    {lang.label}
                                    {language === lang.code && (
                                        <div className="h-1.5 w-1.5 rounded-full bg-accent-blue shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                    <Link
                        href={ROUTES.auth.login}
                        className="flex h-10 items-center justify-center rounded-full px-4 lg:px-5 text-[13px] lg:text-[14px] font-bold text-primary-dark transition-colors hover:bg-surface-hover"
                    >
                        {t.header.login}
                    </Link>
                    <Link
                        href={ROUTES.auth.register}
                        className="neo-btn-primary flex h-10 items-center justify-center rounded-full px-5 lg:px-6 text-[13px] lg:text-[14px] font-bold shadow-premium-sm"
                    >
                        {t.header.register}
                    </Link>
                </div>
            </header>
        </div>
    );
}
