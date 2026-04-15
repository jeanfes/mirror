import { getDictionary } from "@/lib/i18n-server";
import { ROUTES } from "@/lib/routes";
import { LandingContent } from "@/features/landing/components/LandingContent";

export default async function LandingPage() {
    const { t } = await getDictionary();

    return (
        <LandingContent initialT={t} routes={ROUTES} />
    );
}


