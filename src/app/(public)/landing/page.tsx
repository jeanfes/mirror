import { getDictionary } from "@/lib/i18n-server";
import { ROUTES } from "@/lib/routes";
import { HeroSection } from "./HeroSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { LandingFeaturesSection } from "./LandingFeaturesSection";
import { CTASection } from "./CTASection";

export default async function LandingPage() {
    const { t } = await getDictionary();

    return (
        <main className="relative flex min-h-screen flex-col items-center overflow-x-hidden pt-10">
            <HeroSection t={t} routes={ROUTES} />
            <HowItWorksSection t={t} />
            <LandingFeaturesSection t={t} />
            <CTASection t={t} routes={ROUTES} />
        </main>
    );
}


