import Link from "next/link";
import Image from "next/image";
import { Globe } from "lucide-react";

export function PublicHeader() {
    return (
        <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
            <header className="flex h-[3.5rem] w-full max-w-4xl items-center justify-between rounded-full border border-white/40 bg-white/80 px-2 pl-6 backdrop-blur-md shadow-premium-md">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2 text-[1.15rem] font-black tracking-tighter text-primary-dark mr-2">
                        <Image src="/icon.png" alt="Mirror Logo" width={24} height={24} className="rounded-md" />
                    </Link>
                    
                    <nav className="hidden items-center gap-7 md:flex">
                        <Link href="#features" className="text-[14px] font-semibold text-secondary-text transition-colors hover:text-primary-dark">Features</Link>
                        <Link href="#pricing" className="text-[14px] font-semibold text-secondary-text transition-colors hover:text-primary-dark">Pricing</Link>
                        <Link href="#faq" className="text-[14px] font-semibold text-secondary-text transition-colors hover:text-primary-dark">FAQ</Link>
                        <Link href="#contact" className="text-[14px] font-semibold text-secondary-text transition-colors hover:text-primary-dark">Contact</Link>
                    </nav>
                </div>

                <div className="flex items-center gap-2">
                    <button className="hidden h-9 w-9 items-center justify-center rounded-full text-secondary-text transition-colors hover:bg-black/5 hover:text-primary-dark sm:flex">
                        <Globe className="h-4 w-4" />
                    </button>
                    <Link
                        href="/login"
                        className="flex h-10 items-center justify-center rounded-full px-5 text-[14px] font-bold text-primary-dark transition-colors hover:bg-black/5"
                    >
                        Sign in
                    </Link>
                    <Link
                        href="/register"
                        className="neo-btn-primary flex h-10 items-center justify-center rounded-full px-6 text-[14px] font-bold shadow-premium-sm"
                    >
                        Get Started
                    </Link>
                </div>
            </header>
        </div>
    );
}
