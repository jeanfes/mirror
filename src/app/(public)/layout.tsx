import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative min-h-screen flex flex-col">
            <PublicHeader />
            <div className="flex-1 pt-16">
                {children}
            </div>
            <PublicFooter />
        </div>
    );
}
