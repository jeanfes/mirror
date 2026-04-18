import { PricingCard } from "@/features/pricing/components/PricingCard";
import { getDictionary } from "@/lib/i18n-server";
import { getServerSession } from "@/lib/auth";
import { ROUTES } from "@/lib/routes";

export default async function PricingPage() {
    const { t } = await getDictionary();
    const user = await getServerSession();
    const ctaHref = user ? ROUTES.private.plans : ROUTES.auth.register;

    const plans = [
        {
            name: t.pricing.freePlan,
            desc: t.pricing.freeDesc,
            price: "$0",
            features: t.pricing.freeFeatures,
            buttonText: t.pricing.freeBtn,
        },
        {
            name: t.pricing.proPlan,
            desc: t.pricing.proDesc,
            price: "$19",
            features: t.pricing.proFeatures,
            buttonText: t.pricing.proBtn,
            popular: true,
        }
    ];

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
                <div className="absolute inset-0 top-1/2 -z-10 -translate-y-1/2 w-[800px] h-[400px] left-1/2 -translate-x-1/2 bg-[radial-gradient(ellipse,rgba(139,92,246,0.15)_0%,transparent_70%)] rounded-full blur-[80px] pointer-events-none" />
                <div className="grid gap-6 md:grid-cols-[1fr_1.2fr] md:items-center md:gap-0 mx-auto max-w-4xl">
                    {plans.map((plan, i) => (
                        <PricingCard
                            key={plan.name}
                            plan={plan}
                            index={i}
                            href={ctaHref}
                            perMonthText={t.pricing.perMonth}
                            popularText={t.pricing.popular}
                        />
                    ))}
                </div>
            </section>
        </main>
    )
}


