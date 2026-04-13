import { LandingFooter } from "@/features/landing/components/footer";
import { LandingHeader } from "@/features/landing/components/header";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative flex min-h-dvh flex-col">
            <LandingHeader />
            <div className="flex-1 pt-24">
                {children}
            </div>
            <LandingFooter />
        </div>
    );
}
