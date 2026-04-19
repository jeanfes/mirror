import { PricingCard } from "@/features/pricing/components/PricingCard";
import { getDictionary } from "@/lib/i18n-server";
import { getServerSession } from "@/lib/auth";
import { ROUTES } from "@/lib/routes";
import { planDefinitions } from "@/features/billing/services/billing.service";

export default async function PricingPage() {
    const { t } = await getDictionary();
    const user = await getServerSession();
    const ctaHref = user ? ROUTES.private.plans : ROUTES.auth.register;

    const plansToRender = planDefinitions.map((plan) => ({
        plan,
        buttonText: plan.name === "Free" ? t.pricing.freeBtn : t.pricing.proBtn
    }));

    return (
        <main className="relative flex w-full flex-col items-center overflow-x-hidden pt-10 pb-20">
            <section className="w-full max-w-5xl px-6 pt-20 pb-16 text-center z-10">
                <h1 className="text-5xl font-black tracking-tighter text-primary-dark sm:text-6xl md:text-[4.5rem] leading-[1.1] mb-6">
                    {t.pricing.title1} <span className="text-mirror font-extrabold pb-2">{t.pricing.titleSpan}</span>
                </h1>
                <p className="mx-auto max-w-2xl text-[1.125rem] text-secondary-text md:text-[1.25rem] leading-relaxed font-medium">
                    {t.pricing.subtitle}
                </p>
            </section>

            <section className="relative w-full max-w-5xl px-6 py-20 mx-auto">
                <div className="pointer-events-none absolute inset-0 top-1/2 left-1/2 -z-10 h-100 w-200 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(139,92,246,0.15)_0%,transparent_70%)] blur-[80px]" />
                <div className="grid gap-6 md:grid-cols-2 md:items-center md:gap-8 mx-auto max-w-4xl">
                    {plansToRender.map(({ plan, buttonText }, i) => (
                        <PricingCard
                            key={plan.name}
                            plan={plan}
                            index={i}
                            href={ctaHref}
                            perMonthText={t.pricing.perMonth}
                            popularText={t.pricing.popular}
                            buttonText={buttonText}
                        />
                    ))}
                </div>
            </section>
        </main>
    )
}


