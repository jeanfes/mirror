import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="dashboard-shell relative min-h-dvh w-full bg-bg-main overflow-hidden">
            <header className="absolute top-0 left-0 w-full p-6 z-10">
                <div className="mx-auto flex max-w-6xl items-center justify-between">
                    <Link 
                        href="/" 
                        className="inline-flex items-center gap-2 text-sm font-semibold text-secondary-text hover:text-primary-dark transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Volver a inicio
                    </Link>
                    <div className="flex items-center gap-2">
                        <Image src="/icon.png" alt="Mirror Logo" width={24} height={24} className="rounded-md" />
                        <span className="text-[1.1rem] font-black tracking-tighter text-primary-dark">Mirror</span>
                    </div>
                </div>
            </header>
            <div className="mx-auto flex min-h-dvh w-full max-w-6xl items-center justify-center px-4 py-8 md:px-6 relative z-10">
                <div className="neo-panel w-full max-w-md rounded-3xl p-8 sm:p-10 shadow-premium-md relative">
                    {children}
                </div>
            </div>
        </div>
    )
}
