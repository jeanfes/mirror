import { getDictionary } from "@/lib/i18n-server";
import { getServerSession } from "@/lib/auth";
import { ROUTES } from "@/lib/routes";
import { PricingContent } from "@/features/pricing/components/PricingContent";

export default async function PricingPage() {
    const { t } = await getDictionary();
    const user = await getServerSession();
    const ctaHref = user ? ROUTES.private.plans : ROUTES.auth.register;

    return (
        <PricingContent initialT={t} ctaHref={ctaHref} />
    )
}


