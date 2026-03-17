"use client";

import Link from "next/link";
import Image from "next/image";
import { Globe } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useLanguageStore } from "@/store/useLanguageStore";
import { ROUTES } from "@/lib/routes";

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
                    <ThemeToggle className="h-10" />
                    <div className="relative group hidden sm:block">
                        <button
                            className="flex h-10 items-center justify-center gap-1.5 rounded-full px-3 lg:px-4 text-secondary-text transition-colors hover:bg-surface-hover hover:text-primary-dark"
                        >
                            <Globe className="h-4 w-4" />
                            <span className="hidden md:inline text-[12px] font-bold uppercase tracking-wider">{language}</span>
                        </button>

                        <div className="absolute top-full right-0 mt-2 w-36 rounded-2xl border border-border-soft bg-surface-overlay-strong p-2 shadow-premium-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 origin-top-right flex flex-col gap-0.5">
                            <button
                                onClick={() => setLanguage("es")}
                                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-bold transition-colors hover:bg-surface-hover ${language === 'es' ? 'text-primary-dark bg-surface-base' : 'text-secondary-text'}`}
                            >
                                Español
                                {language === "es" && <div className="h-1.5 w-1.5 rounded-full bg-accent-blue" />}
                            </button>
                            <button
                                onClick={() => setLanguage("en")}
                                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-bold transition-colors hover:bg-surface-hover ${language === 'en' ? 'text-primary-dark bg-surface-base' : 'text-secondary-text'}`}
                            >
                                English
                                {language === "en" && <div className="h-1.5 w-1.5 rounded-full bg-accent-blue" />}
                            </button>
                            <button
                                onClick={() => setLanguage("pt")}
                                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-bold transition-colors hover:bg-surface-hover ${language === 'pt' ? 'text-primary-dark bg-surface-base' : 'text-secondary-text'}`}
                            >
                                Português
                                {language === "pt" && <div className="h-1.5 w-1.5 rounded-full bg-accent-blue" />}
                            </button>
                            <button
                                onClick={() => setLanguage("fr")}
                                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-bold transition-colors hover:bg-surface-hover ${language === 'fr' ? 'text-primary-dark bg-surface-base' : 'text-secondary-text'}`}
                            >
                                Français
                                {language === "fr" && <div className="h-1.5 w-1.5 rounded-full bg-accent-blue" />}
                            </button>
                            <button
                                onClick={() => setLanguage("de")}
                                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-bold transition-colors hover:bg-surface-hover ${language === 'de' ? 'text-primary-dark bg-surface-base' : 'text-secondary-text'}`}
                            >
                                Deutsch
                                {language === "de" && <div className="h-1.5 w-1.5 rounded-full bg-accent-blue" />}
                            </button>
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
