"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguageStore } from "@/store/useLanguageStore";
import { ROUTES } from "@/lib/routes";

export function LandingFooter() {
    const { t } = useLanguageStore();
    const currentYear = new Date().getFullYear();

    return (
        <footer id="contact" className="w-full border-t border-border-soft bg-surface-base px-6 py-16">
            <div className="mx-auto max-w-6xl grid gap-12 sm:grid-cols-2 md:grid-cols-4">
                <div className="space-y-4 md:col-span-2">
                    <div className="flex items-center gap-2">
                        <Image src="/icon.png" alt="Mirror Logo" width={32} height={32} className="rounded-lg shadow-sm" />
                        <h3 className="text-xl font-black text-primary-dark">Mirror</h3>
                    </div>
                    <p className="text-[15px] font-medium text-secondary-text max-w-xs">
                        {t.footer.description}
                    </p>
                </div>

                <div className="space-y-4">
                    <h4 className="text-[14px] font-bold text-primary-dark uppercase tracking-wider">{t.footer.product}</h4>
                    <ul className="space-y-3">
                        <li><Link href={ROUTES.public.features} className="text-[14px] font-medium text-secondary-text hover:text-accent-blue transition-colors">{t.header.features}</Link></li>
                        <li><Link href={ROUTES.public.pricing} className="text-[14px] font-medium text-secondary-text hover:text-accent-blue transition-colors">{t.header.pricing}</Link></li>
                        <li><Link href={ROUTES.public.faq} className="text-[14px] font-medium text-secondary-text hover:text-accent-blue transition-colors">{t.header.faq}</Link></li>
                    </ul>
                </div>

                <div className="space-y-4">
                    <h4 className="text-[14px] font-bold text-primary-dark uppercase tracking-wider">{t.footer.contactTitle}</h4>
                    <ul className="space-y-3">
                        <li><a href="mailto:soporte@mirror.com" className="text-[14px] font-medium text-secondary-text hover:text-accent-blue transition-colors">soporte@mirror.com</a></li>
                        <li><Link href="/help" className="text-[14px] font-medium text-secondary-text hover:text-accent-blue transition-colors">{t.footer.helpCenter}</Link></li>
                        <li><Link href="/legal" className="text-[14px] font-medium text-secondary-text hover:text-accent-blue transition-colors">{t.footer.legal}</Link></li>
                    </ul>
                </div>
            </div>

            <div className="mx-auto max-w-6xl mt-16 pt-8 border-t border-border-soft flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-[13px] font-medium text-muted-text">
                    {t.footer.rights.replace("{year}", currentYear.toString())}
                </p>
            </div>
        </footer>
    );
}
