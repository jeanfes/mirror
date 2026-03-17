"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff } from "lucide-react"
import { ROUTES } from "@/lib/routes"
import { Button } from "@/components/ui/Button"
import { useLanguageStore } from "@/store/useLanguageStore"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"
import { createLoginSchema, type LoginValues } from "../schemas"
import { useLogin } from "../hooks/useLogin"
import { IconGoogle } from "@/components/icons/IconGoogle"

export function LoginForm() {
    const { t } = useLanguageStore()
    const schema = useMemo(() => createLoginSchema(t.auth.errors), [t.auth.errors])
    const { login, loginWithGoogle, isPending, isPendingGoogle, isNavigating } = useLogin()
    const isAnyLocked = isPending || isPendingGoogle || isNavigating
    const [showPassword, setShowPassword] = useState(false)

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<LoginValues>({ resolver: zodResolver(schema) })

    const onSubmit = handleSubmit(async (data) => {
        const err = await login(data)
        if (err === "invalid_credentials") {
            setError("root", { message: t.auth.errors.invalidCredentials })
        } else if (err === "email_not_confirmed") {
            setError("root", { message: t.auth.errors.emailNotConfirmed })
        } else if (err === "rate_limit") {
            setError("root", { message: t.auth.errors.authRateLimit })
        } else if (err === "auth_unavailable") {
            setError("root", { message: t.auth.errors.authUnavailable })
        } else if (err === "connection_error") {
            setError("root", { message: t.auth.errors.connectionError })
        }
    })

    const inputClass = (hasError: boolean, className?: string) =>
        cn(
            "h-11 w-full rounded-xl border bg-surface-elevated px-4 text-[14px] text-primary-text outline-none transition-all placeholder:text-muted-text focus:ring-4 disabled:opacity-60 disabled:cursor-not-allowed",
            hasError
                ? "border-danger focus:border-danger focus:ring-danger/10"
                : "border-border-soft focus:border-accent-purple focus:ring-accent-purple/10",
            className
        )

    return (
        <>
            <form className="space-y-4" onSubmit={onSubmit} noValidate aria-busy={isAnyLocked}>
                <Button
                    variant="primary"
                    className="neo-btn-muted flex w-full h-11 items-center justify-center gap-2.5 text-[14px] font-semibold transition-all focus:ring-4 focus:ring-accent-purple/10 disabled:cursor-not-allowed disabled:opacity-60"
                    type="button"
                    disabled={isAnyLocked}
                    loading={isPendingGoogle}
                    onClick={loginWithGoogle}
                >
                    <IconGoogle />
                    {t.auth.googleBtn}
                </Button>

                <div className="relative flex items-center py-2">
                    <div className="grow border-t border-border-soft" />
                    <span className="shrink-0 px-4 text-[12px] font-medium text-muted-text">{t.auth.orEmail}</span>
                    <div className="grow border-t border-border-soft" />
                </div>

                <div>
                    <label className="mb-1.5 block text-[13px] font-semibold text-primary-text">{t.auth.emailLabel}</label>
                    <motion.input
                        whileFocus={{ scale: 1.01 }}
                        {...register("email")}
                        type="email"
                        autoComplete="email"
                        disabled={isAnyLocked}
                        className={inputClass(!!errors.email)}
                        placeholder={t.auth.emailPlaceholder}
                    />
                    {errors.email && (
                        <p className="mt-1.5 text-[12px] font-medium text-danger">{errors.email.message}</p>
                    )}
                </div>

                <div>
                    <label className="mb-1.5 block text-[13px] font-semibold text-primary-text">{t.auth.passwordLabel}</label>
                    <div className="relative">
                        <motion.input
                            whileFocus={{ scale: 1.01 }}
                            {...register("password")}
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            disabled={isAnyLocked}
                            className={inputClass(!!errors.password || !!errors.root, "pr-12")}
                            placeholder={t.auth.passwordPlaceholder}
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-3 inline-flex items-center justify-center text-muted-text transition-colors hover:text-primary-text focus:outline-none focus-visible:text-primary-text disabled:cursor-not-allowed disabled:opacity-50"
                            aria-label={showPassword ? t.auth.hidePassword : t.auth.showPassword}
                            onClick={() => setShowPassword((current) => !current)}
                            disabled={isAnyLocked}
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="mt-1.5 text-[12px] font-medium text-danger">{errors.password.message}</p>
                    )}
                    {errors.root && (
                        <p className="mt-1.5 text-[12px] font-medium text-danger">{errors.root.message}</p>
                    )}
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                        className="neo-btn-primary w-full h-11 text-[15px] font-semibold shadow-premium-sm mt-2"
                        type="submit"
                        disabled={isAnyLocked}
                        loading={isPending || isNavigating}
                        loadingLabel={t.app.signingIn}
                    >
                        {t.auth.loginBtn}
                    </Button>
                </motion.div>

                <p className="text-center text-[14px] text-secondary-text pt-4">
                    {t.auth.noAccount}{" "}
                    <Link className="font-semibold text-primary-dark hover:text-accent-blue transition-colors" href={ROUTES.auth.register}>
                        {t.auth.registerLink}
                    </Link>
                </p>
            </form>
        </>
    )
}
