import { getDictionary } from "@/lib/i18n-server";
import { ContactContent } from "@/features/contact/components/ContactContent";

export default async function ContactPage() {
    const { t } = await getDictionary();

    return (
        <ContactContent initialT={t} />
    )
}


