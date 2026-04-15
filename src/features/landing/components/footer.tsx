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
      <div className="mx-auto grid max-w-6xl gap-12 sm:grid-cols-2 md:grid-cols-4">
        <div className="space-y-4 md:col-span-2">
          <div className="flex items-center gap-2">
            <Image src="/icon.png" alt="Mirror Logo" width={32} height={32} className="rounded-lg shadow-sm" />
            <h3 className="text-xl font-black text-primary-dark">Mirror</h3>
          </div>
          <p className="max-w-xs text-[15px] font-medium text-secondary-text">
            {t.footer.description}
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="text-[14px] font-bold uppercase tracking-wider text-primary-dark">
            {t.footer.product}
          </h4>
          <ul className="space-y-3">
            <li><Link href={ROUTES.public.features} className="text-[14px] font-medium text-secondary-text hover:text-accent-blue transition-colors">{t.header.features}</Link></li>
            <li><Link href={ROUTES.public.pricing} className="text-[14px] font-medium text-secondary-text hover:text-accent-blue transition-colors">{t.header.pricing}</Link></li>
            <li><Link href={ROUTES.public.faq} className="text-[14px] font-medium text-secondary-text hover:text-accent-blue transition-colors">{t.header.faq}</Link></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-[14px] font-bold uppercase tracking-wider text-primary-dark">
            {t.footer.contactTitle}
          </h4>
          <ul className="space-y-3">
            <li>
              <a href={`mailto:${t.footer.supportEmail}`} className="text-[14px] font-medium text-secondary-text hover:text-accent-blue transition-colors">
                {t.footer.supportEmail}
              </a>
            </li>
            <li><Link href={ROUTES.public.faq} className="text-[14px] font-medium text-secondary-text hover:text-accent-blue transition-colors">{t.footer.helpCenter}</Link></li>
            <li className="pt-1">
              <Link href={ROUTES.public.terms} className="text-[14px] font-medium text-secondary-text hover:text-accent-blue transition-colors">
                {t.footer.termsOfUse}
              </Link>
            </li>
            <li>
              <Link href={ROUTES.public.privacy} className="text-[14px] font-medium text-secondary-text hover:text-accent-blue transition-colors">
                {t.footer.privacyPolicy}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-16 flex max-w-6xl flex-col items-center justify-between gap-4 border-t border-border-soft pt-8 sm:flex-row">
        <p className="text-[13px] font-medium text-muted-text">
          {t.footer.rights.replace("{year}", String(currentYear))}
        </p>
      </div>
    </footer>
  );
}