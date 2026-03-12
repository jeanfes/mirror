import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MessageSquareText, ShieldCheck, Zap, UserCircle, Rocket } from "lucide-react";

export default function LandingPage() {
    return (
        <main className="dashboard-shell relative flex min-h-screen flex-col items-center overflow-x-hidden pt-10">
            {/* Hero Section */}
            <section className="relative w-full max-w-6xl px-6 pt-24 pb-20 text-center md:pt-40 md:pb-32 z-10">
                <div className="absolute top-24 left-10 hidden animate-[bounce_3s_infinite] lg:block md:block">
                    <div className="neo-shell flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-2xl shadow-premium-md">
                        <MessageSquareText className="h-9 w-9 text-accent-blue" />
                    </div>
                </div>
                <div className="absolute top-44 right-10 hidden animate-[bounce_4s_infinite] lg:block md:block -translate-y-4">
                    <div className="neo-shell flex h-16 w-16 items-center justify-center rounded-2xl shadow-premium-md">
                        <Zap className="h-8 w-8 text-accent-orange" />
                    </div>
                </div>
                
                <div className="mx-auto max-w-3xl space-y-7">

                    
                    <h1 className="text-5xl font-black tracking-tighter text-primary-dark sm:text-6xl md:text-[5rem] leading-[1.1]">
                        Interactúa en LinkedIn <br className="hidden md:block"/> con <span className="text-accent-blue font-extrabold">Inteligencia</span>
                    </h1>
                    <p className="mx-auto max-w-2xl text-[1.125rem] text-secondary-text md:text-[1.25rem] leading-relaxed font-medium">
                        Genera comentarios relevantes, aporta valor y gestiona múltiples perfiles con tu asistente privado impulsado por IA. Directamente en tu navegador.
                    </p>
                    
                    <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/register"
                            className="neo-btn-primary group flex h-14 items-center gap-2 px-9 text-[1.05rem] font-bold shadow-premium-md"
                        >
                            Comenzar gratis
                            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </Link>
                        <Link
                            href="/login"
                            className="neo-btn-muted flex h-14 items-center px-9 text-[1.05rem] font-bold shadow-premium-sm"
                        >
                            Iniciar sesión
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="w-full py-24 pb-32 relative z-10">
                <div className="mx-auto max-w-6xl px-6">
                    <div className="mb-16 text-center space-y-4">
                        <h2 className="text-3xl font-black tracking-tight text-primary-dark sm:text-5xl">Todo en un solo lugar</h2>
                        <p className="mx-auto max-w-2xl text-secondary-text text-[1.1rem] font-medium">Eficiencia y productividad al alcance de un clic. Potencia tu networking con estas herramientas.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        {/* Feature 1 */}
                        <div className="neo-card p-10 group transition-all duration-300 hover:-translate-y-2 hover:shadow-premium-md">
                            <div className="mb-8 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-blue/15 text-accent-blue transition-colors group-hover:bg-accent-blue/25">
                                <Zap className="h-7 w-7" strokeWidth={2.5} />
                            </div>
                            <h3 className="mb-3 text-[1.35rem] font-black tracking-tight text-primary-dark">Smart Automation</h3>
                            <p className="text-secondary-text text-[1rem] leading-relaxed font-medium">
                                Detecta automáticamente las cajas de comentarios en LinkedIn y muestra nuestro launcher flotante listos para asistir.
                            </p>
                        </div>
                        
                        {/* Feature 2 */}
                        <div className="neo-card p-10 group transition-all duration-300 hover:-translate-y-2 hover:shadow-premium-md">
                            <div className="mb-8 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-purple/15 text-accent-purple transition-colors group-hover:bg-accent-purple/25">
                                <UserCircle className="h-7 w-7" strokeWidth={2.5} />
                            </div>
                            <h3 className="mb-3 text-[1.35rem] font-black tracking-tight text-primary-dark">Múltiples Perfiles</h3>
                            <p className="text-secondary-text text-[1rem] leading-relaxed font-medium">
                                Configura distintos tonos y objetivos (Networking, Debatir, Pregunta) para que la IA genere el mensaje perfecto cada vez.
                            </p>
                        </div>
                        
                        {/* Feature 3 */}
                        <div className="neo-card p-10 group transition-all duration-300 hover:-translate-y-2 hover:shadow-premium-md">
                            <div className="mb-8 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-green/15 text-accent-green transition-colors group-hover:bg-accent-green/25">
                                <ShieldCheck className="h-7 w-7" strokeWidth={2.5} />
                            </div>
                            <h3 className="mb-3 text-[1.35rem] font-black tracking-tight text-primary-dark">Privacidad Local</h3>
                            <p className="text-secondary-text text-[1rem] leading-relaxed font-medium">
                                Tus borradores, historial y configuración se guardan de forma segura en el almacenamiento de tu navegador. Tienes el control total.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section id="contact" className="w-full max-w-5xl px-6 pb-40 relative z-10">
                <div className="neo-shell relative overflow-hidden rounded-[2.5rem] p-12 text-center shadow-premium-md sm:p-20 border-white/40">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/40 to-white/10" />
                    <div className="relative z-10 space-y-8">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.25rem] bg-white shadow-premium-sm text-primary-dark">
                            <Rocket className="h-10 w-10 text-accent-purple" />
                        </div>
                        <h2 className="text-4xl font-black tracking-tight text-primary-dark sm:text-5xl text-balance">
                            Transforma tu manera de hacer networking hoy.
                        </h2>
                        <p className="mx-auto max-w-2xl text-secondary-text text-[1.1rem] text-balance font-medium">
                            Empieza gratis y experimenta el futuro de las interacciones profesionales en LinkedIn. Ahorra horas cada semana.
                        </p>
                        <div className="pt-4">
                            <Link href="/register" className="neo-btn-primary inline-flex h-14 items-center px-10 text-[1.05rem] font-bold shadow-premium-md">
                                Crear tu cuenta gratis
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
