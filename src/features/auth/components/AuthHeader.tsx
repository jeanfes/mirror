"use client"

import { useLanguageStore } from "@/store/useLanguageStore";

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
        <div>
            <h2 className="text-2xl font-bold tracking-tight text-primary-dark sm:text-3xl">{title}</h2>
            <p className="mb-8 mt-2 text-[15px] text-secondary-text leading-relaxed">{subtitle}</p>
        </div>
    );
}
