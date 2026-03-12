import Link from "next/link";

export default function LandingPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-8 text-center">
            <div className="space-y-3">
                <h1 className="text-4xl font-bold text-[#141824]">Mirror</h1>
                <p className="text-[16px] text-slate-600">Tu workspace de voz digital privado.</p>
            </div>
            <div className="flex gap-3">
                <Link
                    href="/login"
                    className="rounded-xl border border-[#E6EAF2] bg-white px-5 py-2 text-[14px] font-semibold text-[#141824] hover:bg-slate-50"
                >
                    Iniciar sesión
                </Link>
                <Link
                    href="/register"
                    className="rounded-xl bg-[#1A1D26] px-5 py-2 text-[14px] font-semibold text-white hover:bg-[#141824]"
                >
                    Crear cuenta
                </Link>
            </div>
        </main>
    )
}
