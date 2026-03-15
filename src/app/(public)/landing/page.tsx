"use client";

import { ArrowRight, WandSparkles, Fingerprint, Layers, Rocket, Bot, Download, SlidersHorizontal, Keyboard, MessageSquareText } from "lucide-react";
import { useLanguageStore } from "@/store/useLanguageStore";
import Link from "next/link";
import { motion } from "motion/react";
import { ROUTES } from "@/lib/routes";

export default function LandingPage() {
    const { t } = useLanguageStore();

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-100px" },
        transition: { duration: 0.5, ease: "easeOut" as const }
    };

    const staggerContainer = {
        initial: {},
        whileInView: {
            transition: {
                staggerChildren: 0.1
            }
        },
        viewport: { once: true }
    };

    const float = {
        animate: { y: [0, -12, 0] },
        transition: { duration: 5, repeat: Infinity, ease: "easeInOut" as const }
    };

    return (
        <main className="relative flex min-h-screen flex-col items-center overflow-x-hidden pt-10">
            {/* Hero Section */}
            <section className="relative w-full max-w-6xl px-6 pt-24 pb-20 text-center md:pt-40 md:pb-32 z-10">
                <motion.div {...float} className="absolute top-24 left-10 hidden lg:block md:block">
                    <div className="neo-shell flex h-18 w-18 items-center justify-center rounded-2xl shadow-premium-md">
                        <MessageSquareText className="h-9 w-9 text-primary-dark/70" />
                    </div>
                </motion.div>
                <motion.div {...float} transition={{ ...float.transition, delay: 0.5 }} className="absolute top-44 right-10 hidden lg:block md:block -translate-y-4">
                    <div className="neo-shell flex h-16 w-16 items-center justify-center rounded-2xl shadow-premium-md">
                        <WandSparkles className="h-8 w-8 text-primary-dark/70" />
                    </div>
                </motion.div>

                <div className="mx-auto max-w-3xl space-y-7">
                    <motion.h1
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="text-5xl font-black tracking-tighter text-primary-dark sm:text-6xl md:text-[5rem] leading-[1.1]"
                    >
                        {t.hero.title1} <br className="hidden md:block" /> {t.hero.title2} <span className="text-mirror font-extrabold pb-2">{t.hero.titleSpan}</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: 0.03, ease: "easeOut" }}
                        className="mx-auto max-w-2xl text-[1.125rem] text-secondary-text md:text-[1.25rem] leading-relaxed font-medium"
                    >
                        {t.hero.subtitle}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: 0.06, ease: "easeOut" }}
                        className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link
                                href={ROUTES.auth.register}
                                className="neo-btn-primary group flex h-14 items-center gap-2 px-9 text-[1.05rem] font-bold shadow-premium-md"
                            >
                                {t.hero.ctaPrimary}
                                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link
                                href={ROUTES.auth.login}
                                className="neo-btn-muted flex h-14 items-center px-9 text-[1.05rem] font-bold shadow-premium-sm"
                            >
                                {t.hero.ctaSecondary}
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* How It Works Section [NEW] */}
            <section className="w-full py-20 bg-white/50 border-y border-border-soft relative z-10 backdrop-blur-sm">
                <div className="mx-auto max-w-6xl px-6">
                    <motion.div {...fadeInUp} className="text-center mb-16">
                        <h2 className="text-3xl font-black tracking-tight text-primary-dark sm:text-4xl">{t.howItWorks.title}</h2>
                        <p className="mt-4 text-secondary-text font-medium text-lg">{t.howItWorks.subtitle}</p>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="whileInView"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-3 gap-8 relative"
                    >
                        {/* Connecting Line */}
                        <div className="hidden md:block absolute top-13 left-[15%] right-[15%] h-0.5 bg-linear-to-r from-transparent via-border-soft to-transparent -z-10" />

                        {/* Step 1 */}
                        <motion.div variants={fadeInUp} className="flex flex-col items-center text-center">
                            <div className="w-24 h-24 mb-6 rounded-4xl bg-bg-main shadow-inner flex items-center justify-center ring-1 ring-border-soft">
                                <Download className="h-10 w-10 text-primary-dark" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl font-bold text-primary-dark mb-2">{t.howItWorks.s1Title}</h3>
                            <p className="text-secondary-text font-medium text-[0.95rem] max-w-xs leading-relaxed">
                                {t.howItWorks.s1Desc}
                            </p>
                        </motion.div>

                        {/* Step 2 */}
                        <motion.div variants={fadeInUp} className="flex flex-col items-center text-center">
                            <div className="w-24 h-24 mb-6 rounded-4xl bg-bg-main shadow-inner flex items-center justify-center ring-1 ring-border-soft">
                                <SlidersHorizontal className="h-10 w-10 text-primary-dark" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl font-bold text-primary-dark mb-2">{t.howItWorks.s2Title}</h3>
                            <p className="text-secondary-text font-medium text-[0.95rem] max-w-xs leading-relaxed">
                                {t.howItWorks.s2Desc}
                            </p>
                        </motion.div>

                        {/* Step 3 */}
                        <motion.div variants={fadeInUp} className="flex flex-col items-center text-center">
                            <div className="w-24 h-24 mb-6 rounded-4xl bg-bg-main shadow-inner flex items-center justify-center ring-1 ring-border-soft">
                                <Keyboard className="h-10 w-10 text-primary-dark" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl font-bold text-primary-dark mb-2">{t.howItWorks.s3Title}</h3>
                            <p className="text-secondary-text font-medium text-[0.95rem] max-w-xs leading-relaxed">
                                {t.howItWorks.s3Desc}
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="w-full py-24 pb-32 relative z-10">
                <div className="mx-auto max-w-6xl px-6">
                    <motion.div {...fadeInUp} className="mb-16 text-center space-y-4">
                        <h2 className="text-3xl font-black tracking-tight text-primary-dark sm:text-5xl">{t.features.title}</h2>
                        <p className="mx-auto max-w-2xl text-secondary-text text-[1.1rem] font-medium">{t.features.subtitle}</p>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="whileInView"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 gap-8 md:grid-cols-3"
                    >
                        {/* Feature 1 */}
                        <motion.div variants={fadeInUp} className="neo-card relative overflow-visible rounded-[18px] border border-border-light bg-white/75 backdrop-blur-sm p-10 shadow-premium-sm group transition-all duration-300 hover:-translate-y-2 hover:shadow-premium-md">
                            <div className="absolute -inset-0.5 bg-linear-to-br from-border-soft to-transparent rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                            <div className="mb-8 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-primary-dark shadow-sm ring-1 ring-border-soft transition-transform duration-300 group-hover:scale-110">
                                <Bot className="h-7 w-7" strokeWidth={2} />
                            </div>
                            <h3 className="mb-3 text-[1.35rem] font-black tracking-tight text-primary-dark">{t.features.f1Title}</h3>
                            <p className="text-secondary-text text-[1rem] leading-relaxed font-medium">
                                {t.features.f1Desc}
                            </p>
                        </motion.div>

                        {/* Feature 2 */}
                        <motion.div variants={fadeInUp} className="neo-card relative overflow-visible rounded-[18px] border border-border-light bg-white/75 backdrop-blur-sm p-10 shadow-premium-sm group transition-all duration-300 hover:-translate-y-2 hover:shadow-premium-md">
                            <div className="absolute -inset-0.5 bg-linear-to-br from-border-soft to-transparent rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                            <div className="mb-8 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-primary-dark shadow-sm ring-1 ring-border-soft transition-transform duration-300 group-hover:scale-110">
                                <Layers className="h-7 w-7" strokeWidth={2} />
                            </div>
                            <h3 className="mb-3 text-[1.35rem] font-black tracking-tight text-primary-dark">{t.features.f2Title}</h3>
                            <p className="text-secondary-text text-[1rem] leading-relaxed font-medium">
                                {t.features.f2Desc}
                            </p>
                        </motion.div>

                        {/* Feature 3 */}
                        <motion.div variants={fadeInUp} className="neo-card relative overflow-visible rounded-[18px] border border-border-light bg-white/75 backdrop-blur-sm p-10 shadow-premium-sm group transition-all duration-300 hover:-translate-y-2 hover:shadow-premium-md">
                            <div className="absolute -inset-0.5 bg-linear-to-br from-border-soft to-transparent rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                            <div className="mb-8 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-primary-dark shadow-sm ring-1 ring-border-soft transition-transform duration-300 group-hover:scale-110">
                                <Fingerprint className="h-7 w-7" strokeWidth={2} />
                            </div>
                            <h3 className="mb-3 text-[1.35rem] font-black tracking-tight text-primary-dark">{t.features.f3Title}</h3>
                            <p className="text-secondary-text text-[1rem] leading-relaxed font-medium">
                                {t.features.f3Desc}
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="w-full max-w-5xl px-6 pb-40 relative z-10">
                <motion.div {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.1 }} className="neo-shell relative overflow-hidden rounded-[2.5rem] p-12 text-center shadow-premium-md sm:p-20 border-white/40 group hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-500">
                    <div className="absolute inset-0 bg-linear-to-br from-white/90 via-white/50 to-white/20 transition-opacity group-hover:opacity-80" />
                    <div className="relative z-10 space-y-8">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.25rem] bg-white text-primary-dark shadow-sm ring-1 ring-border-soft transition-transform hover:scale-110 duration-300">
                            <Rocket className="h-10 w-10 text-primary-dark" strokeWidth={2} />
                        </div>
                        <h2 className="text-4xl font-black tracking-tight text-primary-dark sm:text-5xl text-balance">
                            {t.cta.title}
                        </h2>
                        <p className="mx-auto max-w-2xl text-secondary-text text-[1.1rem] text-balance font-medium">
                            {t.cta.subtitle}
                        </p>
                        <div className="pt-4 flex justify-center">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link href={ROUTES.auth.register} className="neo-btn-primary inline-flex h-14 items-center px-10 text-[1.05rem] font-bold shadow-premium-md transition-transform hover:scale-105 active:scale-95">
                                    {t.cta.button}
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </section>
        </main>
    );
}
