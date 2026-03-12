"use client";

import { Mail, Send, MessageSquare } from "lucide-react";

export default function ContactPage() {
    return (
        <main className="relative flex w-full flex-col items-center overflow-x-hidden pt-10 pb-20">
            <section className="w-full max-w-4xl px-6 pt-20 pb-16 text-center z-10">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-premium-sm ring-1 ring-border-soft text-primary-dark mb-8">
                    <Mail className="h-10 w-10 text-primary-dark" strokeWidth={2} />
                </div>
                <h1 className="animate-fade-in-up text-5xl font-black tracking-tighter text-primary-dark sm:text-6xl md:text-[4.5rem] leading-[1.1] mb-6">
                    Ponte en <span className="text-mirror font-extrabold pb-2">Contacto</span>
                </h1>
                <p className="animate-fade-in-up delay-100 mx-auto max-w-2xl text-[1.125rem] text-secondary-text md:text-[1.25rem] font-medium leading-relaxed mb-12">
                    Estamos aquí para ayudarte. Si tienes preguntas, sugerencias o necesitas soporte técnico, no dudes en escribirnos.
                </p>

                <div className="animate-fade-in-up delay-200 neo-panel max-w-2xl mx-auto rounded-3xl p-8 sm:p-12 text-left shadow-premium-md relative">
                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-[14px] font-bold text-primary-dark">Nombre</label>
                                <input 
                                    type="text" 
                                    placeholder="Tu nombre" 
                                    className="neo-input w-full rounded-xl px-4 py-3 outline-none transition-shadow" 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[14px] font-bold text-primary-dark">Email</label>
                                <input 
                                    type="email" 
                                    placeholder="tu@email.com" 
                                    className="neo-input w-full rounded-xl px-4 py-3 outline-none transition-shadow" 
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[14px] font-bold text-primary-dark">Asunto</label>
                            <input 
                                type="text" 
                                placeholder="¿Cómo podemos ayudarte?" 
                                className="neo-input w-full rounded-xl px-4 py-3 outline-none transition-shadow" 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[14px] font-bold text-primary-dark">Mensaje</label>
                            <textarea 
                                rows={5}
                                placeholder="Escribe tu mensaje aquí..." 
                                className="neo-input w-full rounded-xl px-4 py-3 outline-none transition-shadow resize-none" 
                            />
                        </div>
                        <div className="pt-4">
                            <button type="button" className="neo-btn-primary w-full h-14 rounded-xl flex items-center justify-center gap-2 text-[1.05rem] font-bold shadow-premium-sm transition-transform hover:scale-[1.02] active:scale-[0.98]">
                                <Send className="h-5 w-5" />
                                Enviar Mensaje
                            </button>
                        </div>
                    </form>
                </div>

                <div className="mt-16 grid gap-8 sm:grid-cols-2 max-w-2xl mx-auto">
                    <div className="flex flex-col items-center text-center p-6 bg-white/50 rounded-2xl border border-border-soft backdrop-blur-sm">
                        <Mail className="h-8 w-8 text-accent-blue mb-4" />
                        <h3 className="font-bold text-primary-dark mb-1">Email de Soporte</h3>
                        <p className="text-secondary-text text-sm font-medium">soporte@mirror.com</p>
                    </div>
                    <div className="flex flex-col items-center text-center p-6 bg-white/50 rounded-2xl border border-border-soft backdrop-blur-sm">
                        <MessageSquare className="h-8 w-8 text-accent-blue mb-4" />
                        <h3 className="font-bold text-primary-dark mb-1">Redes Sociales</h3>
                        <p className="text-secondary-text text-sm font-medium">@mirror_extension</p>
                    </div>
                </div>
            </section>
        </main>
    )
}
