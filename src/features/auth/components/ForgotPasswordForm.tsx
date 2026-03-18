"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckCircle2, ChevronLeft } from "lucide-react"
import { ROUTES } from "@/lib/routes"
import { Button } from "@/components/ui/Button"
import { useLanguageStore } from "@/store/useLanguageStore"
import { createForgotPasswordSchema, type ForgotPasswordValues } from "../schemas"
import { useRecovery } from "../hooks/useRecovery"
import { Input } from "@/components/ui/Input"

export function ForgotPasswordForm() {
    const { t } = useLanguageStore()
    const schema = useMemo(() => createForgotPasswordSchema(t.auth.errors), [t.auth.errors])
    const { sendRecoveryEmail, isPending } = useRecovery()
    const [isSubmitted, setIsSubmitted] = useState(false)

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<ForgotPasswordValues>({ resolver: zodResolver(schema) })

    const onSubmit = handleSubmit(async (data) => {
        const err = await sendRecoveryEmail(data)
        if (err) {
            if (err === "email_rate_limit") {
                setError("root", { message: t.auth.errors.emailRateLimit })
            } else if (err === "auth_unavailable") {
                setError("root", { message: t.auth.errors.authUnavailable })
            } else if (err === "connection_error") {
                setError("root", { message: t.auth.errors.connectionError })
            } else {
                setError("root", { message: t.auth.errors.registerError })
            }
        } else {
            setIsSubmitted(true)
        }
    })

    if (isSubmitted) {
        return (
            <div className="space-y-6 text-center animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex justify-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-blue/10 text-accent-blue">
                        <CheckCircle2 size={32} />
                    </div>
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-primary-dark">{t.auth.checkEmailTitle}</h3>
                    <p className="text-[15px] text-secondary-text leading-relaxed">
                        {t.auth.checkEmailSubtitle}
                    </p>
                </div>
                <div className="pt-4">
                    <Link href={ROUTES.auth.login}>
                        <Button variant="secondary" className="w-full h-11">
                            <ChevronLeft size={16} className="mr-2" />
                            {t.auth.backToLogin}
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <form className="space-y-4" onSubmit={onSubmit} noValidate aria-busy={isPending}>
            <Input
                {...register("email")}
                label={t.auth.emailLabel}
                type="email"
                autoComplete="email"
                disabled={isPending}
                error={errors.email?.message || errors.root?.message}
                placeholder={t.auth.emailPlaceholder}
            />

            <Button
                variant="primary"
                className="w-full h-11 text-[15px] mt-2 shadow-premium-sm"
                type="submit"
                disabled={isPending}
                loading={isPending}
            >
                {t.auth.forgotPasswordBtn}
            </Button>

            <div className="pt-4 text-center">
                <Link
                    href={ROUTES.auth.login}
                    className="inline-flex items-center text-[14px] font-medium text-secondary-text hover:text-primary-dark transition-colors"
                >
                    <ChevronLeft size={16} className="mr-1" />
                    {t.auth.backToLogin}
                </Link>
            </div>
        </form>
    )
}
