import { getDictionary } from "@/lib/i18n-server";
import { ROUTES } from "@/lib/routes";
import { FAQContent } from "@/features/faq/components/FAQContent";

export default async function FAQPage() {
    const { t } = await getDictionary();

    return (
        <FAQContent initialT={t} routes={ROUTES} />
    )
}

