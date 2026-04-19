import { getDictionary } from "@/lib/i18n-server";
import { FeaturesContent } from "@/features/landing/components/FeaturesContent";

export default async function FeaturesPage() {
    const { t } = await getDictionary();

    return (
        <FeaturesContent initialT={t} />
    )
}


