import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="dashboard-shell relative min-h-dvh w-full bg-bg-main overflow-hidden">
            <header className="absolute top-0 left-0 w-full p-6 z-100 pointer-events-none">
                <div className="mx-auto flex max-w-6xl items-center justify-between">
                    <div className="flex flex-1">
                        <Link
                            href={ROUTES.public.home}
                            className="pointer-events-auto cursor-pointer inline-flex h-10 w-10 items-center justify-center rounded-full border border-border-soft bg-surface-overlay text-secondary-text shadow-sm backdrop-blur-md hover:bg-surface-hover hover:text-primary-dark hover:shadow-premium-sm transition-all"
                            aria-label="Volver a inicio"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </header>
            <div className="mx-auto flex min-h-dvh w-full max-w-6xl items-center justify-center px-4 py-8 md:px-6 relative z-10">
                <div className="neo-panel w-full max-w-md rounded-3xl p-8 sm:p-10 shadow-premium-md relative z-20">
                    {children}
                </div>
            </div>
        </div>
    )
}
