"use client";

import { useLanguageStore } from "@/store/useLanguageStore";
import { motion } from "motion/react";

export function AuthHeader({ type }: { type: "login" | "register" | "forgot" | "reset" }) {
    const { t } = useLanguageStore();

    const title = {
        login: t.auth.loginTitle,
        register: t.auth.registerTitle,
        forgot: t.auth.forgotPasswordTitle,
        reset: t.auth.resetPasswordTitle
    }[type];

    const subtitle = {
        login: t.auth.loginSubtitle,
        register: t.auth.registerSubtitle,
        forgot: t.auth.forgotPasswordSubtitle,
        reset: t.auth.resetPasswordSubtitle
    }[type];

    return (
        <motion.div 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.1, ease: "easeOut" }}
        >
            <h2 className="text-2xl font-bold tracking-tight text-primary-dark sm:text-3xl">{title}</h2>
            <p className="mb-8 mt-2 text-[15px] text-secondary-text leading-relaxed">{subtitle}</p>
        </motion.div>
    );
}
