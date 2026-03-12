"use client";

import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
    return (
        <main className="relative flex w-full flex-col items-center overflow-x-hidden pt-10 pb-20">
            <section className="w-full max-w-5xl px-6 pt-20 pb-16 text-center z-10">
                <h1 className="animate-fade-in-up text-5xl font-black tracking-tighter text-primary-dark sm:text-6xl md:text-[4.5rem] leading-[1.1] mb-6">
                    Membresías <span className="text-mirror font-extrabold pb-2">Claras</span>
                </h1>
                <p className="animate-fade-in-up delay-100 mx-auto max-w-2xl text-[1.125rem] text-secondary-text md:text-[1.25rem] leading-relaxed font-medium">
                    Planes diseñados a tu medida. Empieza a usar Mirror gratis desde ahora y escala cuando lo necesites.
                </p>
            </section>

            <section className="w-full max-w-5xl px-6 py-12">
                <div className="grid gap-8 md:grid-cols-2 lg:gap-12 items-center max-w-4xl mx-auto">
                    
                    {/* Free Plan */}
                    <div className="animate-fade-in-up delay-200 neo-card p-10 flex flex-col border border-border-light h-full">
                        <div className="mb-6">
                            <h2 className="text-2xl font-black text-primary-dark">Plan Básico</h2>
                            <p className="text-secondary-text font-medium mt-2">Para usuarios ocasionales y testers</p>
                        </div>
                        <div className="mb-8 flex items-baseline gap-2">
                            <span className="text-5xl font-black text-primary-dark">$0</span>
                            <span className="text-secondary-text font-medium">/ mes</span>
                        </div>
                        <ul className="space-y-4 mb-10 flex-1">
                            {["50 autocompletados al mes", "1 Perfil guardado", "Configuraciones básicas", "Soporte comunitario"].map((feature, i) => (
                                <li key={i} className="flex items-center gap-3 text-[1.05rem] text-primary-dark font-medium">
                                    <CheckCircle2 className="h-5 w-5 text-accent-blue" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <Link href="/register" className="neo-btn-muted text-center py-4 text-[1.05rem] font-bold w-full transition-all">
                            Empieza Gratis
                        </Link>
                    </div>

                    {/* Pro Plan */}
                    <div className="animate-fade-in-up delay-300 neo-shell p-10 flex flex-col relative transform md:-translate-y-4 shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
                        <div className="absolute top-0 right-10 -translate-y-1/2 bg-accent-blue text-white text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-full shadow-sm">
                            Popular
                        </div>
                        <div className="mb-6">
                            <h2 className="text-2xl font-black text-primary-dark">Plan Profesional</h2>
                            <p className="text-primary-dark/70 font-medium mt-2">Para expertos en networking</p>
                        </div>
                        <div className="mb-8 flex items-baseline gap-2">
                            <span className="text-5xl font-black text-primary-dark">$15</span>
                            <span className="text-primary-dark/70 font-medium">/ mes</span>
                        </div>
                        <ul className="space-y-4 mb-10 flex-1">
                            {["Comentarios Ilimitados", "Perfiles y Personas ilimitadas", "Modos avanzados interactivos", "Soporte técnico prioritario 24/7"].map((feature, i) => (
                                <li key={i} className="flex items-center gap-3 text-[1.05rem] text-primary-dark font-medium">
                                    <CheckCircle2 className="h-5 w-5 text-accent-blue" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <Link href="/register" className="neo-btn-primary text-center py-4 text-[1.05rem] font-bold w-full">
                            Obtener Premium
                        </Link>
                    </div>

                </div>
            </section>
        </main>
    )
}
