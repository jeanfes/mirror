import { getDictionary } from "@/lib/i18n-server";
import { ROUTES } from "@/lib/routes";
import { HeroSection } from "@/features/landing/components/HeroSection";
import { HowItWorksSection } from "@/features/landing/components/HowItWorksSection";
import { CTASection } from "@/features/landing/components/CTASection";
import { FeaturesSection } from "@/features/landing/components/FeaturesSection";

export default async function LandingPage() {
    const { t } = await getDictionary();

    return (
        <main className="relative flex flex-col items-center overflow-x-hidden pt-10">
            <HeroSection t={t} routes={ROUTES} />
            <HowItWorksSection t={t} />
            <FeaturesSection t={t} />
            <CTASection t={t} routes={ROUTES} />
        </main>
    );
}


