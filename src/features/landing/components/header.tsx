"use client";

import Link from "next/link";
import Image from "next/image";
import { Globe } from "lucide-react";
import { useLanguageStore } from "@/store/useLanguageStore";

export function LandingHeader() {
    const { language, setLanguage, t } = useLanguageStore();

    return (
        <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
            <header className="flex h-14 w-full max-w-4xl items-center justify-between rounded-full border border-white/40 bg-white/80 px-2 pl-6 backdrop-blur-md shadow-premium-md">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2 text-[1.15rem] font-black tracking-tighter text-primary-dark mr-2">
                        <Image src="/icon.png" alt="Mirror Logo" width={24} height={24} className="rounded-md" />
                    </Link>
                    
                    <nav className="hidden items-center gap-7 md:flex">
                        <Link href="/features" className="text-[14px] font-semibold text-secondary-text transition-colors hover:text-primary-dark">{t.header.features}</Link>
                        <Link href="/pricing" className="text-[14px] font-semibold text-secondary-text transition-colors hover:text-primary-dark">{t.header.pricing}</Link>
                        <Link href="/faq" className="text-[14px] font-semibold text-secondary-text transition-colors hover:text-primary-dark">{t.header.faq}</Link>
                        <Link href="/contact" className="text-[14px] font-semibold text-secondary-text transition-colors hover:text-primary-dark">{t.header.contact}</Link>
                    </nav>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative group flex items-center hidden sm:flex">
                        <Globe className="absolute left-3 h-4 w-4 text-secondary-text pointer-events-none transition-colors group-hover:text-primary-dark" />
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value as "es" | "en")}
                            className="appearance-none h-10 bg-transparent text-secondary-text font-bold text-[12px] uppercase tracking-wider pl-9 pr-4 rounded-full hover:bg-black/5 hover:text-primary-dark transition-colors cursor-pointer outline-none focus:ring-2 focus:ring-black/5"
                        >
                            <option value="es">ES</option>
                            <option value="en">EN</option>
                        </select>
                    </div>
                    <Link
                        href="/login"
                        className="flex h-10 items-center justify-center rounded-full px-5 text-[14px] font-bold text-primary-dark transition-colors hover:bg-black/5"
                    >
                        {t.header.login}
                    </Link>
                    <Link
                        href="/register"
                        className="neo-btn-primary flex h-10 items-center justify-center rounded-full px-6 text-[14px] font-bold shadow-premium-sm"
                    >
                        {t.header.register}
                    </Link>
                </div>
            </header>
        </div>
    );
}
