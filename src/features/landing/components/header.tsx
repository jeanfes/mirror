"use client";

import Link from "next/link";
import Image from "next/image";
import { Globe } from "lucide-react";
import { useLanguageStore } from "@/store/useLanguageStore";
import { ROUTES } from "@/lib/routes";

export function LandingHeader() {
    const { language, setLanguage, t } = useLanguageStore();

    return (
        <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
            <header className="flex h-14 w-full max-w-4xl items-center justify-between rounded-full border border-white/40 bg-white/80 px-2 pl-6 backdrop-blur-md shadow-premium-md">
                <div className="flex items-center gap-8">
                    <Link href={ROUTES.public.home} className="flex items-center gap-2 text-[1.15rem] font-black tracking-tighter text-primary-dark mr-2">
                        <Image src="/icon.png" alt="Mirror Logo" width={24} height={24} className="rounded-md" />
                    </Link>

                    <nav className="hidden items-center gap-7 md:flex">
                        <Link href={ROUTES.public.features} className="text-[14px] font-semibold text-secondary-text transition-colors hover:text-primary-dark">{t.header.features}</Link>
                        <Link href={ROUTES.public.pricing} className="text-[14px] font-semibold text-secondary-text transition-colors hover:text-primary-dark">{t.header.pricing}</Link>
                        <Link href={ROUTES.public.faq} className="text-[14px] font-semibold text-secondary-text transition-colors hover:text-primary-dark">{t.header.faq}</Link>
                        <Link href={ROUTES.public.contact} className="text-[14px] font-semibold text-secondary-text transition-colors hover:text-primary-dark">{t.header.contact}</Link>
                    </nav>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative group hidden sm:block">
                        <button
                            className="flex h-10 items-center justify-center gap-1.5 rounded-full px-4 text-secondary-text transition-colors hover:bg-black/5 hover:text-primary-dark"
                        >
                            <Globe className="h-4 w-4" />
                            <span className="text-[12px] font-bold uppercase tracking-wider">{language}</span>
                        </button>

                        <div className="absolute top-full right-0 mt-2 w-36 rounded-2xl bg-white p-2 shadow-premium-md ring-1 ring-border-soft opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 origin-top-right flex flex-col gap-0.5">
                            <button
                                onClick={() => setLanguage("es")}
                                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-bold transition-colors hover:bg-bg-main ${language === 'es' ? 'text-primary-dark bg-bg-main/50' : 'text-secondary-text'}`}
                            >
                                Español
                                {language === "es" && <div className="h-1.5 w-1.5 rounded-full bg-accent-blue" />}
                            </button>
                            <button
                                onClick={() => setLanguage("en")}
                                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-bold transition-colors hover:bg-bg-main ${language === 'en' ? 'text-primary-dark bg-bg-main/50' : 'text-secondary-text'}`}
                            >
                                English
                                {language === "en" && <div className="h-1.5 w-1.5 rounded-full bg-accent-blue" />}
                            </button>
                            <button
                                onClick={() => setLanguage("pt")}
                                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-bold transition-colors hover:bg-bg-main ${language === 'pt' ? 'text-primary-dark bg-bg-main/50' : 'text-secondary-text'}`}
                            >
                                Português
                                {language === "pt" && <div className="h-1.5 w-1.5 rounded-full bg-accent-blue" />}
                            </button>
                            <button
                                onClick={() => setLanguage("fr")}
                                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-bold transition-colors hover:bg-bg-main ${language === 'fr' ? 'text-primary-dark bg-bg-main/50' : 'text-secondary-text'}`}
                            >
                                Français
                                {language === "fr" && <div className="h-1.5 w-1.5 rounded-full bg-accent-blue" />}
                            </button>
                            <button
                                onClick={() => setLanguage("de")}
                                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-bold transition-colors hover:bg-bg-main ${language === 'de' ? 'text-primary-dark bg-bg-main/50' : 'text-secondary-text'}`}
                            >
                                Deutsch
                                {language === "de" && <div className="h-1.5 w-1.5 rounded-full bg-accent-blue" />}
                            </button>
                        </div>
                    </div>
                    <Link
                        href={ROUTES.auth.login}
                        className="flex h-10 items-center justify-center rounded-full px-5 text-[14px] font-bold text-primary-dark transition-colors hover:bg-black/5"
                    >
                        {t.header.login}
                    </Link>
                    <Link
                        href={ROUTES.auth.register}
                        className="neo-btn-primary flex h-10 items-center justify-center rounded-full px-6 text-[14px] font-bold shadow-premium-sm"
                    >
                        {t.header.register}
                    </Link>
                </div>
            </header>
        </div>
    );
}
