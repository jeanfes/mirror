"use client";

import { Mail, Send, MessageSquare } from "lucide-react";
import { motion } from "motion/react";
import { useLanguageStore } from "@/store/useLanguageStore";

export default function ContactPage() {
    const { t } = useLanguageStore();

    const fadeInUp = {
        initial: { opacity: 0, y: 8 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-50px" },
        transition: { duration: 0.25, ease: "easeOut" as const }
    };

    return (
        <main className="relative flex w-full flex-col items-center overflow-x-hidden pt-10 pb-20">
            <section className="w-full max-w-4xl px-6 pt-20 pb-16 text-center z-10">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-premium-sm ring-1 ring-border-soft text-primary-dark mb-8">
                    <Mail className="h-10 w-10 text-primary-dark" strokeWidth={2} />
                </div>
                <motion.h1 {...fadeInUp} className="text-5xl font-black tracking-tighter text-primary-dark sm:text-6xl md:text-[4.5rem] leading-[1.1] mb-6">
                    {t.contactPage.title1} <span className="text-mirror font-extrabold pb-2">{t.contactPage.titleSpan}</span>
                </motion.h1>
                <motion.p {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.05 }} className="mx-auto max-w-2xl text-[1.125rem] text-secondary-text md:text-[1.25rem] font-medium leading-relaxed mb-12">
                    {t.contactPage.subtitle}
                </motion.p>

                <motion.div {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.1 }} className="neo-panel max-w-2xl mx-auto rounded-3xl p-8 sm:p-12 text-left shadow-premium-md relative">
                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-[14px] font-bold text-primary-dark">{t.contactPage.nameLabel}</label>
                                <motion.input
                                    whileFocus={{ scale: 1.01 }}
                                    type="text"
                                    placeholder={t.contactPage.namePlaceholder}
                                    className="neo-input w-full rounded-xl px-4 py-3 outline-none transition-shadow"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[14px] font-bold text-primary-dark">{t.contactPage.emailLabel}</label>
                                <motion.input
                                    whileFocus={{ scale: 1.01 }}
                                    type="email"
                                    placeholder={t.contactPage.emailPlaceholder}
                                    className="neo-input w-full rounded-xl px-4 py-3 outline-none transition-shadow"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[14px] font-bold text-primary-dark">{t.contactPage.subjectLabel}</label>
                            <motion.input
                                whileFocus={{ scale: 1.01 }}
                                type="text"
                                placeholder={t.contactPage.subjectPlaceholder}
                                className="neo-input w-full rounded-xl px-4 py-3 outline-none transition-shadow"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[14px] font-bold text-primary-dark">{t.contactPage.messageLabel}</label>
                            <motion.textarea
                                whileFocus={{ scale: 1.01 }}
                                rows={5}
                                placeholder={t.contactPage.messagePlaceholder}
                                className="neo-input w-full rounded-xl px-4 py-3 outline-none transition-shadow resize-none"
                            />
                        </div>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="pt-4">
                            <button type="button" className="neo-btn-primary w-full h-14 rounded-xl flex items-center justify-center gap-2 text-[1.05rem] font-bold shadow-premium-sm transition-transform">
                                <Send className="h-5 w-5" />
                                {t.contactPage.sendBtn}
                            </button>
                        </motion.div>
                    </form>
                </motion.div>

                <div className="mt-16 grid gap-8 sm:grid-cols-2 max-w-2xl mx-auto">
                    <motion.div whileHover={{ y: -5 }} className="neo-card flex flex-col items-center rounded-2xl border border-border-soft bg-white/75 p-6 text-center backdrop-blur-sm shadow-premium-sm transition-shadow hover:shadow-premium-md">
                        <Mail className="h-8 w-8 text-accent-blue mb-4" />
                        <h3 className="font-bold text-primary-dark mb-1">{t.contactPage.supportTitle}</h3>
                        <p className="text-secondary-text text-sm font-medium">soporte@mirror.com</p>
                    </motion.div>
                    <motion.div whileHover={{ y: -5 }} className="neo-card flex flex-col items-center rounded-2xl border border-border-soft bg-white/75 p-6 text-center backdrop-blur-sm shadow-premium-sm transition-shadow hover:shadow-premium-md">
                        <MessageSquare className="h-8 w-8 text-accent-blue mb-4" />
                        <h3 className="font-bold text-primary-dark mb-1">{t.contactPage.socialTitle}</h3>
                        <p className="text-secondary-text text-sm font-medium">@mirror_extension</p>
                    </motion.div>
                </div>
            </section>
        </main>
    )
}
