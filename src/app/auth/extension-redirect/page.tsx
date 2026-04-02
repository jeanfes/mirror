"use client"

import { useEffect, useState, Suspense } from "react"
import { createClient } from "@/lib/supabase/client"
import { useSearchParams } from "next/navigation"
import { ShieldCheck, Loader2, AlertCircle } from "lucide-react"
import Image from "next/image"

type ExtensionSyncResponse = {
    ok?: boolean
}

type ExtensionSetSessionMessage = {
    type: "SET_SESSION"
    token: string
    refreshToken: string
    openOptions: boolean
    theme: string
    language: string
    plan: "Free" | "Pro" | "Elite"
    creditsRemaining: number
    renewalDate?: string
    defaultEmojis: boolean
    autoInsert: boolean
    confirmBeforeApply: boolean
}

type ExtensionPingMessage = {
    type: "PING"
}

type ExtensionBridgeMessage = ExtensionSetSessionMessage | ExtensionPingMessage

type ExtensionRuntimeBridge = {
    lastError?: {
        message?: string
    }
    sendMessage: (
        extensionId: string,
        message: ExtensionBridgeMessage,
        callback: (response: ExtensionSyncResponse | undefined) => void
    ) => void
}

type WindowWithExtensionBridge = Window & {
    chrome?: {
        runtime?: ExtensionRuntimeBridge
    }
}

function RedirectContent() {
    const searchParams = useSearchParams()
    const nextUrl = searchParams.get("next")
    const [status, setStatus] = useState("Estableciendo conexión segura...")
    const [isSuccess, setIsSuccess] = useState(false)
    const [isError, setIsError] = useState(false)
    const [manualExtensionUrl, setManualExtensionUrl] = useState<string | null>(null)

    const isManualFallback = !isSuccess && !isError && Boolean(manualExtensionUrl)

    const title = isManualFallback
        ? "¡Conexión lista!"
        : isSuccess
            ? "Sincronización completada"
            : isError
                ? "Error de conexión"
                : "Conectando extensión"

    const helperText = isManualFallback
        ? "La conexión está lista. Abre la extensión para completar el inicio de sesión."
        : isSuccess
            ? "La sesión quedó sincronizada con la extensión."
            : isError
                ? status
                : ""

    useEffect(() => {
        const sendWithRetry = (
            runtime: ExtensionRuntimeBridge,
            extensionId: string,
            message: ExtensionBridgeMessage,
            attempts = 2
        ): Promise<ExtensionSyncResponse | undefined> => {
            return new Promise((resolve, reject) => {
                const attempt = (remaining: number) => {
                    runtime.sendMessage(extensionId, message, (response) => {
                        const lastError = runtime.lastError
                        if (lastError?.message) {
                            if (remaining > 1) {
                                setTimeout(() => attempt(remaining - 1), 350)
                                return
                            }

                            reject(new Error(lastError.message))
                            return
                        }

                        resolve(response)
                    })
                }

                attempt(attempts)
            })
        }

        const proceedToExtension = async () => {
            if (!nextUrl || !nextUrl.startsWith("chrome-extension://")) {
                setStatus("Acceso inválido a la extensión.")
                setIsError(true)
                return
            }

            const extensionId = new URL(nextUrl).hostname
            const supabase = createClient()
            const { data: { session } } = await supabase.auth.getSession()

            if (session?.access_token && session.user?.id) {
                const browserWindow = window as WindowWithExtensionBridge
                const userId = session.user.id

                const [
                    { data: userSettings },
                    { data: account }
                ] = await Promise.all([
                    supabase
                        .from("user_settings")
                        .select("theme, language, default_emojis, auto_insert, confirm_before_apply")
                        .eq("user_id", userId)
                        .maybeSingle(),
                    supabase
                        .from("user_account")
                        .select("plan, credits_remaining, renewal_date")
                        .eq("user_id", userId)
                        .maybeSingle()
                ])

                if (browserWindow.chrome?.runtime?.sendMessage) {
                    try {
                        const runtime = browserWindow.chrome.runtime
                        const theme = userSettings?.theme === "auto" ? "system" : userSettings?.theme || "light"
                        const language = userSettings?.language || "es"
                        const plan = (account?.plan || "Free") as "Free" | "Pro" | "Elite"
                        const creditsRemaining = account?.credits_remaining || 0
                        const renewalDate = account?.renewal_date || undefined
                        const defaultEmojis = typeof userSettings?.default_emojis === "boolean" ? userSettings.default_emojis : true
                        const autoInsert = typeof userSettings?.auto_insert === "boolean" ? userSettings.auto_insert : false
                        const confirmBeforeApply = typeof userSettings?.confirm_before_apply === "boolean"
                            ? userSettings.confirm_before_apply
                            : false

                        const message: ExtensionSetSessionMessage = {
                            type: "SET_SESSION",
                            token: session.access_token,
                            refreshToken: session.refresh_token || "",
                            openOptions: true,
                            theme,
                            language,
                            plan,
                            creditsRemaining,
                            renewalDate,
                            defaultEmojis,
                            autoInsert,
                            confirmBeforeApply
                        }

                        const finalUrl = `${nextUrl}#access_token=${encodeURIComponent(session.access_token)}&refresh_token=${encodeURIComponent(session.refresh_token || "")}&theme=${encodeURIComponent(theme)}&language=${encodeURIComponent(language)}&plan=${encodeURIComponent(plan)}&creditsRemaining=${encodeURIComponent(String(creditsRemaining))}&defaultEmojis=${encodeURIComponent(String(defaultEmojis))}&autoInsert=${encodeURIComponent(String(autoInsert))}&confirmBeforeApply=${encodeURIComponent(String(confirmBeforeApply))}`

                        setStatus("Transfiriendo credenciales a la extensión...")

                        const pingResponse = await sendWithRetry(runtime, extensionId, { type: "PING" }, 2)
                        if (!pingResponse?.ok) {
                            setManualExtensionUrl(finalUrl)
                            setStatus("Autorización lista")
                            return
                        }

                        const response = await sendWithRetry(runtime, extensionId, message)
                        if (response?.ok) {
                            setStatus("Sesión sincronizada correctamente.")
                            setIsSuccess(true)
                        } else {
                            setManualExtensionUrl(finalUrl)
                            setStatus("Autorización lista")
                        }
                    } catch (err) {
                        const { data: { session: latestSession } } = await supabase.auth.getSession()
                        if (latestSession?.access_token) {
                            const fallbackUrl = `${nextUrl}#access_token=${encodeURIComponent(latestSession.access_token)}&refresh_token=${encodeURIComponent(latestSession.refresh_token || "")}`
                            setManualExtensionUrl(fallbackUrl)
                            setStatus("Autorización lista")
                            return
                        }

                        setStatus("No pudimos completar la sincronización en este intento.")
                        setIsError(true)
                    }
                } else {
                    const fallbackUrl = `${nextUrl}#access_token=${encodeURIComponent(session.access_token)}&refresh_token=${encodeURIComponent(session.refresh_token || "")}`
                    setManualExtensionUrl(fallbackUrl)
                    setStatus("Autorización lista")
                }
            } else {
                setStatus("Sesión expirada. Redirigiendo al login...")
                setTimeout(() => {
                    window.location.href = `/auth/login?next=${encodeURIComponent(nextUrl)}`
                }, 1500)
            }
        }

        void proceedToExtension()
    }, [nextUrl])

    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-bg-main p-6 overflow-hidden">

            {/* Background decorations for a subtle premium feel */}
            <div className="absolute top-0 inset-x-0 h-64 bg-linear-to-b from-primary-light/5 dark:from-white/5 to-transparent pointer-events-none" />

            {/* Main Box */}
            <div className="w-full max-w-100 flex flex-col items-center text-center bg-surface-base dark:bg-[#0a0a0a] border border-border-soft dark:border-white/10 rounded-4xl p-10 shadow-premium-md relative z-10">

                {/* Icon Container */}
                <div className="mb-8 relative flex items-center justify-center">
                    {(isSuccess || isManualFallback) ? (
                        <div className="size-16 rounded-full bg-success-soft-bg dark:bg-success/10 border border-success-soft-border dark:border-success/20 text-success flex items-center justify-center animate-premium-fade shadow-premium-sm">
                            <ShieldCheck className="size-7" strokeWidth={2.5} />
                        </div>
                    ) : isError ? (
                        <div className="size-16 rounded-full bg-danger-soft-bg dark:bg-danger/10 border border-danger-soft-border dark:border-danger/20 text-danger flex items-center justify-center animate-premium-fade shadow-premium-sm">
                            <AlertCircle className="size-7" strokeWidth={2.5} />
                        </div>
                    ) : (
                        <div className="size-16 rounded-full bg-surface-elevated border border-border-soft dark:border-white/10 text-primary-text flex items-center justify-center shadow-premium-sm">
                            <Loader2 className="size-6 text-primary-dark dark:text-white animate-spin opacity-80" strokeWidth={2.5} />
                        </div>
                    )}
                </div>

                {/* Text Content */}
                <div className="space-y-6 w-full">
                    <div className="space-y-2 relative">
                        <h1 className="text-[22px] font-bold tracking-[-0.02em] text-primary-dark">
                            {title}
                        </h1>
                        <p className="text-[14px] font-medium text-secondary-text">
                            {isSuccess || isManualFallback ? helperText : status}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 min-h-12.5 flex flex-col justify-end w-full">
                        {isSuccess ? (
                            <div className="space-y-3 w-full animate-premium-fade">
                                <button
                                    onClick={() => window.location.href = "/profiles"}
                                    className="neo-btn-primary w-full h-11 rounded-xl font-semibold text-[14px] shadow-sm flex items-center justify-center focus:outline-none"
                                >
                                    Ir al Dashboard
                                </button>
                            </div>
                        ) : isManualFallback ? (
                            <div className="w-full animate-premium-fade">
                                <button
                                    onClick={() => {
                                        if (manualExtensionUrl) {
                                            window.location.href = manualExtensionUrl
                                        }
                                    }}
                                    className="neo-btn-primary w-full h-11 rounded-xl font-semibold text-[14px] shadow-premium-sm flex items-center justify-center focus:outline-none"
                                >
                                    Abrir extensión
                                </button>
                            </div>
                        ) : isError ? (
                            <div className="w-full animate-premium-fade">
                                <button
                                    onClick={() => window.location.reload()}
                                    className="neo-btn-primary w-full h-11 rounded-xl font-semibold text-[14px] shadow-premium-sm flex items-center justify-center focus:outline-none"
                                >
                                    Reintentar conexión
                                </button>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>

            {/* Minimal Footer */}
            <div className="absolute bottom-10 flex items-center justify-center opacity-40 gap-1.5 align-middle">
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-primary-dark leading-none -mb-0.5">Mirror</span>
                <Image src="/icon.png" alt="Logo" width={14} height={14} priority />
            </div>
        </div>
    )
}

export default function ExtensionRedirectPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen w-full items-center justify-center bg-bg-main text-secondary-text text-[14px] font-medium">
                Cargando pasarela...
            </div>
        }>
            <RedirectContent />
        </Suspense>
    )
}
