"use client";

import { Zap, UserCircle, PenTool, Brain } from "lucide-react";

export default function FeaturesPage() {
    return (
        <main className="relative flex min-h-screen flex-col items-center overflow-x-hidden pt-10 pb-20">
            <section className="w-full max-w-5xl px-6 pt-20 pb-16 text-center z-10">
                <h1 className="animate-fade-in-up text-5xl font-black tracking-tighter text-primary-dark sm:text-6xl md:text-[4.5rem] leading-[1.1] mb-6">
                    <span className="text-mirror pb-2 font-extrabold">Automatización</span> al máximo
                </h1>
                <p className="animate-fade-in-up delay-100 mx-auto max-w-2xl text-[1.125rem] text-secondary-text md:text-[1.25rem] font-medium leading-relaxed">
                    Descubre todas las herramientas incluidas en Mirror para llevar tu networking en LinkedIn a otro nivel sin comprometer tu privacidad ni tu tiempo.
                </p>
            </section>

            <section className="w-full max-w-5xl px-6 py-12">
                <div className="grid gap-12 sm:grid-cols-2">
                    
                    {/* Feature Card Detailed */}
                    <div className="animate-fade-in-up delay-200 neo-shell p-10 flex flex-col items-start gap-4">
                        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-premium-sm ring-1 ring-border-soft">
                            <Zap className="h-8 w-8 text-primary-dark" />
                        </div>
                        <h2 className="text-2xl font-black text-primary-dark">Floating Launcher Dinámico</h2>
                        <p className="text-secondary-text text-[1.05rem] leading-relaxed font-medium">
                            Nuestra extensión inyecta un launcher elegante justo debajo de la caja de comentarios en cualquier perfil de LinkedIn. Aparece justo a tiempo, sin entorpecer visualmente la página principal, permitiéndote abrir la interfaz de Mirror a la velocidad de la luz.
                        </p>
                    </div>

                    <div className="animate-fade-in-up delay-300 neo-shell p-10 flex flex-col items-start gap-4">
                        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-premium-sm ring-1 ring-border-soft">
                            <Brain className="h-8 w-8 text-primary-dark" />
                        </div>
                        <h2 className="text-2xl font-black text-primary-dark">Prompt Engineering Preciso</h2>
                        <p className="text-secondary-text text-[1.05rem] leading-relaxed font-medium">
                            En el fondo de Mirror vive un motor de prompting contextual. Analiza sutilmente la publicación que estás comentando para que la IA genere un texto coherente, relevante y que realmente impulse la conversación (aportando valor o haciendo preguntas clave).
                        </p>
                    </div>

                    <div className="animate-fade-in-up delay-400 neo-shell p-10 flex flex-col items-start gap-4">
                        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-premium-sm ring-1 ring-border-soft">
                            <UserCircle className="h-8 w-8 text-primary-dark" />
                        </div>
                        <h2 className="text-2xl font-black text-primary-dark">Múltiples Personas</h2>
                        <p className="text-secondary-text text-[1.05rem] leading-relaxed font-medium">
                            ¿Necesitas sonar corporativo un día y más casual otro? Mirror te permite guardar Personas o perfiles con tus propios adjetivos, tono y nivel de formalidad. Alterna entre tu perfil de directivo y tu perfil creativo en dos clics.
                        </p>
                    </div>

                    <div className="animate-fade-in-up delay-500 neo-shell p-10 flex flex-col items-start gap-4">
                        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-premium-sm ring-1 ring-border-soft">
                            <PenTool className="h-8 w-8 text-primary-dark" />
                        </div>
                        <h2 className="text-2xl font-black text-primary-dark">Editor Preview y Borradores</h2>
                        <p className="text-secondary-text text-[1.05rem] leading-relaxed font-medium">
                            La IA nunca comenta de forma automática. Todo mensaje pasa por un panel de *Preview* donde puedes ajustarlo, afinarlo mentalmente y guardarlo como borrador hasta que consideres que está perfecto para enviarlo a la red.
                        </p>
                    </div>

                </div>
            </section>
        </main>
    )
}
