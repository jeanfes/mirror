"use client";

import { MessageCircleQuestion, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const faqs = [
    {
        q: "¿Es Mirror seguro para mi cuenta de LinkedIn?",
        a: "Absolutamente. Mirror no requiere las credenciales de tu cuenta de LinkedIn ni usa automatización 'robot' riesgosa (como enviar 100 mensajes por segundo). Tú apruebas y ejecutas cada comentario manualmente, lo que lo hace 100% seguro."
    },
    {
        q: "¿Dónde se guardan mis datos y borradores?",
        a: "Toda tu información se guarda cifrada y de manera segura en el almacenamiento local de tu navegador web (`localStorage`). Ningún dato de tus comentarios se envía o almacena en nuestros servidores, garantizando privacidad total."
    },
    {
        q: "¿Puedo probar la extensión antes de pagar?",
        a: "¡Sí! Tenemos un plan de nivel gratuito que te permite generar un número básico de autocompletados (prompts) y utilizar 1 Persona (perfil base) todos los meses de forma gratuita, sin necesidad de tarjeta de crédito."
    },
    {
        q: "¿La IA suena como un robot?",
        a: "A diferencia de otras herramientas, Mirror te permite configurar tu propio 'Prompt Engineering' detrás de escena. Puedes definir 'Personas' con adjetivos específicos (ej., 'Profesional pero casual', 'Sarcástico', 'Empático') para que la IA escriba exactamente como tú."
    },
    {
        q: "¿Con qué navegadores es compatible?",
        a: "Actualmente la extensión de Mirror está optimizada para Google Chrome y navegadores basados en Chromium (como Microsoft Edge, Brave y Arc)."
    }
];

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <main className="relative flex w-full flex-col items-center overflow-x-hidden pt-10 pb-20">
            <section className="w-full max-w-4xl px-6 pt-20 pb-16 text-center z-10">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-premium-sm ring-1 ring-border-soft text-primary-dark mb-8">
                    <MessageCircleQuestion className="h-10 w-10 text-primary-dark" strokeWidth={2} />
                </div>
                <h1 className="animate-fade-in-up text-5xl font-black tracking-tighter text-primary-dark sm:text-6xl md:text-[4.5rem] leading-[1.1] mb-6">
                    Resolvemos tus <span className="text-mirror font-extrabold pb-2">Dudas</span>
                </h1>
                <p className="animate-fade-in-up delay-100 mx-auto max-w-2xl text-[1.125rem] text-secondary-text md:text-[1.25rem] font-medium leading-relaxed mb-12">
                    Todo lo que necesitas saber sobre el funcionamiento, privacidad y beneficios de la plataforma Mirror.
                </p>

                <div className="space-y-4 text-left max-w-3xl mx-auto">
                    {faqs.map((faq, i) => {
                        const isOpen = openIndex === i;
                        return (
                            <div 
                                key={i} 
                                className={`neo-card transition-all duration-300 ${isOpen ? 'shadow-premium-md scale-[1.02]' : 'hover:shadow-premium-sm'}`}
                            >
                                <button
                                    onClick={() => setOpenIndex(isOpen ? null : i)}
                                    className="flex w-full items-center justify-between p-6 md:p-8 text-left"
                                >
                                    <h3 className="text-lg md:text-xl font-black text-primary-dark pr-8">{faq.q}</h3>
                                    <div className={`shrink-0 h-10 w-10 flex items-center justify-center rounded-full transition-colors duration-300 ${isOpen ? 'bg-primary-dark text-white' : 'bg-bg-main text-primary-dark'}`}>
                                        <Plus className={`h-6 w-6 transition-transform duration-300 ${isOpen ? 'rotate-45' : 'rotate-0'}`} />
                                    </div>
                                </button>
                                <div 
                                    className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                                >
                                    <div className="overflow-hidden">
                                        <p className="px-6 pb-8 md:px-8 text-secondary-text text-[1.05rem] font-medium leading-relaxed">
                                            {faq.a}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="mt-20 flex flex-col items-center animate-fade-in-up delay-400">
                    <p className="text-primary-dark font-bold text-lg mb-4">¿Te quedan más preguntas?</p>
                    <Link href="#contact" className="neo-btn-primary px-8 h-12 inline-flex items-center text-[1.05rem] font-bold shadow-premium-sm">
                        Contactar Soporte
                    </Link>
                </div>
            </section>
        </main>
    )
}
