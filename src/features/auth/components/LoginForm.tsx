"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff } from "lucide-react"
import { ROUTES } from "@/lib/routes"
import { Button } from "@/components/ui/Button"
import { useLanguageStore } from "@/store/useLanguageStore"
import { createLoginSchema, type LoginValues } from "../schemas"
import { useLogin } from "../hooks/useLogin"
import { Input } from "@/components/ui/Input"
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



    return (
        <>
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
                    autoComplete="current-password"
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
                    bottomRight={
                        <Link 
                            href={ROUTES.auth.forgotPassword}
                            className="text-[13px] font-medium text-secondary-text hover:text-accent-blue transition-colors"
                        >
                            {t.auth.forgotPasswordLink}
                        </Link>
                    }
                />

                <Button
                    variant="primary"
                    className="w-full h-11 text-[15px] mt-2 shadow-premium-sm"
                    type="submit"
                    disabled={isAnyLocked}
                    loading={isPending || isNavigating}
                    loadingLabel={t.app.signingIn}
                >
                    {t.auth.loginBtn}
                </Button>

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
