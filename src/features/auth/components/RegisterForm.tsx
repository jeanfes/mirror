"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff } from "lucide-react"
import { ROUTES } from "@/lib/routes"
import { Button } from "@/components/ui/Button"
import { LoadingOverlay } from "@/components/ui/Loading"
import { useLanguageStore } from "@/store/useLanguageStore"
import { createRegisterSchema, getPasswordStrength, type RegisterValues } from "../schemas"
import { useRegister } from "../hooks/useRegister"
import { useLogin } from "../hooks/useLogin"
import { Input } from "@/components/ui/Input"
import { IconGoogle } from "@/components/icons/IconGoogle"
import { cn } from "@/lib/utils"

const STRENGTH_STYLES: Record<1 | 2 | 3, { badge: string; fill: string; text: string }> = {
    1: {
        badge: "border-danger/20 bg-danger/10 text-danger",
        fill: "bg-danger shadow-sm shadow-danger/20",
        text: "text-danger",
    },
    2: {
        badge: "border-warning/20 bg-warning/10 text-warning",
        fill: "bg-warning shadow-sm shadow-warning/20",
        text: "text-warning",
    },
    3: {
        badge: "border-success/20 bg-success/10 text-success",
        fill: "bg-success shadow-sm shadow-success/20",
        text: "text-success",
    },
}

export function RegisterForm() {
    const { t } = useLanguageStore()
    const schema = useMemo(() => createRegisterSchema(t.auth.errors), [t.auth.errors])
    const { register: registerUser, isPending, isNavigating } = useRegister()
    const { loginWithGoogle, isPendingGoogle } = useLogin()
    const isAnyLocked = isPending || isPendingGoogle || isNavigating
    const [showPassword, setShowPassword] = useState(false)

    const {
        register,
        handleSubmit,
        control,
        setError,
        formState: { errors },
    } = useForm<RegisterValues>({ resolver: zodResolver(schema) })

    const passwordValue = useWatch({ control, name: "password" }) ?? ""
    const strength = getPasswordStrength(passwordValue)

    const strengthLabel =
        strength === 1
            ? t.auth.errors.strengthWeak
            : strength === 2
                ? t.auth.errors.strengthMedium
                : strength === 3
                    ? t.auth.errors.strengthStrong
                    : null

    const onSubmit = handleSubmit(async (data) => {
        const err = await registerUser(data)
        if (err === "email_taken") {
            setError("email", { message: t.auth.errors.emailTaken })
        } else if (err === "email_rate_limit") {
            setError("root", { message: t.auth.errors.emailRateLimit })
        } else if (err === "rate_limit") {
            setError("root", { message: t.auth.errors.authRateLimit })
        } else if (err === "weak_password") {
            setError("password", { message: t.auth.errors.passwordWeak })
        } else if (err === "signup_disabled") {
            setError("root", { message: t.auth.errors.signupDisabled })
        } else if (err === "auth_unavailable") {
            setError("root", { message: t.auth.errors.authUnavailable })
        } else if (err === "register_error") {
            setError("root", { message: t.auth.errors.registerError })
        } else if (err === "connection_error") {
            setError("root", { message: t.auth.errors.connectionError })
        }
    })



    return (
        <>
            <LoadingOverlay show={isNavigating} label={t.app.creatingAccount} />
            <form className="space-y-4" onSubmit={onSubmit} noValidate aria-busy={isAnyLocked}>
                <Button
                    variant="secondary"
                    className="w-full h-11 border-border-soft"
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

                <Input
                    {...register("name")}
                    label={t.auth.nameLabel}
                    type="text"
                    autoComplete="name"
                    disabled={isAnyLocked}
                    error={errors.name?.message}
                    placeholder={t.auth.namePlaceholder}
                />

                <Input
                    {...register("email")}
                    label={t.auth.emailLabel}
                    type="email"
                    autoComplete="email"
                    disabled={isAnyLocked}
                    error={errors.email?.message}
                    placeholder={t.auth.emailPlaceholder}
                />

                <Input
                    {...register("password")}
                    label={t.auth.passwordLabel}
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    disabled={isAnyLocked}
                    error={errors.password?.message || errors.root?.message}
                    placeholder={t.auth.passwordPlaceholder}
                    suffix={
                        <button
                            type="button"
                            className="flex items-center justify-center p-1 text-secondary-text hover:text-primary-text transition-colors"
                            onClick={() => setShowPassword((prev) => !prev)}
                            disabled={isAnyLocked}
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    }
                />
                    {passwordValue.length > 0 && (
                        <div className="mt-3 rounded-2xl border border-border-light bg-surface-card p-4 backdrop-blur-xl shadow-premium-sm transition-all duration-300">
                            <div className="flex items-center justify-between gap-3 mb-3">
                                <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-secondary-text">
                                    {t.auth.passwordStrength}
                                </p>
                                {strengthLabel && (
                                    <span
                                        className={cn(
                                            "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] shadow-sm transition-colors duration-300",
                                            STRENGTH_STYLES[strength as 1 | 2 | 3].badge
                                        )}
                                    >
                                        {strengthLabel}
                                    </span>
                                )}
                            </div>
                            <div className="flex h-1.5 w-full gap-1.5 rounded-full overflow-hidden">
                                {[1, 2, 3].map((level) => (
                                    <div
                                        key={level}
                                        className={cn(
                                            "h-full flex-1 rounded-full transition-all duration-500",
                                            level <= strength
                                                ? STRENGTH_STYLES[strength as 1 | 2 | 3].fill
                                                : "bg-border-soft"
                                        )}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                    {errors.password && (
                        <p className="mt-1.5 text-[12px] font-medium text-danger">{errors.password.message}</p>
                    )}
                    {errors.root && (
                        <p className="mt-1.5 text-[12px] font-medium text-danger">{errors.root.message}</p>
                    )}

                <Button
                    variant="primary"
                    className="w-full h-11 text-[15px] mt-2 shadow-premium-sm"
                    type="submit"
                    disabled={isAnyLocked}
                    loading={isPending}
                    loadingLabel={t.app.creatingAccount}
                >
                    {t.auth.registerBtn}
                </Button>

                <p className="text-center text-[14px] text-secondary-text pt-4">
                    {t.auth.hasAccount}{" "}
                    <Link className="font-semibold text-primary-dark hover:text-accent-blue transition-colors" href={ROUTES.auth.login}>
                        {t.auth.loginLink}
                    </Link>
                </p>
            </form>
        </>
    )
}
