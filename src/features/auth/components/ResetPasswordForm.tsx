"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, CheckCircle2, ArrowRight } from "lucide-react"
import { ROUTES } from "@/lib/routes"
import { Button } from "@/components/ui/Button"
import { useLanguageStore } from "@/store/useLanguageStore"
import { createResetPasswordSchema, type ResetPasswordValues } from "../schemas"
import { useRecovery } from "../hooks/useRecovery"
import { usePasswordVisibility } from "../hooks/usePasswordVisibility"
import { Input } from "@/components/ui/Input"

export function ResetPasswordForm() {
    const { t } = useLanguageStore()
    const schema = useMemo(() => createResetPasswordSchema(t.auth.errors), [t.auth.errors])
    const { resetPassword, isPending } = useRecovery()
    const [isSubmitted, setIsSubmitted] = useState(false)
    const { showPassword, togglePasswordVisibility } = usePasswordVisibility()

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<ResetPasswordValues>({ resolver: zodResolver(schema) })

    const onSubmit = handleSubmit(async (data) => {
        const err = await resetPassword(data)
        if (err) {
            if (err === "weak_password") {
                setError("password", { message: t.auth.errors.passwordWeak })
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
                    <h3 className="text-xl font-semibold text-primary-dark">{t.auth.passwordChangedTitle}</h3>
                    <p className="text-[15px] text-secondary-text leading-relaxed">
                        {t.auth.passwordChangedSubtitle}
                    </p>
                </div>
                <div className="pt-4">
                    <Link href={ROUTES.auth.login}>
                        <Button variant="primary" className="w-full h-11 shadow-premium-sm">
                            {t.auth.loginBtn}
                            <ArrowRight size={16} className="ml-2" />
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <form className="space-y-4" onSubmit={onSubmit} noValidate aria-busy={isPending}>
            <Input
                {...register("password")}
                label={t.auth.newPasswordLabel}
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                disabled={isPending}
                error={errors.password?.message}
                placeholder={t.auth.passwordPlaceholder}
                suffix={
                    <button
                        type="button"
                        className="flex items-center justify-center p-1 text-secondary-text hover:text-primary-text transition-colors"
                        onClick={togglePasswordVisibility}
                        disabled={isPending}
                    >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                }
            />

            <Input
                {...register("confirmPassword")}
                label={t.auth.confirmPasswordLabel}
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                disabled={isPending}
                error={errors.confirmPassword?.message || errors.root?.message}
                placeholder={t.auth.passwordPlaceholder}
            />

            <Button
                variant="primary"
                className="w-full h-11 text-[15px] mt-2 shadow-premium-sm"
                type="submit"
                disabled={isPending}
                loading={isPending}
            >
                {t.auth.resetPasswordBtn}
            </Button>
        </form>
    )
}
